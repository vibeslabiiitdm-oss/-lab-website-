import os

# Define the updated scholar blocks
blocks_to_replace = {
    # 1) Anu Jexline Joseph
    "scholar-cs24d0001": """    id: "scholar-cs24d0001",
    avatar: "/images/scholar-cs24d0001.jpg",
    resume: "/resumes/scholar-cs24d0001_resume.pdf",
    role: "scholar",
    category: "PhD",
    name: "Anu Jexline Joseph",
    designation: "PhD Scholar · Cattle Biometrics & Face Recognition",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS24D0001@iiitdm.ac.in",
    bio: "PhD scholar specializing in cattle biometrics, with research focused on the recognition and identification of cattle using biometric traits in real-world environments. Additionally experienced in pose-invariant human face identification, contributing to robust biometric solutions across both animal and human domains.",
    joined: 2024,
    domains: ["Biometrics", "Computer Vision", "Machine Learning"],
    skills: ["AI/ML and Biometrics", "Teaching qualities", "Communication skills", "Python", "Computer Vision"],
    education: [
      {
        degree: "M.E.",
        field: "Computer Science Engineering",
        institute: "Loyola-ICAM College of Engineering and Technology, Chennai",
        year: "2023 (CGPA: 9.1)",
      },
      {
        degree: "B.E.",
        field: "Computer Science Engineering",
        institute: "St. Peter’s College of Engineering, Chennai",
        year: "2001",
      },
    ],
    experience: [
      {
        role: "Lab Instructor",
        org: "Mar Gregorious College of Arts and Science, Chennai",
        duration: "June 2021 — October 2021",
      },
      {
        role: "Lecturer",
        org: "CMRIT College of Technology, Bengaluru",
        duration: "September 2004 — October 2005",
      },
      {
        role: "Lecturer",
        org: "Magna Engineering College, Chennai",
        duration: "February 2002 — May 2004",
      },
    ],
    publications: [
      {
        id: "pub-8",
        title:
          "Pose-Invariant Biometric Recognition of Cattle Using 2D Visual and 3D Structural Features",
        venue: "PReMI",
        year: 2025,
        month: 12,
        type: "Conference",
        domain: "Biometrics",
        abstract: "Cattle identification in precision livestock farming is often hampered by the animal's uncooperative movements, which lead to extreme pose variations. This paper proposes a pose-invariant biometric recognition system for cattle. By combining 2D visual muzzle/face images with anthropometrically derived 3D structural characteristics, we build a representation that is robust to pose changes. The method achieves high identification accuracy on visible-light datasets under unconstrained farm conditions.",
      },
      {
        id: "pub-13",
        title: "Pose-Invariant 2D Face Verification by Combining MICA and 2D Features",
        venue: "CVIP",
        year: 2024,
        month: 12,
        type: "Conference",
        domain: "Biometrics",
        abstract: "Traditional 2D face recognition systems fail under severe head pose variations, while acquiring raw 3D facial scans is computationally expensive and impractical. We propose a pose-invariant face verification system that combines 2D feature matching with 3D face reconstruction from a single 2D image using the MICA model. By aligning 2D feature representations with the reconstructed 3D facial structure, our approach achieves high verification accuracy under large pose angles without requiring 3D capture hardware.",
      },
    ],
    awards: [],
    conferences: [],
    researchProject: {
      title: "Pose-Invariant Biometric Recognition of Cattle Using 2D Visual and 3D Structural Features",
      abstract: "Cattle individuality recognition has emerged as a critical aspect of contemporary precision livestock farming. Biometric identifiers, specifically muzzle and facial features, are gaining traction as key components in this domain. This project proposes a novel multi-biometric approach for enhanced cattle individuality recognition. The system leverages advanced object detection models, specifically YOLOv8, to identify cattle based on muzzle and facial features. Pre-processing techniques and data augmentation strategies are employed to improve model robustness.",
      datasets: ["Visible-light Cattle Muzzle & Face Dataset"],
      results: [
        "Proposed a pose-invariant biometric recognition system for cattle combining 2D visual muzzle/face images with anthropometrically derived 3D structural characteristics, achieving high identification accuracy.",
        "Developed a 2D face verification system combining 2D feature matching with 3D face reconstruction from a single 2D image using the MICA model, achieving high verification accuracy under large pose angles."
      ]
    }""",

    # 2) Devika K
    "scholar-cs25m1014": """    id: "scholar-cs25m1014",
    avatar: "/images/scholar-cs25m1014.jpg",
    resume: "/resumes/scholar-cs25m1014_resume.pdf",
    role: "scholar",
    category: "PG",
    name: "Devika K",
    designation: "M.Tech Student · Data Science & AI",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS25M1014@iiitdm.ac.in",
    bio: "Software Engineer skilled in C, Python, and AI/ML with experience in real-time and distributed system design. Strong foundation in computer vision, embedded systems, Linux-based development, and SDLC practices. Focused on applying AI/ML and software engineering to power systems, control, and industrial automation.",
    joined: 2025,
    domains: ["Computer Vision", "Natural Language Processing", "Anomaly Detection", "Deep Learning"],
    skills: ["C", "C++", "Python", "SQL", "PyTorch", "TensorFlow", "Keras", "OpenCV", "NumPy", "Pandas", "MongoDB", "Git", "YOLO", "Image Processing"],
    education: [
      {
        degree: "M.Tech (Ongoing)",
        field: "Data Science and Artificial Intelligence",
        institute: "IIITDM Kancheepuram",
        year: "Joined 2025 (CGPA: 8.67)",
      },
      {
        degree: "B.Tech",
        field: "Computer Science and Engineering",
        institute: "LBS College of Engineering, Kasaragod",
        year: "2024 (CGPA: 8.85)",
      },
    ],
    publications: [],
    awards: [
      {
        id: "award-devika-1",
        title: "Qualified GATE 2025 (Score: 476, AIR: 8357)",
        org: "GATE",
        year: 2025,
        month: 2,
      }
    ],
    conferences: [],
    projects: [
      "Clinical Decision Support System — Multi-Agent Distributed AI Platform (FastAPI, Python, asyncio)",
      "AI-Based Traffic Violation Detection System (OpenCV, YOLO)",
      "Real-Time Camera Disturbance & Monitoring System (Anomaly Detection, CV, ML)",
      "Malayalam OCR System (CNN + CRNN + CTC decoding, TensorFlow, Android)",
    ],
    researchProject: {
      title: "Clinical Decision Support System — Multi-Agent Distributed AI Platform",
      abstract: "Designed a distributed 7-microservice system using Python and FastAPI with asynchronous communication for real-time workflows. Incorporates parallel multi-agent execution using asyncio, reducing latency, improving system responsiveness, and validating AI/ML models with validation, fallback logic, and reliability constraints.",
      datasets: [],
      results: [
        "Designed parallel multi-agent execution using asyncio, reducing latency and improving system responsiveness.",
        "Built scalable API-driven services (JSON-RPC, HTTP) ensuring modular and fault-tolerant design.",
        "Implemented audit logging and applied AI/ML models with validation, fallback logic, and reliability constraints."
      ]
    }""",

    # 3) Tirukandyur Sowmith
    "scholar-cs25m1006": """    id: "scholar-cs25m1006",
    avatar: "/images/scholar-cs25m1006.jpeg",
    resume: "/resumes/scholar-cs25m1006_resume.pdf",
    role: "scholar",
    category: "PG",
    name: "Tirukandyur Sowmith",
    designation: "M.Tech Student · Data Science & AI",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS25M1006@iiitdm.ac.in",
    bio: "Detail-oriented AI Data Science M.Tech student specializing in building predictive models and data-driven systems. Strong foundation in Python, Deep Learning, and NLP, complemented by industry experience at Intel. Quick learner actively expanding into LLMs and advanced Computer Vision to solve complex, real-world problems.",
    joined: 2025,
    domains: ["Natural Language Processing", "Computer Vision", "Large Language Models", "Machine Learning", "Data Science"],
    skills: ["Python", "SQL", "C++", "Java", "R", "PyTorch", "TensorFlow", "LangChain", "Hugging Face", "OpenCV", "Scikit-learn", "Git", "MySQL", "ChromaDB", "SQLite3"],
    education: [
      {
        degree: "M.Tech (Ongoing)",
        field: "CSE (Artificial Intelligence and Data Science)",
        institute: "IIITDM Kancheepuram",
        year: "Joined 2025 (CGPA: 8.75)",
      },
      {
        degree: "B.Tech",
        field: "Artificial Intelligence and Data Science",
        institute: "Malla Reddy College of Engineering and Technology (MRCET)",
        year: "2025 (CGPA: 8.5)",
      },
    ],
    experience: [
      {
        role: "Machine Learning Intern",
        org: "Intel (Remote)",
        duration: "June 2023",
      },
    ],
    publications: [],
    awards: [],
    conferences: [],
    projects: [
      "LLM-Driven Defect Knowledge Base & Recommendation Engine (LangChain, ChromaDB/FAISS, RAG)",
      "Plant Disease Vision System: Classical ML to Transformers (PCA, SVM, DenseNet201, ViT)",
      "Predictive Analytics for Cardiovascular Risk Assessment (Random Forest, SQLite3)",
    ],
    researchProject: {
      title: "Plant Disease Vision System: Classical ML to Transformers",
      abstract: "Designed a comprehensive plant disease identification system spanning classical ML techniques (GLCM, LBP, PCA with SVM/KNN/Random Forest) to advanced deep learning and transformer architectures. Scaled optimization using OpenCV pipelines and fine-tuned a DenseNet201 CNN and a Vision Transformer (ViT) on a 10,000-image dataset to prove the superior spatial pattern recognition of transformer architectures.",
      datasets: ["10,000-image Plant Disease Dataset"],
      results: [
        "Extracted manual image features using GLCM and LBP, applying PCA for dimensionality reduction to train baseline classification models.",
        "Advanced to deep learning by optimizing a 10,000-image dataset via OpenCV pipelines and fine-tuning a DenseNet201 CNN.",
        "Designed and trained a Vision Transformer (ViT), proving the superior spatial pattern recognition of transformer architectures."
      ]
    }""",

    # 4) Pakala Lohith
    "scholar-cs23b2030": """    id: "scholar-cs23b2030",
    avatar: "/images/scholar-cs23b2030.jpeg",
    resume: "/resumes/scholar-cs23b2030_resume.pdf",
    role: "scholar",
    category: "UG",
    name: "Pakala Lohith",
    designation: "B.Tech Student · Computer Science (AI Major)",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS23B2030@iiitdm.ac.in",
    bio: "Computer Science (AI) undergraduate at IIITDM Kancheepuram. Hands-on experience in machine learning, computer vision, and full-stack AI systems. Built real-world AI applications including intelligent surveillance, medical imaging, and local LLM tools.",
    joined: 2023,
    domains: ["Computer Vision", "Machine Learning", "Full-Stack AI", "Deep Learning"],
    skills: ["Python", "C", "SQL", "MySQL", "Scikit-learn", "PyTorch", "OpenCV", "XGBoost", "Whisper", "Ollama", "LLaMA", "FastAPI", "Flask", "Streamlit", "Docker", "Git", "Linux"],
    education: [
      {
        degree: "B.Tech (Ongoing)",
        field: "Computer Science & Engineering (Artificial Intelligence)",
        institute: "IIITDM Kancheepuram",
        year: "2023-Present (CGPA: 7.69)",
      },
      {
        degree: "Higher Secondary",
        field: "MPC",
        institute: "Narayana Group Of Education, Vijayawada",
        year: "2023 (944/1000)",
      },
    ],
    experience: [
      {
        role: "Joint Secretary, Student Council",
        org: "IIITDM Kancheepuram",
        duration: "April 2025 - April 2026",
      },
    ],
    publications: [],
    awards: [],
    conferences: [],
    projects: [
      "Bone Age Prediction from Hand Radiographs (PyTorch, Regression + Classification, 7.38 MAE)",
      "Text guided Brain Tumor segmentation using Vision-Language Model (CLIP, BioClinicalBERT, BraTS 2020)",
      "Intelligent Surveillance System (YOLOv8 + ResNet-18, PyQt Interface)",
      "AI Customer Feedback Analyzer using Local LLMs (Mistral, Flask, SQLite)",
    ],
    researchProject: {
      title: "Text-Guided Brain Tumor Segmentation using Vision-Language Models",
      abstract: "Developed a multimodal brain tumor segmentation system integrating FLAIR MRI scans and radiology reports using CLIP, BioClinicalBERT, cross-attention fusion, and a FiLM-conditioned U-Net on the BraTS 2020 dataset. Proved that vision-language fusion significantly improves segmentation outcomes compared to image-only models.",
      datasets: ["BraTS 2020"],
      results: [
        "Achieved a Dice score of 0.828 on the BraTS 2020 dataset.",
        "Designed and evaluated three segmentation architectures (Image-Only, Concatenation Fusion, Cross-Attention VLM).",
        "Demonstrated a 13.2% Dice improvement and 19.5% reduction in HD95 over the image-only baseline."
      ]
    }""",

    # 5) Sudarshan Sudhakar
    "scholar-cs23b2007": """    id: "scholar-cs23b2007",
    avatar: "/images/scholar-cs23b2007.jpeg",
    resume: "/resumes/scholar-cs23b2007_resume.pdf",
    role: "scholar",
    category: "UG",
    name: "Sudarshan Sudhakar",
    designation: "B.Tech Student · Computer Science (AI Major)",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS23B2007@iiitdm.ac.in",
    bio: "B.Tech student in CSE (Artificial Intelligence) at IIITDM Kancheepuram. Active developer and AI researcher with internship experience as AI Engineer. Deployed microservices and built 15+ production agentic workflows with LangGraph and Claude Code.",
    joined: 2023,
    domains: ["Natural Language Processing", "Agentic Workflows", "Deep Learning", "Software Engineering"],
    skills: ["Python", "JavaScript", "TypeScript", "SQL", "Claude Code", "Cursor", "Antigravity", "Transformers", "LangGraph", "PyTorch", "Docker", "FastAPI", "PostgreSQL", "Redis"],
    education: [
      {
        degree: "B.Tech (Ongoing)",
        field: "Computer Science & Engineering (Artificial Intelligence)",
        institute: "IIITDM Kancheepuram",
        year: "Expected May 2027 (GPA: 3.2/4.0)",
      },
    ],
    experience: [
      {
        role: "Artificial Intelligence Intern",
        org: "Yellow.ai (Abu Dhabi, UAE)",
        duration: "May 2025 – Jul 2025",
      },
      {
        role: "AI Engineer Intern",
        org: "SwitchIT (Remote)",
        duration: "Sep 2025 – Present",
      },
    ],
    publications: [],
    awards: [
      {
        id: "award-sudarshan-1",
        title: "Top 100 Nationally – Amazon ML Challenge 2025 (70,000+ participants)",
        org: "Amazon",
        year: 2025,
        month: 8,
      },
      {
        id: "award-sudarshan-2",
        title: "1st Runner-Up – ETHIndia Defy ’26 Hackathon (SafeKeeper SOLIDITY project)",
        org: "ETHIndia",
        year: 2026,
        month: 2,
      },
      {
        id: "award-sudarshan-3",
        title: "Winner – AI/ML Hackathon, IIITDM Kancheepuram 2024 (R2=0.998 forecasting model)",
        org: "IIITDM Kancheepuram",
        year: 2024,
        month: 10,
      },
    ],
    conferences: [],
    projects: [
      "Two-Stage FDI Attack Detector – Transformer & Sequence Modelling (NARX + Attention Bi-LSTM, smart grid cyber security)",
      "SwitchIT – Microservices Career Platform with Agentic AI Companion (Groq, pgvector, React, TypeScript)",
      "SafeKeeper – On-Chain Liquidation Insurance Protocol (Solidity, Ethereum, ZK integration)",
    ],
    researchProject: {
      title: "Two-Stage FDI Attack Detector – Transformer & Sequence Modelling",
      abstract: "Developed a biologically motivated and transformer-based security model to detect False Data Injection (FDI) attacks in smart grids. Utilizes a NARX and Attention Bi-LSTM architecture with Isolation Forest and Cumulative Sum (CUSUM) control charts on time-series battery data to enable secure, real-time cyber-physical anomaly detection.",
      datasets: ["ACN-Data-Static (85K+ sessions)"],
      results: [
        "Achieved 97.9% F1-score and 99.9% recall on anomaly detection tasks.",
        "Designed async ETL pipelines cutting processing latency by 35% using Docker-based microservices.",
        "Constructed a multi-tool orchestration workflow using LangGraph state machines for autonomous incident response."
      ]
    }""",

    # 6) Rohit Kumar
    "scholar-cs23b2053": """    id: "scholar-cs23b2053",
    avatar: "/images/scholar-cs23b2053.jpg",
    resume: "/resumes/scholar-cs23b2053_resume.pdf",
    role: "scholar",
    category: "UG",
    name: "Rohit Kumar",
    designation: "B.Tech Student · Computer Science (AI Major)",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS23B2053@iiitdm.ac.in",
    bio: "B.Tech. CSE (AI Major) student at IIITDM Kancheepuram passionate about building scalable software systems and intelligent AI solutions. Experienced in full-stack engineering, deep learning, and high-performance computing with hands-on projects in ML, computer vision, and distributed systems.",
    joined: 2023,
    domains: ["High Performance Computing", "Computer Vision", "Deep Learning", "Full-Stack Development"],
    skills: ["C++", "JavaScript", "Python", "C", "SQL", "React.js", "Next.js", "Tailwind CSS", "Redux Toolkit", "Node.js", "Express.js", "FastAPI", "MongoDB", "MySQL", "AWS (S3)", "PyTorch", "TensorFlow", "scikit-learn", "OpenCV", "CUDA", "OpenMP", "MPI"],
    education: [
      {
        degree: "B.Tech (Ongoing)",
        field: "Computer Science and Engineering (Major: Artificial Intelligence)",
        institute: "IIITDM Kancheepuram",
        year: "2023 - 2027 (CGPA: 9.14/10)",
      },
    ],
    publications: [],
    awards: [
      {
        id: "award-rohit-1",
        title: "Qualified GATE CSE 2026 (AIR 3966)",
        org: "GATE",
        year: 2026,
        month: 2,
      },
      {
        id: "award-rohit-2",
        title: "LeetCode Knight (Peak rating 1904, 500+ solved)",
        org: "LeetCode",
        year: 2025,
        month: 12,
      },
      {
        id: "award-rohit-3",
        title: "Semifinalist, Flipkart GRiD 7.0",
        org: "Flipkart",
        year: 2025,
        month: 11,
      },
    ],
    conferences: [],
    projects: [
      "Bone Age Prediction from Hand Radiographs (PyTorch, ResNet34 regression + classification)",
      "Text-Guided Brain Tumor Segmentation using Vision-Language Models (TG-SwinUNet, BraTS 2020)",
      "AttendX — Smart QR-based attendance management system (React, Express, MongoDB, JWT)",
    ],
    researchProject: {
      title: "Text-Guided Brain Tumor Segmentation using Vision-Language Models",
      abstract: "Designed TG-SwinUNet on the BraTS 2020 dataset, integrating a Swin Transformer encoder with BiomedVLP-CXR-BERT. Features multi-level FiLM fusion at three skip-connection levels and a cross-attention bottleneck for spatial word-to-region mapping, optimized using a composite loss function (Dice, Focal, Boundary, Contrastive).",
      datasets: ["BraTS 2020"],
      results: [
        "Achieved Dice 0.856, IoU 0.776, and Hausdorff distance of 21.66 pixels.",
        "Implemented Text-Guided Attention Gates (TGAG) and Deep Supervision heads.",
        "Proved text modality benefit with a +0.010 Dice and +0.011 IoU improvement over an image-only baseline."
      ]
    }""",

    # 7) Efanio Jens
    "scholar-cs24b2051": """    id: "scholar-cs24b2051",
    avatar: "/images/scholar-cs24b2051.jpg",
    resume: "/resumes/scholar-cs24b2051_resume.pdf",
    role: "scholar",
    category: "UG",
    name: "Efanio Jens",
    designation: "B.Tech Student · Computer Science (AI Major)",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS24B2051@iiitdm.ac.in",
    bio: "B.Tech Computer Science and Engineering student majoring in AI at IIITDM Kancheepuram. Academic proficiency with a 9.63 CGPA. Experience in full-stack web development and explainable AI projects, currently researching explainable multimodal biometrics at ViBeS Lab.",
    joined: 2024,
    domains: ["Explainable AI", "Multimodal Biometrics", "Full-Stack Development", "Computer Vision"],
    skills: ["JavaScript", "Next.js", "React.js", "PostgreSQL", "MySQL", "Python", "Flask", "HTML", "CSS", "TensorFlow", "Algorithms", "Technical Writing", "Problem Solving"],
    education: [
      {
        degree: "B.Tech (Ongoing)",
        field: "Computer Science and Engineering (Major: AI)",
        institute: "IIITDM Kancheepuram",
        year: "Expected June 2028 (CGPA: 9.63/10)",
      },
      {
        degree: "Class 12",
        field: "CBSE",
        institute: "Union Christian Public School",
        year: "2024 (97.0 %)",
      },
    ],
    experience: [
      {
        role: "Software Developer Intern",
        org: "IIITDM Kancheepuram Hostel Office",
        duration: "July 2025 – August 2025",
      },
      {
        role: "Research Assistant",
        org: "IIITDM Kancheepuram, Visual Surveillance and Biometrics Laboratory",
        duration: "August 2025 - Present",
      },
    ],
    publications: [],
    awards: [
      {
        id: "award-efanio-1",
        title: "Inter IIIT Hackathon – Udbhav Finalist",
        org: "Udbhav",
        year: 2025,
        month: 11,
      },
      {
        id: "award-efanio-2",
        title: "CS50 & CS50AI Certificates",
        org: "Harvard University",
        year: 2024,
        month: 12,
      },
    ],
    conferences: [],
    projects: [
      "LingoLearn (Flask, HTML, CSS, JS, MySQL, Docker)",
      "FX — Explainable AI Fitness Companion (Next.js, Tailwind, InterpretML, SHAP)",
    ],
    researchProject: {
      title: "Explainable Multimodal Biometrics for Continuous Authentication",
      abstract: "Conducted research at the ViBeS Lab on the applications of explainable multimodal biometrics for continuous authentication. The project investigates neural architectures and feature fusion techniques that preserve user privacy while providing explanations of decisions to maintain transparency and robust security.",
      datasets: [],
      results: [
        "Studied and implemented explainable AI frameworks (InterpretML, SHAP) for biometric signal analysis.",
        "Investigated continuous user authentication models using multi-modal physiological and behavioral signals.",
        "Developed an AI companion application leveraging explainable AI algorithms for cardiovascular and activity monitoring."
      ]
    }""",

    # 8) Apurba Roy
    "scholar-ced19i053": """    id: "scholar-ced19i053",
    avatar: "/images/apurba_roy.jpg",
    role: "scholar",
    category: "Alumni",
    name: "Apurba Roy",
    designation: "Alumni · Software Engineer at Trimble",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CED19I053@iiitdm.ac.in",
    bio: "Software Engineer at Trimble. Former Research Scholar at ViBeS Lab specializing in cattle biometrics and high-performance computing.",
    joined: 2019,
    domains: ["Biometrics", "Computer Vision", "Parallel Computing"],
    skills: [
      "React",
      "React Native",
      "Firebase",
      "Redux",
      "OpenMP",
      "MPI",
      "C++",
      "Java",
      "Python",
      "JavaScript",
      "TypeScript",
      "Android",
      "SQL",
    ],
    education: [
      {
        degree: "B.Tech",
        field: "Computer Science & Engineering",
        institute: "IIITDM Kancheepuram",
        year: "2019 - 2024 (CGPA: 8.7)",
      },
      {
        degree: "Higher Secondary",
        field: "Science",
        institute: "Jenkins School",
        year: "2017 - 2019 (CGPA: 9.4)",
      },
    ],
    publications: [
      {
        id: "pub-apurba-1",
        title: "Cattle Identification through Multi-Biometric Features and Edge Device",
        venue: "CVIP",
        year: 2024,
        month: 12,
        type: "Conference",
        domain: "Biometrics",
        abstract: "Non-invasive, automated cattle identification is essential for traceability and herd management. We propose a multi-biometric system utilizing both muzzle patterns and facial features. The system employs the YOLOv8 object detector for real-time localization of biometric regions, followed by classification. To make the system viable for farm environments, we deploy the model on an edge device and accelerate the large-scale image preprocessing by 6x using OpenMP and MPI. Real-world testing shows an individuality recognition accuracy of 90.39%.",
      },
    ],
    awards: [],
    conferences: [
      {
        id: "conf-apurba-1",
        name: "CVIP 2024",
        place: "IIITDM Kancheepuram, Chennai",
        year: 2024,
        month: 12,
        role: "Presenter",
      },
    ],
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/apurba-roy-7b9970184/" },
      { label: "GitHub", href: "https://github.com/apurbar06" },
    ],
    resume: "/resumes/apurba_roy_resume.pdf",
    researchProject: {
      title: "Cattle Identification through Multi-Biometric Features and Edge Device",
      abstract:
        "Cattle individuality recognition has emerged as a critical aspect of contemporary precision livestock farming. Biometric identifiers, specifically muzzle and facial features, are gaining traction as key components in this domain. This project proposes a novel multi-biometric approach for enhanced cattle individuality recognition. The system leverages advanced object detection models, specifically YOLOv8, to identify cattle based on muzzle and facial features. Pre-processing techniques and data augmentation strategies are employed to improve model robustness. The proposed method is implemented as a real-time edge device application, demonstrating its potential for practical agricultural use.",
      datasets: ["Indian Cattle Biometric Database (5,000+ face & muzzle images) [https://github.com/RahulRaman2/Indian-Cattle-Biometric-Database]"],
      results: [
        "Developed a real-time edge device application achieving an individuality recognition accuracy of 90.39%.",
        "Created and curated the Indian Cattle Biometric Database exceeding 5,000 face and muzzle images (available at https://github.com/RahulRaman2/Indian-Cattle-Biometric-Database).",
        "Applied OpenMP and MPI to parallelize large-scale image processing, accelerating execution time by 6x.",
      ],
    }""",

    # 9) Sukesh Babu V S
    "sukesh_babu": """    id: "sukesh_babu",
    avatar: "/images/sukesh_babu.jpg",
    role: "scholar",
    category: "PhD",
    name: "Sukesh Babu V S",
    designation: "PhD Scholar",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS22D0001@iiitdm.ac.in",
    bio: "Teaching Assistant at IIITDM Kancheepuram.",
    joined: 2022,
    domains: ["Computer Vision", "Deep Learning", "Autonomous Mobile Robots", "Pedestrian Detection"],
    skills: ["Python", "C++", "C", "SQL", "OpenCV", "TensorFlow", "PyTorch", "YOLOv7", "Transformers", "MECSA", "Swin Transformer"],
    education: [
      {
        degree: "M.Tech",
        field: "Computer Science & Engineering",
        institute: "IIITDM Kancheepuram",
        year: "2012",
      },
      {
        degree: "B.E.",
        field: "Computer Science & Engineering",
        institute: "Visvesvaraya Technological University",
        year: "2010",
      },
    ],
    experience: [
      {
        role: "Assistant Professor",
        org: "Mahaguru Institute of Technology",
        duration: "2012 - 2022",
      },
      {
        role: "Lecturer",
        org: "Visvesvaraya Institute of Engineering Technology",
        duration: "2007 - 2010",
      },
      { role: "Teaching Assistant", org: "IIITDM Kancheepuram", duration: "2022 - Present" },
    ],
    awards: [
      {
        id: "award-sukesh-1",
        title: "Qualified UGC-NET (Dec 2012)",
        org: "UGC",
        year: 2012,
        month: 12,
      },
      { id: "award-sukesh-2", title: "GATE Qualified", org: "MHRD", year: 2015, month: 3 },
    ],
    conferences: [],
    projects: [
      "M.Tech Project: Fault-Tolerant Clock Synchronization in Distributed Systems",
      "B.E. Project: Production Tracking System (VB.NET, SQL Server)",
    ],
    links: [
      { label: "Google Scholar", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "ORCID", href: "#" },
    ],
    resume: "/resumes/sukesh_babu_resume.pdf",
    researchProject: {
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
    }""",

    # 10) Sahith Gundreddy
    "scholar-cs21m1001": """    id: "scholar-cs21m1001",
    role: "scholar",
    category: "Alumni",
    name: "Sahith Gundreddy",
    designation: "Alumni · Software Engineer (R&D) at TVS Motor Company",
    affiliation: "ViBeS Lab, IIITDM & TVS Motor Company",
    email: "srinivasgundreddysahith@gmail.com",
    bio: "Software Engineer (R&D) at TVS Motor Company. Former Research Intern at ViBeS Lab specializing in deep learning, ADAS, and trajectory estimation.",
    joined: 2021,
    domains: ["Visual Surveillance", "Deep Learning", "ADAS"],
    skills: [
      "Python",
      "Embedded C",
      "MATLAB",
      "OpenCV",
      "TensorFlow",
      "Dlib",
      "ADAS",
      "AUTOSAR",
      "PyTorch",
      "Deep Learning",
      "Machine Learning",
    ],
    education: [
      {
        degree: "M.Tech",
        field: "Computer Science & Engineering (spl. Data Science & AI)",
        institute: "IIITDM Kancheepuram",
        year: "2021 - 2023 (CGPA: 9.05)",
      },
      {
        degree: "B.Tech",
        field: "Computer Science & Engineering",
        institute: "Malla Reddy College of Engineering & Technology",
        year: "2017 - 2021 (CGPA: 8.40)",
      },
    ],
    experience: [
      {
        role: "Software Engineer (R&D)",
        org: "TVS Motor Company",
        duration: "Jul 2023 - Present",
      }
    ],
    projects: [
      "Visual Surveillance: Developed modules for real-time face detection and pedestrian property analysis for autonomous vehicles.",
      "Fundus Denoising Autoencoder: Implemented autoencoders to remove noise from fundus images.",
      "Draw In Air: Utilized OpenCV to capture and display air-drawn images on a computer screen.",
      "Detecting Manufacturing Defects: Employed CNNs for automated production quality control.",
    ],
    professionalService: [
      "Distinguished Speaker, reviewer, session chair, hackathons organizer, Execomm member in IEEE Vehicular Technology Society and reviewer of IEEE journal Intelligent Transportation Systems.",
    ],
    outreachActivities: [
      "Coordinator for workshops on computer vision at IIITDM Kancheepuram.",
    ],
    publications: [
      {
        id: "pub-sahith-1",
        title:
          "Perspective Distortion Model for Pedestrian Trajectory Prediction for Consumer Applications",
        venue: "IEEE Transactions on Consumer Electronics",
        year: 2023,
        month: 9,
        type: "Journal",
        domain: "Visual Surveillance",
        url: "https://ieeexplore.ieee.org/abstract/document/10258358",
        abstract: "Predicting pedestrian trajectories is a critical task for Advanced Driver Assistance Systems (ADAS) and autonomous vehicles. We propose a novel Perspective Distortion Model (PDM) that estimates the future trajectory of a pedestrian using monocular camera images and vehicle ego-motion data (speed and yaw rate). By analyzing the perspective distortion of the pedestrian bounding box over time, the system predicts 3D coordinates of motion and proactively triggers collision warnings (TTC). Evaluated on benchmark dashcam datasets, PDM achieves low latency and trajectory prediction errors under 5%.",
      },
    ],
    awards: [
      {
        id: "award-sahith-1",
        title: "Institute Award for Highest CGPA in MTech CSE",
        org: "IIITDM Kancheepuram",
        year: 2023,
        month: 5,
      },
      {
        id: "award-sahith-2",
        title: "Beacon of Excellence Award",
        org: "TVS R&D",
        year: 2023,
        month: 12,
      },
    ],
    conferences: [],
    avatar: "/images/sahith.jpg",
    resume: "/resumes/sahith_resume.pdf",
    researchProject: {
      title: "Visual Surveillance and ADAS Trajectory Prediction",
      abstract:
        "Spearheaded algorithm development for Adaptive Cruise Control (ACC) and monocular depth analysis in ADAS. Implemented robust pedestrian trajectory estimation models optimized for embedded systems. Implemented and validated AUTOSAR application architecture complying with ISO 26262 - Functional Safety, SAE J3061 - Cybersecurity Standards, ASPICE and integration for the whole Infotainment System platform, completing virtual, BSW integration, and system-level tests.",
      datasets: ["TIHAAN AGV Dataset"],
      results: [
        "Designed and implemented AUTOSAR, ISO 26262, and SAE J3061 compliant firmware for electric vehicle control units.",
        "Developed a Rider Scoring neural network model achieving 98.6% accuracy for real-time behavior analysis.",
        "Designed and implemented dynamic regression model for Remaining Time to Charge estimation with 99.1% accuracy, achieving seamless integration into MCU firmware by converting into tflite model.",
        "Spearheaded algorithm development for Adaptive Cruise Control (ACC), from camera input using computer vision with 95.3% accuracy and implementing on evaluation board integrated into vehicle with real time processing.",
        "Engineered Python-based GUI automation tools for project end to end code generators, infotainment dashboards, streamlining software development and testing workflows.",
        "Strengthened intellectual property portfolio by filing 10+ invention disclosures and delivering robust software for standalone telematics units."
      ],
    }"""
}

