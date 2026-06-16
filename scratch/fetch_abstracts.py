import json
import urllib.request
import urllib.parse
import time

abstracts_file = r"C:\Users\vempa\.gemini\antigravity-ide\brain\9ff71a90-05cb-410b-87ce-b52cf3f9d238\scratch\abstracts.json"

with open(abstracts_file, "r", encoding="utf-8") as f:
    data = json.load(f)

def reconstruct_abstract(inverted_index):
    if not inverted_index:
        return None
    max_len = 0
    for word, positions in inverted_index.items():
        for pos in positions:
            if pos > max_len:
                max_len = pos
    words = [""] * (max_len + 1)
    for word, positions in inverted_index.items():
        for pos in positions:
            words[pos] = word
    return " ".join(words).strip()

def search_openalex(title):
    try:
        url = f"https://api.openalex.org/works?filter=title.search:{urllib.parse.quote(title)}"
        req = urllib.request.Request(url, headers={'User-Agent': 'mailto:rahul-raman-academic@example.com'})
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            results = res.get("results", [])
            for work in results:
                # Find matching title
                work_title = work.get("title", "").lower()
                if title.lower() in work_title or work_title in title.lower():
                    inv_index = work.get("abstract_inverted_index")
                    abstract = reconstruct_abstract(inv_index)
                    venue = work.get("primary_location", {}).get("source", {}).get("display_name")
                    year = work.get("publication_year")
                    return {
                        "found_title": work.get("title"),
                        "abstract": abstract,
                        "venue": venue,
                        "year": year
                    }
    except Exception as e:
        print(f"Error querying OpenAlex for '{title}': {e}")
    return None

updated = False
for title, info in data.items():
    if not info or not info.get("abstract"):
        print(f"Searching: {title}")
        result = search_openalex(title)
        if result and result.get("abstract"):
            data[title] = result
            print(f"-> Found abstract! Venue: {result.get('venue')}")
            updated = True
        else:
            print(f"-> Not found or no abstract.")
        time.sleep(1) # Be nice to API

if updated:
    with open(abstracts_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print("abstracts.json updated.")
else:
    print("No updates.")
