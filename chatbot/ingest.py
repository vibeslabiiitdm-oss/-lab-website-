import os
import json
import glob
from pathlib import Path
import networkx as nx
import pdfplumber
import lancedb
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv

load_dotenv()

LANCEDB_PATH = "./lancedb_data"
GRAPH_PATH = "./graph.json"

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vision_model = ChatGoogleGenerativeAI(model="gemini-3.5-flash")

def ingest_structured_data(graph, data_chunks):
    try:
        with open("lab_data.json", "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Could not load lab_data.json: {e}")
        return

    # Process People
    people = data.get("allPeople", [])
    for person in people:
        name = person.get("name", "")
        role = person.get("role", "")
        bio = person.get("bio", "")
        email = person.get("email", "")
        category = person.get("category", "")
        
        # Add to graph
        graph.add_node(name, type="Person", role=role)
        if category:
            graph.add_node(category, type="Category")
            graph.add_edge(name, category, relation="Belongs_To")
        
        # Expand category abbreviations
        cat_full = category
        if category == "PG":
            cat_full = "Postgraduate (PG) Student, Master's, M.Tech, MTech, PG Students"
        elif category == "UG":
            cat_full = "Undergraduate (UG) Student, Bachelor's, B.Tech, BTech, UG Students"
        elif category == "PhD":
            cat_full = "PhD Scholar, Doctorate, Doctor of Philosophy, PhD Students"
        elif category == "Alumni":
            cat_full = "Alumni, Former Member, Graduated"
            
        # Create full text profile
        profile_text = f"Name: {name}\nRole: {role}\n"
        if cat_full:
            profile_text += f"Category / Level: {cat_full}\n"
        profile_text += f"Email: {email}\nBio: {bio}\n"
        
        # Add Domains & Skills
        domains = ", ".join(person.get("domains", []))
        if domains:
            profile_text += f"Research Domains: {domains}\n"
            for domain in person.get("domains", []):
                graph.add_node(domain, type="Domain")
                graph.add_edge(name, domain, relation="Researches")

        skills = ", ".join(person.get("skills", []))
        if skills:
            profile_text += f"Skills: {skills}\n"

        # Education
        edu_list = person.get("education", [])
        for edu in edu_list:
            profile_text += f"Education: {edu.get('degree')} in {edu.get('field')} from {edu.get('institute')} ({edu.get('year')})\n"
        
        # Experience
        exp_list = person.get("experience", [])
        for exp in exp_list:
            profile_text += f"Experience: {exp.get('role')} at {exp.get('org')} ({exp.get('duration')})\n"

        proj_list = person.get("projects", [])
        for proj in proj_list:
            profile_text += f"Project: {proj}\n"
            
        # Add Research Project (which contains hardware blueprints)
        res_proj = person.get("researchProject", {})
        if res_proj and isinstance(res_proj, dict):
            rp_title = res_proj.get("title", "")
            rp_abstract = res_proj.get("abstract", "")
            if rp_title:
                profile_text += f"Primary Research Project: {rp_title}\n"
                profile_text += f"Abstract: {rp_abstract}\n"
            rp_images = res_proj.get("images", [])
            for img in rp_images:
                profile_text += f"[Image Found]: {img}\n"
            
        avatar = person.get("avatar", "")
        if avatar:
            profile_text += f"\n[Image Found]: {avatar}\n"

        # Add Publications
        pub_list = person.get("publications", [])
        for pub in pub_list:
            pub_title = pub.get("title", "")
            pub_venue = pub.get("venue", "")
            pub_year = pub.get("year", "")
            pub_type = pub.get("type", "")
            pub_abstract = pub.get("abstract", "")
            pub_domain = pub.get("domain", "")
            
            pub_text = f"Publication by {name}\nTitle: {pub_title}\nVenue: {pub_venue} ({pub_year})\nType: {pub_type}\nDomain: {pub_domain}\nAbstract: {pub_abstract}"
            
            data_chunks.append({
                "text": pub_text,
                "metadata": json.dumps({"source_id": f"[Publication: {pub_title}]", "type": "publication", "author": name})
            })

        data_chunks.append({
            "text": f"Person Profile: {name}\n" + profile_text,
            "metadata": json.dumps({"source_id": f"[Person Profile: {name}]", "type": "person", "name": name})
        })

    # Add Projects from `projects`
    projects = data.get("projects", [])
    for p in projects:
        title = p.get("title", "")
        desc = p.get("description", "")
        tags = ", ".join(p.get("tags", []))
        
        graph.add_node(title, type="Project")
        data_chunks.append({
            "text": f"Project: {title}\nDescription: {desc}\nTags: {tags}",
            "metadata": json.dumps({"source_id": f"[Project: {title}]", "type": "project", "title": title})
        })

        # Add Lab Resources / Hardware
    resources = data.get("resources", [])
    for r in resources:
        name = r.get("name", "")
        detail = r.get("detail", "")
        image = r.get("image", "")
        images_list = r.get("images_list", [])
        
        chunk_text = f"Lab Resource / Hardware: {name}\nDetails: {detail}"
        if image:
            chunk_text += f"\n![Image Found]({image})"
            
        for img_obj in images_list:
            chunk_text += f"\n- {img_obj.get('title')}: {img_obj.get('detail')}"
            chunk_text += f"\n![Image Found]({img_obj.get('file')})"
            
        data_chunks.append({
            "text": chunk_text,
            "metadata": json.dumps({"source_id": f"[Resource: {name}]", "type": "resource", "name": name})
        })

