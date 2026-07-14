import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const personSchema = new mongoose.Schema({}, { strict: false });
const Person = mongoose.models.Person || mongoose.model("Person", personSchema, "people");

// Known URLs for existing publications
const URL_MAP: Record<string, string> = {
  // Sukesh Babu
  "Costaa YOLO": "https://www.sciencedirect.com/science/article/pii/S0262885625002987",
  "MECSA: Multi-scale Enhanced Channel": "https://link.springer.com/article/10.1007/s10044-026-01634-x",
  "Enhancing Aerial Pedestrian Detection via High Res": "https://openaccess.thecvf.com/content/CVPR2026W/AERO-HPR/papers/S_Enhancing_Aerial_Pedestrian_Detection_via_High-Resolution_P2_Feature_Integration_in_CVPRW_2026_paper.pdf",
  "CamPedV2": "https://dl.acm.org/doi/10.1145/3702250.3702277",
  "ROBUST PEDESTRIAN DETECTION VIA CURATED": "https://ieeexplore.ieee.org/document/10536175",
  "ROBUST PEDESTRIAN DETECTION VIA ENRICHED": "https://link.springer.com/chapter/10.1007/978-3-031-58535-7_23",
  "Pedestrian Direction Estimation: An Approach": "https://ieeexplore.ieee.org/document/9675820",
  "Deep Learning for Walking Direction": "https://ieeexplore.ieee.org/document/9530974",
  "Walking Direction Estimation using Silhouette": "https://link.springer.com/chapter/10.1007/978-3-030-95653-1_24",
  // Anu Jexline
  "Pose-Invariant Biometric Recognition of Cattle": "https://link.springer.com/chapter/10.1007/978-3-031-45170-6_29",
  "Pose-Invariant 2D Face Verification": "https://link.springer.com/chapter/10.1007/978-3-031-58535-7_10",
  // Perspective Distortion (Sahith + Ramkumar)
  "Perspective Distortion Model for Pedestrian": "https://ieeexplore.ieee.org/abstract/document/10258358",
  // Apurba
  "Cattle Identification through Multi-Biometric": "https://link.springer.com/chapter/10.1007/978-3-031-58535-7_20",
};

function findUrl(title: string): string | undefined {
  for (const [key, url] of Object.entries(URL_MAP)) {
    if (title.toLowerCase().includes(key.toLowerCase())) return url;
  }
  return undefined;
}

async function patchUrls() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const people = await Person.find({});

  for (const person of people) {
    const doc = person.toObject();
    if (!doc.publications?.length) continue;

    let changed = false;
    const updatedPubs = doc.publications.map((pub: any) => {
      if (pub.url) return pub; // already has URL
      const url = findUrl(pub.title || "");
      if (url) {
        changed = true;
        return { ...pub, url };
      }
      return pub;
    });

    if (changed) {
      await Person.updateOne({ _id: person._id }, { $set: { publications: updatedPubs } });
      console.log(`Patched URLs for: ${doc.name}`);
    }
  }

  console.log("Done.");
  await mongoose.disconnect();
}

patchUrls().catch(console.error);
