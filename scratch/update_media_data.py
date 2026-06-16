import os

frontend_lab_ts = r"c:\Users\vempa\OneDrive\Desktop\Lab Website\frontend\src\data\lab.ts"
admin_lab_ts = r"c:\Users\vempa\OneDrive\Desktop\Lab Website\admin\src\data\lab.ts"
backend_person_ts = r"c:\Users\vempa\OneDrive\Desktop\Lab Website\backend\src\models\Person.ts"

def update_lab_ts(file_path):
    print(f"Updating data and types in {file_path}...")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update the Person type definition
    type_target = """  researchProject?: {
    title: string;
    abstract: string;
    datasets: string[];
    results: string[];
  };"""
  
    type_replacement = """  researchProject?: {
    title: string;
    abstract: string;
    datasets: string[];
    results: string[];
    images?: string[];
    videos?: string[];
    pdfFiles?: { name: string; url: string }[];
  };"""

    if type_target in content:
        content = content.replace(type_target, type_replacement)
        print("Updated Person type definition.")
    else:
        # Check if type is already modified
        if "pdfFiles?: { name: string; url: string }[]" in content:
            print("Type definition already updated.")
        else:
            print("Warning: could not find Person type definition to update.")

    # 2. Add media arrays to Sukesh's researchProject (scholar-cs22d0001)
    # Let's locate the scholar-cs22d0001 researchProject
    pos = content.find('id: "scholar-cs22d0001"')
    if pos != -1:
        rp_pos = content.find("researchProject: {", pos)
        if rp_pos != -1:
            # Find the closing brace of researchProject
            nest_count = 0
            rp_end = -1
            for idx in range(rp_pos, len(content)):
                if content[idx] == "{":
                    nest_count += 1
                elif content[idx] == "}":
                    nest_count -= 1
                    if nest_count == 0:
                        rp_end = idx
                        break
            
            if rp_end != -1:
                original_rp = content[rp_pos:rp_end+1]
                # Let's build the new rp block
                new_rp = """researchProject: {
      title:
        "Robust Lightweight Pedestrian Detection Algorithm for Autonomous Mobile Robots (AMCR)",
      abstract:
        "Developing high-efficiency, lightweight deep learning algorithms optimized for real-time pedestrian detection on edge computing devices and autonomous mobile robots (AMCR). The focus is on handling low-light, occlusion, and multi-scale detection challenges. As part of this research, we created the CamPed (Campus Pedestrians) and Enriched CamPed datasets, captured within the IIITDM Kancheepuram campus, containing 1516 videos converted to 100K annotated frames.",
      datasets: [
        "CamPed Dataset (Campus Pedestrians, 100K images, 400K annotations) [https://github.com/RahulRaman2/CamPed-Dataset]",
        "Enriched CamPed Dataset (PnPLO person-like objects integration) [https://github.com/RahulRaman2/Enriched-CamPed-Dataset]"
      ],
      results: [
        "Designed COSTAA-YOLO on YOLOv7, improving detection mAP by 4.2% under scales and crowd occlusions.",
        "Developed MECSA (Multi-scale Enhanced Channel and Spatial Attention) module to capture spatial-temporal context on low-cost edge platforms.",
        "Created and annotated CamPed dataset consisting of 1516 videos split into 100K frames for benchmarking.",
        "Enriched CamPed with PnPLO data (statues, sculptures, mannequins) to reduce false-positive rates of pedestrian detectors."
      ],
      images: [
        "/images/rover/1.jpg",
        "/images/rover/2.jpg",
        "/images/rover/3.jpg",
        "/images/rover/4.jpg",
        "/images/rover/5.jpg",
        "/images/rover/6.jpg",
        "/images/rover/7.jpg",
        "/images/rover/8.jpg",
        "/images/rover/9.jpg",
        "/images/rover/10.jpg",
        "/images/rover/11.jpg",
        "/images/rover/12.jpg",
        "/images/rover/13.jpg",
        "/images/rover/14.jpg",
        "/datasets/camped/Table.png"
      ],
      videos: [
        "/videos/rover/case_1.mp4",
        "/videos/rover/case_2.mp4",
        "/videos/rover/case_3.mp4",
        "/videos/rover/case_5.mp4"
      ],
      pdfFiles: [
        { name: "CamPed Dataset Phase 1 Report", url: "/datasets/camped/Phase1.pdf" },
        { name: "CamPed Dataset Phase 2 Report", url: "/datasets/camped/Phase2.pdf" },
        { name: "CamPed Dataset Phase 3 Report", url: "/datasets/camped/phase3.pdf" },
        { name: "PnPLO Person-Like Objects Dataset Report", url: "/datasets/camped/PnPLO_INK.pdf" }
      ]
    }"""
                content = content[:rp_pos] + new_rp + content[rp_end+1:]
                print("Successfully updated Sukesh's researchProject with media and PDFs.")
            else:
                print("Error: could not find closing brace of Sukesh's researchProject.")
        else:
            print("Error: could not find Sukesh's researchProject block.")
    else:
        print("Error: could not find Sukesh's ID in lab.ts.")

    # 3. Add media arrays to Ramkumar's researchProject (scholar-coe19b001)
    # Re-read or re-locate since string changed length
    pos = content.find('id: "scholar-coe19b001"')
    if pos != -1:
        rp_pos = content.find("researchProject: {", pos)
        if rp_pos != -1:
            # Find the closing brace of researchProject
            nest_count = 0
            rp_end = -1
            for idx in range(rp_pos, len(content)):
                if content[idx] == "{":
                    nest_count += 1
                elif content[idx] == "}":
                    nest_count -= 1
                    if nest_count == 0:
                        rp_end = idx
                        break
            
            if rp_end != -1:
                # Let's replace the block
                new_rp = """researchProject: {
      title: "Monocular Depth Analysis Controlled GPS Denied AGV Navigation for Seamless Tracking",
      abstract:
        "Developing navigation and tracking pipelines for AGVs in GPS-denied environments. Created a real-time 3-model pipeline leveraging YOLOv4, Deep-SORT, and a geometry-based ML model (PDM) for monocular object trajectory prediction.",
      datasets: ["TIHAAN AGV Dataset"],
      results: [
        "Proposed a geometry-based ML model (PDM) for object trajectory prediction with a monocular camera.",
        "Created a real-time 3-model pipeline using YOLOv4, Deep-SORT, and PDM model.",
        "Achieved trajectory prediction error under 5% in real-world test scenarios."
      ],
      images: [
        "/images/rover/1.jpg",
        "/images/rover/2.jpg",
        "/images/rover/3.jpg",
        "/images/rover/4.jpg",
        "/images/rover/5.jpg",
        "/images/rover/6.jpg",
        "/images/rover/7.jpg",
        "/images/rover/8.jpg"
      ],
      videos: [
        "/videos/rover/case_1.mp4",
        "/videos/rover/case_2.mp4"
      ]
    }"""
                content = content[:rp_pos] + new_rp + content[rp_end+1:]
                print("Successfully updated Ramkumar's researchProject with media.")
            else:
                print("Error: could not find closing brace of Ramkumar's researchProject.")
        else:
            print("Error: could not find Ramkumar's researchProject block.")
    else:
        print("Error: could not find Ramkumar's ID in lab.ts.")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)


def update_backend_person_ts(file_path):
    print(f"Updating backend Person model schema in {file_path}...")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    target_schema = """const ResearchProjectSchema = new Schema({
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  datasets: [{ type: String }],
  results: [{ type: String }],
});"""

    replacement_schema = """const ResearchProjectSchema = new Schema({
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  datasets: [{ type: String }],
  results: [{ type: String }],
  images: [{ type: String }],
  videos: [{ type: String }],
  pdfFiles: [{
    name: { type: String, required: true },
    url: { type: String, required: true }
  }]
});"""

    if target_schema in content:
        content = content.replace(target_schema, replacement_schema)
        print("Successfully updated backend Person model schema.")
    else:
        if "pdfFiles: [{" in content:
            print("Backend schema already updated.")
        else:
            print("Warning: could not find target schema to update in Person.ts.")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

update_lab_ts(frontend_lab_ts)
update_lab_ts(admin_lab_ts)
update_backend_person_ts(backend_person_ts)
print("Finished all data updates!")
