import lancedb
from langchain_community.embeddings import HuggingFaceEmbeddings
import warnings
warnings.filterwarnings('ignore')

db = lancedb.connect("./lancedb_data")
table = db.open_table("vibes_knowledge")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

query = "give me the photos of hardware used in the projects"
vector = embeddings.embed_query(query)

results = table.search(vector).limit(5).to_list()
for i, res in enumerate(results):
    print(f"--- Result {i+1} ---")
    print(f"Score: {res.get('_distance', 'N/A')}")
    print(res['text'])
    print("-" * 20)
