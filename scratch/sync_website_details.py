import os
import shutil

# Sources
details_src = r"c:\Users\vempa\OneDrive\Desktop\Lab Website\Website_Details"

# Destinations
dests = [
    {
        "photos": r"c:\Users\vempa\OneDrive\Desktop\Lab Website\frontend\public\images",
        "resumes": r"c:\Users\vempa\OneDrive\Desktop\Lab Website\frontend\public\resumes",
        "rover_images": r"c:\Users\vempa\OneDrive\Desktop\Lab Website\frontend\public\images\rover",
        "rover_videos": r"c:\Users\vempa\OneDrive\Desktop\Lab Website\frontend\public\videos\rover",
        "camped_dataset": r"c:\Users\vempa\OneDrive\Desktop\Lab Website\frontend\public\datasets\camped"
    },
    {
        "photos": r"c:\Users\vempa\OneDrive\Desktop\Lab Website\admin\public\images",
        "resumes": r"c:\Users\vempa\OneDrive\Desktop\Lab Website\admin\public\resumes",
        "rover_images": r"c:\Users\vempa\OneDrive\Desktop\Lab Website\admin\public\images\rover",
        "rover_videos": r"c:\Users\vempa\OneDrive\Desktop\Lab Website\admin\public\videos\rover",
        "camped_dataset": r"c:\Users\vempa\OneDrive\Desktop\Lab Website\admin\public\datasets\camped"
    }
]

# Standard files to copy: (src, dst_filename, type)
files_to_copy = [
    # Apurba
    (os.path.join(details_src, "Apurba", "Apurba.jpg"), "apurba_roy.jpg", "photos"),
    (os.path.join(details_src, "Apurba", "Apurba_resume.pdf"), "apurba_roy_resume.pdf", "resumes"),
    # Ramkumar
    (os.path.join(details_src, "RamKumar", "Ramkumar_Resume.pdf"), "ramkumar_r_resume.pdf", "resumes"),
    # Sahith
    (os.path.join(details_src, "Sahith", "sahith1.jpg"), "sahith.jpg", "photos"),
    (os.path.join(details_src, "Sahith", "Sahith_Resume.pdf"), "sahith_resume.pdf", "resumes"),
    # Sukesh
    (os.path.join(details_src, "Sukesh", "Photo_Personal", "Photo_New.jpg"), "sukesh_babu.jpg", "photos"),
    (os.path.join(details_src, "Sukesh", "Sukesh_CV.pdf"), "sukesh_babu_resume.pdf", "resumes"),
]

for d in dests:
    # Ensure directories exist
    for k in d:
        os.makedirs(d[k], exist_ok=True)
        
    for src, dst_name, key in files_to_copy:
        if os.path.exists(src):
            dst = os.path.join(d[key], dst_name)
            shutil.copy2(src, dst)
            print(f"Copied {src} -> {dst}")
        else:
            print(f"Warning: source file not found: {src}")

    # Copy Rover Images & Videos
    rover_img_src_dir = os.path.join(details_src, "Images_From_Lab_Rover")
    if os.path.exists(rover_img_src_dir):
        for f in os.listdir(rover_img_src_dir):
            src_file = os.path.join(rover_img_src_dir, f)
            if f.endswith(".jpg") or f.endswith(".jpeg") or f.endswith(".png"):
                dst_file = os.path.join(d["rover_images"], f)
                shutil.copy2(src_file, dst_file)
            elif f.endswith(".mp4") or f.endswith(".avi"):
                dst_file = os.path.join(d["rover_videos"], f)
                shutil.copy2(src_file, dst_file)
        print(f"Copied Rover images & videos for destination: {d['photos']}")
                
    # Copy Camped Dataset Files
    camped_src_dir = os.path.join(details_src, "Sukesh", "Camped_dataset")
    if os.path.exists(camped_src_dir):
        # copy Table.png
        table_src = os.path.join(camped_src_dir, "Table.png")
        if os.path.exists(table_src):
            shutil.copy2(table_src, os.path.join(d["camped_dataset"], "Table.png"))
        # copy PDFs from Dataset_Images
        di_src = os.path.join(camped_src_dir, "Dataset_Images")
        if os.path.exists(di_src):
            for f in os.listdir(di_src):
                if f.endswith(".pdf"):
                    shutil.copy2(os.path.join(di_src, f), os.path.join(d["camped_dataset"], f))
        print(f"Copied CamPed dataset assets for destination: {d['photos']}")

print("Assets synchronization from Website_Details completed!")
