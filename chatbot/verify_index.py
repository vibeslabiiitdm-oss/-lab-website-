import lancedb
import networkx as nx
import json

LANCEDB_PATH = "./lancedb_data"
GRAPH_PATH = "./graph.json"

def main():
    print("=== RAG Index Verification ===")
    
    # 1. Check LanceDB
    try:
        db = lancedb.connect(LANCEDB_PATH)
        table = db.open_table("vibes_knowledge")
        count = len(table.search().limit(10000).to_list())
        print(f"[SUCCESS] LanceDB Table 'vibes_knowledge' loaded. Total chunks: {count}")
        
        person_count = 0
        project_count = 0
        image_count = 0
        pdf_count = 0
        
        all_rows = table.search().limit(10000).to_list()
        for r in all_rows:
            meta = json.loads(r["metadata"])
            t = meta.get("type")
            if t == "person":
                person_count += 1
            elif t == "project":
                project_count += 1
            elif t == "image":
                image_count += 1
            elif t == "pdf":
                pdf_count += 1
                
        print(f"  - Persons indexed: {person_count}")
        print(f"  - Projects indexed: {project_count}")
        print(f"  - Images indexed: {image_count}")
        print(f"  - PDFs indexed: {pdf_count}")
        
    except Exception as e:
        print(f"[ERROR] Failed to load LanceDB: {e}")

    # 2. Check Graph
    try:
        with open(GRAPH_PATH, "r") as f:
            graph_data = json.load(f)
        graph = nx.node_link_graph(graph_data)
        
        print(f"[SUCCESS] Knowledge Graph loaded.")
        print(f"  - Total Nodes: {graph.number_of_nodes()}")
        print(f"  - Total Edges: {graph.number_of_edges()}")
    except Exception as e:
        print(f"[ERROR] Failed to load Knowledge Graph: {e}")

if __name__ == "__main__":
    main()
