import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Use the actual strict Person model
import { Person } from "./src/models/Person.js";

async function forceUrls() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  // Fix old Sukesh MECSA entry
  await Person.updateOne(
    { name: /Sukesh/i, "publications.title": /Multi-scale Enhanced Channel and Spatial Attention for Robust/ },
    { $set: { "publications.$.url": "https://link.springer.com/article/10.1007/s10044-026-01634-x" } }
  );
  console.log("Patched Sukesh MECSA url");

  // Fix old Sukesh Aerial entry
  await Person.updateOne(
    { name: /Sukesh/i, "publications.title": /Enhancing Aerial Pedestrian Detection via High Resolution P2/ },
    { $set: { "publications.$.url": "https://openaccess.thecvf.com/content/CVPR2026W/AERO-HPR/papers/S_Enhancing_Aerial_Pedestrian_Detection_via_High-Resolution_P2_Feature_Integration_in_CVPRW_2026_paper.pdf" } }
  );
  console.log("Patched Sukesh Aerial url");

  // Verify
  const sukesh = await Person.findOne({ name: /Sukesh/i });
  sukesh!.publications.forEach((p: any) => {
    if (/MECSA|Aerial|YOLOv12/.test(p.title)) {
      console.log(`  "${p.title.substring(0, 55)}" → ${p.url || "STILL MISSING"}`);
    }
  });

  await mongoose.disconnect();
  console.log("Done.");
}

forceUrls().catch(console.error);
