import sys
import io

# Suppress initialization prints
original_stdout = sys.stdout
sys.stdout = io.StringIO()

from retriever import Retriever
retriever = Retriever()

# Restore stdout
sys.stdout = original_stdout

if len(sys.argv) > 1:
    query = sys.argv[1]
    context = retriever.retrieve(query)
    print(context)
