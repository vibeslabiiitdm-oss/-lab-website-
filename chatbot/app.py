import sys
sys.modules['torch'] = None

import streamlit as st
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv

# Import our new multi-stage retriever
from retriever import Retriever

# 1. Load Environment Variables
load_dotenv()

st.title("ViBeS Lab Website - AI Assistant (Gemini Powered)")
st.write("Ask anything about the lab, projects, or team members!")

# 2. Initialize the LLM (Using Google Gemini)
llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash")

# Initialize our new Retriever in session state to avoid reloading it on every interaction
if "retriever" not in st.session_state:
    try:
        st.session_state.retriever = Retriever()
        st.session_state.retriever_ready = True
    except Exception as e:
        st.session_state.retriever_ready = False
        st.error(f"Could not load Retriever: {e}\nPlease run ingest.py first.")

# --- SIDEBAR (Left Side: Files, Photos & Settings) ---
with st.sidebar:
    st.title("⚙️ Settings & Debug")
    debug_rag = st.checkbox("Enable DEBUG_RAG Mode", value=False)
    
    st.write("---")
    st.title("📂 Files & Photos")
    st.write("Upload images for visual context!")
    
    # Upload box for multiple photos/files
    uploaded_files = st.file_uploader("Upload Images", type=["png", "jpg", "jpeg"], accept_multiple_files=True)
    
    st.write("---")
    st.write("🧠 **Knowledge Base**")
    
    if st.button("Reload Knowledge Base"):
        st.write("Reloading Retriever...")
        try:
            st.session_state.retriever = Retriever()
            st.session_state.retriever_ready = True
            st.success("Successfully loaded Knowledge Base.")
        except Exception as e:
            st.session_state.retriever_ready = False
            st.error(f"Failed to load: {e}")

# --- MAIN CHAT AREA ---
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

for msg in st.session_state.chat_history:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

if user_prompt := st.chat_input("Message the Lab Assistant..."):
    with st.chat_message("user"):
        st.markdown(user_prompt)
    st.session_state.chat_history.append({"role": "user", "content": user_prompt})
    
    # Build the Context from the advanced RAG pipeline
    context = ""
    if st.session_state.get("retriever_ready", False):
        if debug_rag:
            st.info("DEBUG_RAG: Starting retrieval pipeline...")
        # Get context from dense, sparse, graph, and cross-encoder reranking
        context_str = st.session_state.retriever.retrieve(user_prompt, top_k=5, debug=debug_rag)
        if debug_rag:
            st.success("DEBUG_RAG: Context retrieved successfully.")
            with st.expander("View Retrieved Context (Top 5)"):
                st.write(context_str)
        context = "Context from ViBeS Lab database:\n" + context_str + "\n\n"
    else:
        context = "Context: No database connected.\n\n"

    # Hallucination Prevention in the Prompt
    system_msg_content = """You are a helpful AI assistant for the ViBeS Lab (Vision, Bio-metrics & Security Lab) at IIITDM Kancheepuram.
Your goal is to answer user queries STRICTLY based on the provided context from the lab's knowledge base. 
If the context does not contain the answer, do not guess or rely on general knowledge. Instead, explicitly state: 'I couldn't find this information in the current ViBeS Lab knowledge base.'
Whenever you provide an answer from the context, include the source citation at the end of the claim (e.g., [Person Profile: Dr. Rahul Raman] or [Project: Cattle Biometrics]).

General Information (Always available):
- Email: vibeslab.iiitdm@gmail.com
- Location: Indian Institute of Information Technology, Design & Manufacturing (IIITDM) Kancheepuram, Chennai 600127, India.
- Phone: +91 8763797907
"""
    
    message_content = [{"type": "text", "text": context + "User Question: " + user_prompt}]
    
    if uploaded_files:
        import base64
        for file in uploaded_files:
            img_data = base64.b64encode(file.read()).decode("utf-8")
            message_content.append({
                "type": "image_url", 
                "image_url": {"url": f"data:{file.type};base64,{img_data}"}
            })

    with st.chat_message("assistant"):
        response = llm.invoke([SystemMessage(content=system_msg_content), HumanMessage(content=message_content)])
        st.markdown(response.content)
        
    st.session_state.chat_history.append({"role": "assistant", "content": response.content})