def ingest_pdfs(data_chunks):
    pdf_files = glob.glob("documents/**/*.pdf", recursive=True)
    pdf_files += glob.glob("../frontend/public/**/*.pdf", recursive=True)
    
    for pdf_path in pdf_files:
        try:
            with pdfplumber.open(pdf_path) as pdf:
                full_text = ""
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        full_text += text + "\n"
                
                if full_text.strip():
                    filename = os.path.basename(pdf_path)
                    data_chunks.append({
                        "text": f"Document: {filename}\nContent:\n{full_text}",
                        "metadata": json.dumps({"source_id": f"[PDF Document: {filename}]", "type": "pdf", "filename": filename})
                    })
        except Exception as e:
            print(f"Failed to parse PDF {pdf_path}: {e}")

def ingest_images(graph, data_chunks):
    return # Temporarily skip images to speed up ingestion
    import base64
    image_files = glob.glob("../frontend/public/**/*.{jpg,jpeg,png}", recursive=True)
    image_files += glob.glob("../frontend/src/assets/**/*.{jpg,jpeg,png}", recursive=True)
    
    system_msg = SystemMessage(content="You are an AI analyzing images for a laboratory knowledge base. Describe the image in detail, including objects, text, and overall context. Return the output as a clean text description.")
    
    # Process only a few to avoid hitting rate limits too hard if there are many. 
    # For full scale, this should be chunked/batched.
    for img_path in image_files[:20]: # Limit to 20 for this run just in case
        try:
            with open(img_path, "rb") as f:
                img_data = base64.b64encode(f.read()).decode("utf-8")
            
            mime_type = "image/jpeg"
            if img_path.lower().endswith("png"):
                mime_type = "image/png"
                
            msg = HumanMessage(content=[
                {"type": "text", "text": "Describe this image in detail."},
                {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{img_data}"}}
            ])
            
            resp = vision_model.invoke([system_msg, msg])
            description = resp.content
            filename = os.path.basename(img_path)
            
            data_chunks.append({
                "text": f"Image: {filename}\nDescription:\n{description}",
                "metadata": json.dumps({"source_id": f"[Image: {filename}]", "type": "image", "filename": filename})
            })
            
            graph.add_node(filename, type="Image")
        except Exception as e:
            print(f"Failed to process image {img_path}: {e}")

def main():
    print("Starting ingestion pipeline...")
    
    graph = nx.DiGraph()
    data_chunks = []
    
    print("Ingesting structured data...")
    ingest_structured_data(graph, data_chunks)
    
    print("Ingesting PDFs...")
    ingest_pdfs(data_chunks)
    
    print("Ingesting Images (using Gemini Vision)...")
    ingest_images(graph, data_chunks)
    
    print(f"Total chunks created: {len(data_chunks)}")
    
    print("Creating vector store with LanceDB...")
    db = lancedb.connect(LANCEDB_PATH)
    
    # Create embedded chunks
    if data_chunks:
        print("Computing embeddings...")
        texts = [chunk["text"] for chunk in data_chunks]
        vectors = embeddings.embed_documents(texts)
        
        # Prepare data for LanceDB
        lancedb_data = []
        for i, chunk in enumerate(data_chunks):
            lancedb_data.append({
                "id": str(i),
                "vector": vectors[i],
                "text": chunk["text"],
                "metadata": chunk["metadata"]
            })
            
        try:
            db.drop_table("vibes_knowledge")
        except:
            pass
            
        db.create_table("vibes_knowledge", data=lancedb_data)
        print("LanceDB table 'vibes_knowledge' created successfully.")
    
    # Save graph
    print("Saving Knowledge Graph...")
    graph_data = nx.node_link_data(graph)
    with open(GRAPH_PATH, "w") as f:
        json.dump(graph_data, f, indent=2)
        
    print("Ingestion complete!")

if __name__ == "__main__":
    main()
