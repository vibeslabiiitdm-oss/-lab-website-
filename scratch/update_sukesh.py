import os

def update_sukesh(file_path):
    print(f"Updating Sukesh in {file_path}...")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the sukesh object start
    pos = content.find('id: "scholar-cs22d0001"')
    if pos == -1:
        print("Error: Could not find Sukesh ID")
        return

    # Add avatar if not already present
    if 'avatar: "/images/sukesh_babu.jpg"' not in content[pos:pos+200]:
        insert_pos = content.find("\n", pos) + 1
        content = content[:insert_pos] + '    avatar: "/images/sukesh_babu.jpg",\n' + content[insert_pos:]
        print("Added avatar path.")
        # Re-locate pos since string length changed
        pos = content.find('id: "scholar-cs22d0001"')

    # Locate researchProject block starting after Sukesh's ID
    rp_pos = content.find("researchProject: {", pos)
    if rp_pos == -1:
        print("Error: Could not find researchProject block for Sukesh")
        return

    # Find closing brace of researchProject
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

    if rp_end == -1:
        print("Error: Could not find closing brace of researchProject")
        return

    # New researchProject block
    new_rp_block = """researchProject: {
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
    }"""

    # Replace old researchProject block with new one
    content = content[:rp_pos] + new_rp_block + content[rp_end+1:]
    print("Successfully updated researchProject block.")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

update_sukesh(r"c:\Users\vempa\OneDrive\Desktop\Lab Website\frontend\src\data\lab.ts")
update_sukesh(r"c:\Users\vempa\OneDrive\Desktop\Lab Website\admin\src\data\lab.ts")

print("Sukesh data updates completed!")
