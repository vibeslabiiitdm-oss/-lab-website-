import json
import re
import time
import lancedb
import networkx as nx
from rank_bm25 import BM25Okapi
from sentence_transformers import CrossEncoder
from langchain_community.embeddings import HuggingFaceEmbeddings

LANCEDB_PATH = "./lancedb_data"
GRAPH_PATH = "./graph.json"

class Retriever:
    def __init__(self):
        print("Initializing Retriever...")
        self.db = lancedb.connect(LANCEDB_PATH)
        self.table = self.db.open_table("vibes_knowledge")
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
        print("Loading CrossEncoder...")
        self.cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2", max_length=512)
        
        print("Loading Knowledge Graph...")
        try:
            with open(GRAPH_PATH, "r") as f:
                graph_data = json.load(f)
            self.graph = nx.node_link_graph(graph_data)
        except Exception as e:
            print(f"Failed to load graph: {e}")
            self.graph = nx.DiGraph()
            
        print("Loading BM25...")
        # Fetch all data to build BM25
        # Note: In a production scale system with millions of rows, BM25 should be handled by a dedicated search engine (like Elasticsearch or MongoDB Atlas Search).
        # For this lab scale, in-memory BM25 over all chunks is perfectly fine.
        all_rows = self.table.search().limit(10000).to_list()
        self.all_chunks = [{"text": r["text"], "metadata": r["metadata"]} for r in all_rows]
        
        print("Precomputing graph entity map...")
        self.entity_to_chunks = {}
        for node in self.graph.nodes:
            if isinstance(node, str):
                self.entity_to_chunks[node] = []
                
        for chunk in self.all_chunks:
            text = chunk["text"]
            for node in self.entity_to_chunks:
                if f"Person Profile: {node}" in text or f"Project: {node}" in text:
                    self.entity_to_chunks[node].append(chunk)

        tokenized_corpus = [re.findall(r'\w+', doc["text"].lower()) for doc in self.all_chunks]
        self.bm25 = BM25Okapi(tokenized_corpus) if tokenized_corpus else None
        print("Retriever initialization complete.")

    def graph_retrieval(self, query):
        """Extract nodes from query and find neighbors"""
        matched_nodes = []
        query_lower = query.lower()
        
        for node in self.graph.nodes:
            if isinstance(node, str):
                node_l = node.lower()
                node_clean = node_l.replace("dr. ", "").replace("prof. ", "").strip()
                
                if (node_l in query_lower) or (len(node_clean) > 3 and node_clean in query_lower):
                    matched_nodes.append(node)
                else:
                    # Allow partial matches for names like "Sukesh Babu" instead of forcing "Sukesh Babu V S"
                    parts = node_clean.split()
                    if len(parts) >= 2:
                        first_last = f"{parts[0]} {parts[1]}"
                        if len(first_last) > 4 and first_last in query_lower:
                            matched_nodes.append(node)
                
        graph_context = []
        graph_chunks = []
        for node in matched_nodes:
            neighbors = list(self.graph.successors(node)) + list(self.graph.predecessors(node))
            if neighbors:
                context_str = f"[Knowledge Graph] {node} is related to: {', '.join(map(str, neighbors[:10]))}"
                graph_context.append(context_str)
                
                # Fetch full text chunks for the matched node and its immediate neighbors in O(1)
                for entity in [node] + neighbors[:10]:
                    if not isinstance(entity, str): continue
                    if entity in self.entity_to_chunks:
                        graph_chunks.extend(self.entity_to_chunks[entity])
                            
        return graph_context, graph_chunks

    def retrieve(self, query, top_k=5, debug=False):
        if debug:
            print(f"--- DEBUG RAG ---")
            print(f"Original Query: {query}")
        
        # 3. Graph Retrieval (Do this first so we can add graph_chunks)
        graph_context, graph_chunks = self.graph_retrieval(query)
        
        # 1. Dense Retrieval (Top 5 to reduce cross-encoder load)
        query_vector = self.embeddings.embed_query(query)
        dense_results = self.table.search(query_vector).limit(5).to_list()
        dense_chunks = [{"text": r["text"], "metadata": r["metadata"]} for r in dense_results]
        
        # 2. Sparse (BM25) Retrieval (Top 10)
        sparse_chunks = []
        if self.bm25:
            tokenized_query = re.findall(r'\w+', query.lower())
            sparse_scores = self.bm25.get_scores(tokenized_query)
            top_sparse_idx = sorted(range(len(sparse_scores)), key=lambda i: sparse_scores[i], reverse=True)[:5]
            sparse_chunks = [self.all_chunks[i] for i in top_sparse_idx if sparse_scores[i] > 0]
            
        # Combine and deduplicate
        combined_chunks = {}
        for chunk in dense_chunks + sparse_chunks:
            meta = chunk["metadata"]
            if meta not in combined_chunks:
                combined_chunks[meta] = chunk["text"]
                
        candidate_texts = list(combined_chunks.values())
        
        # 4. Cross-Encoder Reranking
        if not candidate_texts:
            return "\n".join(graph_context) if graph_context else "No relevant context found in the database."
            
        t_ce_start = time.time()
        cross_inp = [[query, text] for text in candidate_texts]
        scores = self.cross_encoder.predict(cross_inp)
        t_ce_end = time.time()
        print(f"[PERF] Cross-Encoder Reranking Time: {(t_ce_end - t_ce_start)*1000:.2f} ms")
        
        # Sort candidates by score
        scored_candidates = sorted(zip(candidate_texts, scores), key=lambda x: x[1], reverse=True)
        final_top_k = scored_candidates[:top_k]
        
        # Build Final Context
        context = ""
        if graph_context:
            context += "\n".join(graph_context) + "\n\n"
            
        added_texts = set()
        
        # ALWAYS inject the full text chunks of Graph-matched entities
        for chunk in graph_chunks:
            text = chunk["text"]
            if text not in added_texts:
                context += text + "\n\n"
                added_texts.add(text)
                
        # Then inject the top-K semantically reranked chunks
        for text, score in final_top_k:
            if text not in added_texts:
                context += text + "\n\n"
                added_texts.add(text)
                
        return context.strip()