def update_file(file_path):
    print(f"Updating {file_path}...")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    for target_id, replacement_block in blocks_to_replace.items():
        # Find the scholar object in scholars array
        # It starts with id: "target_id" or id: 'target_id'
        id_pattern_double = f'id: "{target_id}"'
        id_pattern_single = f"id: '{target_id}'"
        
        pos = content.find(id_pattern_double)
        if pos == -1:
            pos = content.find(id_pattern_single)
            
        if pos == -1:
            print(f"Warning: could not find {target_id} in {file_path}")
            continue
            
        # Find the start of the object block containing this id.
        # We search backwards to find the opening brace '{' of the object
        start_brace = content.rfind("{", 0, pos)
        if start_brace == -1:
            print(f"Error: could not find opening brace for {target_id}")
            continue
            
        # Find the closing brace '}' corresponding to this opening brace.
        # We scan forwards keeping track of brace nesting
        nest_count = 0
        end_brace = -1
        for idx in range(start_brace, len(content)):
            if content[idx] == "{":
                nest_count += 1
            elif content[idx] == "}":
                nest_count -= 1
                if nest_count == 0:
                    end_brace = idx
                    break
                    
        if end_brace == -1:
            print(f"Error: could not find closing brace for {target_id}")
            continue
            
        # We replace the text from start_brace + 1 to end_brace with the new block content
        original_block = content[start_brace:end_brace+1]
        
        # Format the replacement block with braces
        formatted_replacement = "{\n" + replacement_block + "\n  }"
        
        content = content[:start_brace] + formatted_replacement + content[end_brace+1:]
        print(f"Successfully updated scholar: {target_id}")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

# Update both lab.ts files
update_file(r"c:\Users\vempa\OneDrive\Desktop\Lab Website\frontend\src\data\lab.ts")
update_file(r"c:\Users\vempa\OneDrive\Desktop\Lab Website\admin\src\data\lab.ts")

print("Data updates in lab.ts files completed!")
