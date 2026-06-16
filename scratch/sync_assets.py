import os
import shutil

# Sources
photos_src = r"c:\Users\vempa\OneDrive\Desktop\Lab Website\Photo (File responses)"
resumes_src = r"c:\Users\vempa\OneDrive\Desktop\Lab Website\Latest Resume (File responses)"

# Mappings of roll number to ID
mappings = {
    "CS24M1018": "scholar-cs24m1018",
    "CS23M1013": "scholar-cs23m1013",
    "CS24D0001": "scholar-cs24d0001",
    "CS25M1006": "scholar-cs25m1006",
    "CS25M1014": "scholar-cs25m1014",
    "CS23B2007": "scholar-cs23b2007",
    "CS23B2030": "scholar-cs23b2030",
    "CS24B2051": "scholar-cs24b2051",
    "CS23B2053": "scholar-cs23b2053"
}

# Destinations
dests = [
    {
        "photos": r"c:\Users\vempa\OneDrive\Desktop\Lab Website\frontend\public\images",
        "resumes": r"c:\Users\vempa\OneDrive\Desktop\Lab Website\frontend\public\resumes"
    },
    {
        "photos": r"c:\Users\vempa\OneDrive\Desktop\Lab Website\admin\public\images",
        "resumes": r"c:\Users\vempa\OneDrive\Desktop\Lab Website\admin\public\resumes"
    }
]

for d in dests:
    os.makedirs(d["photos"], exist_ok=True)
    os.makedirs(d["resumes"], exist_ok=True)

    # Copy photos
    print(f"Copying Photos to {d['photos']}...")
    for filename in os.listdir(photos_src):
        ext = os.path.splitext(filename)[1].lower()
        for roll, new_name in mappings.items():
            if roll in filename:
                src_path = os.path.join(photos_src, filename)
                dst_path = os.path.join(d["photos"], f"{new_name}{ext}")
                shutil.copy2(src_path, dst_path)
                print(f"Copied {filename} -> {new_name}{ext}")
                break

    # Copy resumes
    print(f"Copying Resumes to {d['resumes']}...")
    for filename in os.listdir(resumes_src):
        ext = os.path.splitext(filename)[1].lower()
        for roll, new_name in mappings.items():
            if roll in filename:
                src_path = os.path.join(resumes_src, filename)
                dst_path = os.path.join(d["resumes"], f"{new_name}_resume{ext}")
                shutil.copy2(src_path, dst_path)
                print(f"Copied {filename} -> {new_name}_resume{ext}")
                break

print("\nAsset synchronization completed successfully!")
