import fs from 'fs';

function appendToLabTs() {
    const filePath = "frontend/src/data/lab.ts";
    let content = fs.readFileSync(filePath, "utf-8");

    const newPubs = [
        {
            id: "pub-j-new-1",
            title: "MECSA: a multi-scale enhanced channel and spatial attention module for robust pedestrian detection",
            venue: "Pattern Analysis and Applications, Springer London",
            year: 2026,
            month: 7,
            type: "Journal",
            domain: "Visual Surveillance",
            url: "https://link.springer.com/article/10.1007/s10044-026-01634-x",
            author: "V. S. Sukesh Babu, Rahul Raman",
            authorId: "rahul_raman"
        },
        {
            id: "pub-c-new-2",
            title: "Enhancing Aerial Pedestrian Detection via High-Resolution P2 Feature Integration in YOLOv12",
            venue: "AERO-HPR Workshop, CVPR 2026",
            year: 2026,
            month: 6,
            type: "Conference",
            domain: "Visual Surveillance",
            url: "https://openaccess.thecvf.com/content/CVPR2026W/AERO-HPR/papers/S_Enhancing_Aerial_Pedestrian_Detection_via_High-Resolution_P2_Feature_Integration_in_CVPRW_2026_paper.pdf",
            author: "Sukesh Babu V S, Rahul Raman, Sambit Bakshi",
            authorId: "rahul_raman"
        }
    ];

    let pubStrings = "";
    for (const pub of newPubs) {
        pubStrings += "        {\n";
        for (const [k, v] of Object.entries(pub)) {
            if (typeof v === 'string') {
                pubStrings += `          ${k}: "${v}",\n`;
            } else {
                pubStrings += `          ${k}: ${v},\n`;
            }
        }
        pubStrings += "        },\n";
    }

    // Add to Rahul Raman
    const posGuide = content.indexOf('id: "guide-rahul-raman"');
    const posGuidePubs = content.indexOf('publications: [', posGuide);
    if (posGuidePubs !== -1) {
        const insertPos = posGuidePubs + 'publications: ['.length + 1;
        content = content.slice(0, insertPos) + pubStrings + content.slice(insertPos);
    }
    
    // Add to Sukesh Babu
    const posSukesh = content.indexOf('id: "scholar-cs22d0001"');
    const posSukeshPubs = content.indexOf('publications: [', posSukesh);
    if (posSukeshPubs !== -1) {
        const insertPos = posSukeshPubs + 'publications: ['.length + 1;
        content = content.slice(0, insertPos) + pubStrings + content.slice(insertPos);
    }

    fs.writeFileSync(filePath, content, "utf-8");
    console.log("Updated frontend lab.ts");
}

appendToLabTs();
