// This file defines the data structures and utility functions for managing lab-related information such as publications, awards, conferences, education, and people. It includes TypeScript types for each entity and functions to generate mock data for publications, awards, and conferences based on a seed value. The data structures are used to represent the lab's research output, achievements, and team members in a structured format that can be easily consumed by the frontend application.
export type Publication = {
  id: string;
  title: string;
  venue: string;
  year: number;
  month: number; // 1-12
  type:
    | "Journal"
    | "Conference"
    | "Book Chapter"
    | "Book"
    | "Patent"
    | "Scientific Magazine"
    | "Thesis";
  domain: string;
  url?: string;
  abstract?: string;
};

export type Award = { id: string; title: string; org: string; year: number; month: number };
export type Conference = {
  id: string;
  name: string;
  place: string;
  year: number;
  month: number;
  role: string;
};
export type Education = { degree: string; field: string; institute: string; year: string };

export type Person = {
  id: string;
  role: "guide" | "scholar";
  category?: "PhD" | "PG" | "UG" | "Alumni";
  name: string;
  designation: string;
  affiliation: string;
  email: string;
  bio: string;
  joined: number;
  domains: string[];
  skills: string[];
  education: Education[];
  publications: Publication[];
  customPublications?: { heading: string; items: string[] }[];
  awards: Award[];
  conferences: Conference[];
  links?: { label: string; href: string }[];
  teaching?: string[];
  experience?: { role: string; org: string; duration: string }[];
  projects?: string[];
  professionalService?: string[];
  outreachActivities?: string[];
  avatar?: string;
  resume?: string;
  researchProject?: {
    title: string;
    abstract: string;
    datasets: string[];
    results: string[];
    images?: string[];
    videos?: string[];
    pdfFiles?: { name: string; url: string }[];
  };
};

export type Project = {
  id: string;
  title: string;
  tagline: string;
  domain: string;
  status: "Ongoing" | "Completed";
  year: number;
  purpose: string;
  description: string;
  results: string[];
  tech: string[];
  collaborators?: string[];
  image: string; // gradient seed
};

export type Achievement = {
  id: string;
  title: string;
  detail: string;
  year: number;
  category: "Recognition" | "Grant" | "Patent" | "Milestone";
  org?: string;
};

const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

export const mkPubs = (seed: number, opts: { domains: string[]; n: number }): Publication[] => {
  const venues = [
    "IEEE Trans. on Information Forensics & Security",
    "Pattern Recognition",
    "CVPR Workshops",
    "ICIP",
    "ICPR",
    "Neurocomputing",
    "IET Biometrics",
    "Springer Multimedia Tools",
    "ICVGIP",
    "Expert Systems with Applications",
  ];
  const titles = [
    "Robust Periocular Recognition under Occlusion",
    "Cross-Spectral Iris Matching via Contrastive Learning",
    "Anomaly Detection in Crowded Surveillance Scenes",
    "Lightweight Face Anti-Spoofing for Edge Devices",
    "Domain-Adaptive Gait Recognition",
    "Multimodal Fusion for Soft Biometrics",
    "Self-Supervised Pretraining for Low-Light Surveillance",
    "Explainable Deepfake Detection",
    "Vision-Transformer based Re-Identification",
    "Privacy-Preserving Biometric Templates",
    "Hand Vein Pattern Segmentation",
    "Adversarially Robust Fingerprint Liveness",
  ];
  const out: Publication[] = [];
  for (let i = 0; i < opts.n; i++) {
    const y = years[(seed + i) % years.length];
    out.push({
      id: `p-${seed}-${i}`,
      title: titles[(seed * 3 + i) % titles.length],
      venue: venues[(seed + i * 2) % venues.length],
      year: y,
      month: ((seed + i * 5) % 12) + 1,
      type: i % 3 === 0 ? "Journal" : i % 3 === 1 ? "Conference" : "Book Chapter",
      domain: opts.domains[i % opts.domains.length],
    });
  }
  return out;
};

export const mkAwards = (seed: number, n: number): Award[] =>
  Array.from({ length: n }).map((_, i) => ({
    id: `a-${seed}-${i}`,
    title: [
      "Best Paper Award",
      "Outstanding Reviewer",
      "Young Researcher Grant",
      "Travel Grant",
      "Distinguished Service Award",
    ][(seed + i) % 5],
    org: ["IEEE", "Springer", "Govt. of India DST", "IAPR", "ACM"][(seed + i) % 5],
    year: years[(seed + i) % years.length],
    month: ((seed + i) % 12) + 1,
  }));

export const mkConfs = (seed: number, n: number): Conference[] =>
  Array.from({ length: n }).map((_, i) => ({
    id: `c-${seed}-${i}`,
    name: ["CVPR", "ICCV", "WACV", "ICIP", "ICPR", "BTAS", "IJCB"][(seed + i) % 7],
    place: [
      "Seattle, USA",
      "Paris, France",
      "Singapore",
      "Kyoto, Japan",
      "Sydney, AUS",
      "Hyderabad, IN",
    ][(seed + i) % 6],
    year: years[(seed + i) % years.length],
    month: ((seed + i * 2) % 12) + 1,
    role: ["Presenter", "Session Chair", "Reviewer", "Attendee"][(seed + i) % 4],
  }));

export let guide: Person = {
  id: "guide-rahul-raman",
  resume: "/resumes/guide-rahul-raman_resume.pdf",
  role: "guide",
  name: "Dr. Rahul Raman",
  designation: "Associate Professor & Lab Head",
  affiliation: "ViBeS Lab, IIITDM Kancheepuram",
  email: "rahul@iiitdm.ac.in",
  bio: "Doctorate researcher leading the Visual Surveillance & Biometrics Security Lab (ViBeS Lab) at IIITDM Kancheepuram. Active across image processing, biometrics, machine learning, and visual surveillance.",
  joined: 2021,
  domains: [
    "Visual Surveillance",
    "Biometrics",
    "Computer Vision",
    "Gen-AI",
    "Machine Learning",
    "Reinforcement Learning",
  ],
  skills: [
    "Computer Vision",
    "Deep Learning",
    "Pattern Recognition",
    "Artificial Intelligence",
    "Cyber",
  ],
  education: [
    {
      degree: "Ph.D.",
      field: "Computer Science and Engineering",
      institute: "National Institute of Technology Rourkela",
      year: "2019",
    },
    {
      degree: "M.Tech (Research)",
      field: "Computer Science and Engineering",
      institute: "National Institute of Technology Rourkela",
      year: "2014",
    },
    {
      degree: "B.Tech",
      field: "Computer Science and Engineering",
      institute: "Visvesvaraya Technological University Bangalore",
      year: "2010",
    },
  ],
  experience: [
    { role: "Assistant Professor", org: "IIITDM Kancheepuram", duration: "Mar 2021 - Present" },
    { role: "Assistant Professor", org: "VIT Vellore", duration: "June 2017 - Feb 2021" },
    { role: "Lecturer", org: "R.R. Inst. of Technology, Bangalore", duration: "1 Year" },
  ],
  teaching: [
    "Machine Learning",
    "Reinforcement Learning",
    "Introduction to Biometrics",
    "Computer Vision",
    "Digital Image Processing",
    "Agent Based Intelligent System",
    "Digital Logic and Design",
    "Computer Organization and Architecture",
    "Operating Systems",
    "Problem Solving and Programming",
    "Object Oriented Programming with C",
    "Digital Logic and Microprocessors",
    "Internet and Web Programming",
    "Computational Thinking",
  ],
  projects: [
    "Monocular Depth Analysis Controlled GPS Denied AGV Navigation for Seamless Tracking, Funded by TiHAN-IIT Hyderabad (19.02 Lakhs)",
    "Multi Biometric Analysis of Cattle for Identification and Health Monitoring, Funded by DST, Govt. of India (18.32 Lakhs)",
  ],
  professionalService: [
    "Member IEEE",
    "Guest editor at SPVS 2013: Signal Processing for Visual Surveillance",
    "Organizing chair at ICACNI 2013",
    "Session chair at WAMS 2025, CVIP 2024, RAEEUCCI 2024, ICCIDS 2024",
    "Reviewer for ACM, Springer, Elsevier, IEEE Journals",
  ],
  outreachActivities: [
    "Invited Talk: Diving Deep into the Next Generation Intelligent Transportation Systems (SRM IST, 2025)",
    "Invited Talk: Network Security and Network Science (IIITDM Kancheepuram, 2025)",
    "Invited Talk: AI-Powered Image Processing (IIITDM Kancheepuram, 2025)",
    "Invited Talk: AI, Robotics, and ROS (IIITDM Kancheepuram, 2025)",
    "Invited Talk: Next-Generation AI for Autonomous Vehicles (Mepco Schlenk, 2025)",
    "Invited Talk: Online Refresher Course on Data Science (IIITDM Kancheepuram, 2025)",
    "Invited Talk: Biometrics Security in the Generative AI Era (IIITDM Jabalpur, 2025)",
    "Invited Talk: Edge AI: Exploring Research and Industry Applications (SRM IST, 2025)",
    "Invited Talk: Applications of Generative AI Tools in Education and Research (SRM IST, 2025)",
    "Invited Talk: AI and Data Science for Healthcare (Vel Tech, 2025)",
  ],
  publications: [
    {
      id: "pub-pat-1",
      title:
        "Position and time localization of occlusion between two objects using a static camera",
      venue: "Indian Patent 1218/KOL/2013",
      year: 2013,
      month: 10,
      type: "Patent",
      domain: "Visual Surveillance",
      abstract: "An Indian Patent (1218/KOL/2013, Grant Number: 436214) describing a computer vision system and method for position and time localization of occlusion between two moving objects using a static camera in visual surveillance networks.",
    },
    {
      id: "pub-j-1",
      title: "Beyond Estimating Discrete Directions of Walk: A Fuzzy Approach",
      venue: "Machine Vision and Applications, Springer",
      year: 2018,
      month: 5,
      type: "Journal",
      domain: "Visual Surveillance",
      abstract: "Estimating the walking direction of a pedestrian is vital for applications like visual surveillance, traffic control, and autonomous vehicles. Existing methods generally produce discrete directional outputs which are insufficient for continuous human movement. This paper introduces a fuzzy logic-based approach to model pedestrian walk directions using fuzzy membership functions, offering a more robust and flexible interpretation of motion trajectories.",
    },
    {
      id: "pub-j-2",
      title: "Kinesiology-inspired Estimation of Pedestrian Walk Direction for Smart Surveillance",
      venue: "Future Generation Computer Systems, Elsevier",
      year: 2017,
      month: 10,
      type: "Journal",
      domain: "Visual Surveillance",
      abstract: "This paper proposes a novel approach for estimating the walking direction of a pedestrian by exploiting the complementary nature of video data. By incorporating kinesiology-inspired principles that analyze human body mechanics and movement patterns in video sequences, the proposed method enhances direction estimation accuracy and robustness for smart surveillance systems.",
    },
    {
      id: "pub-j-3",
      title: "Spatiotemporal optical blob reconstruction for object detection in grayscale videos",
      venue: "Multimedia Tools and Applications, Springer",
      year: 2017,
      month: 1,
      type: "Journal",
      domain: "Computer Vision",
      abstract: "Detecting moving objects in image sequences is a core computer vision task, but initial detections often contain errors where pixels belonging to the object are misclassified. To achieve refined object detection, this paper proposes a novel post-processing method for binary blobs detected in each video frame. The proposed reconstruction technique utilizes optical flow to perform nullification, bifurcation, and unification operations, significantly improving the accuracy of moving object tracking in grayscale videos.",
    },
    {
      id: "pub-j-4",
      title:
        "Direction Estimation for Pedestrian Monitoring System in Smart Cities: An HMM Based Approach",
      venue: "IEEE Access",
      year: 2016,
      month: 1,
      type: "Journal",
      domain: "Visual Surveillance",
      abstract: "The paper proposes a novel approach for direction estimation of a moving pedestrian as perceived in a 2-D coordinate of field camera. The proposed direction estimation method is intended for pedestrian monitoring in traffic control systems. Apart from traffic control, direction of motion estimation is also very important in accident avoidance system for smart cars, assisted living systems, in occlusion prediction for seamless tracking in visual surveillance, and so on. The proposed video-based direction estimation method exploits the notion of perspective distortion as perceived in monocular vision of 2-D camera co-ordinate. The temporal pattern of change in dimension of pedestrian in a frame sequence is unique for each direction; hence, the dimensional change-based feature is used to estimate the direction of motion; eight discrete directions of motion are considered and the hidden Markov model is used for classification. The experiments are conducted over CASIA Dataset A, CASIA Dataset B, and over a self-acquired dataset: NITR Conscious Walk Dataset. The balanced accuracy of direction estimation for these experiments yields satisfactory results with accuracy indices as 94.58%, 90.87%, and 95.83%, respectively. The experiment also justifies with suitable test conditions about the characteristic features, such as robustness toward improper segmentation, partial occlusion, and changing orientation of head or body during walk of a pedestrian. The proposed method can be used as a standalone system or can be integrated with existing frame-based direction estimation methods for implementing a pedestrian monitoring system.",
    },
    {
      id: "pub-j-5",
      title: "Direction prediction for avoiding occlusion in visual surveillance",
      venue: "Innovations in Systems and Software Engineering",
      year: 2016,
      month: 1,
      type: "Journal",
      domain: "Visual Surveillance",
      abstract: "Occlusion in visual surveillance systems often causes tracking loss and system failure. To address this, this paper proposes a model-based approach to predict the motion of moving subjects. The proposed system predicts the direction of a moving subject in a 3D global plane based on its appearance in a 2D camera plane. By anticipating motion trajectories and identifying potential mutual occlusions beforehand, the system can initiate proactive measures to ensure seamless object tracking.",
    },
    {
      id: "pub-j-6",
      title: "Multi-camera Localization: A Review",
      venue: "IJMISSP, Inderscience",
      year: 2013,
      month: 1,
      type: "Journal",
      domain: "Visual Surveillance",
      abstract: "This paper provides a comprehensive review of the evolution of camera localization techniques over a decade of research. It traces the transition from non-camera-equipped sensor networks to smart multi-camera systems operating in 3D environments. The review discusses the shift from centralized to distributed algorithms and covers various localization methodologies, including Euclidean geometry, Lie algebra, LED-based triangulation, epipolar geometry, and wireless sensor network protocols.",
    },
    {
      id: "pub-c-1",
      title: "Occlusion Prediction Algorithm for Multi-camera Network",
      venue: "ACM/IEEE ICDSC",
      year: 2012,
      month: 1,
      type: "Conference",
      domain: "Visual Surveillance",
      abstract: "The mode of object tracking has evolved from single camera tracking to multi-camera tracking over the last few years. Even though multi-camera model overcomes limitations present in single camera system, it introduces complexities of handling network of multiple cameras. In this paper, we propose a novel real time occlusion prediction method for multi-camera network thus reducing complexities and cost of tracking in multi-camera model without losing track of the subject. The proposed method constitutes sequential phases as (a) estimation of direction of relative motion in real plane based on change in bounding pixel positions of tracked subject, (b) constructing algorithms for occlusion prediction, and (c) mitigation of occlusion by awaking a minimal subset of cameras in network. The method uses the pattern of change in the dimensions of bounding box with respect to frame number, obtained by applying background subtraction to the video of mutual motion of the subjects. On the basis of estimated direction of motion it uses proposed algorithms to decide the possibility and proximity of occlusion and thus awaking the minimal set of camera in the network that does not encounter occlusion. The proposed approach has been verified using various video samples and is observed that the proposed method successfully predicts the occurrence of occlusion.",
    },
    {
      id: "pub-c-2",
      title: "Towards Optimized Placement of Cameras for Gait Pattern Recognition",
      venue: "ICCCS, Elsevier",
      year: 2012,
      month: 1,
      type: "Conference",
      domain: "Biometrics",
      abstract: "Locomotion of an individual i.e., gait is proven to be unique. Recent past has seen a paradigm shift while considering gait as a trusted biometric trait even though it is a behavioral biometric. The study of gait includes body mechanics, changes in muscular action, and uniqueness in body movements. For extraction of features from gait, its proper acquisition becomes an important issue. This makes placement of cameras and their localization as an important domain of research for gait pattern analysis. When gait biometric is used for identification in surveillance purpose, it works in unconstrained manner since there is no predefined path or ramp for recording the motion of a subject. The model proposed in this article approaches for determining best possible placement of optimal number of cameras in a given coverage area. The model also updates/modifies the placement of cameras as the active walking region (path-band) in that area changes temporally. Moreover the model also provides the camera system to work in master-slave mode efficiently utilize the cameras to minimize the computational complexity.",
    },
    {
      id: "pub-c-3",
      title: "Lip Pattern Recognition Based on Local Feature Extraction",
      venue: "INDICON, IEEE",
      year: 2011,
      month: 1,
      type: "Conference",
      domain: "Biometrics",
      abstract: "Cheiloscopy, the study of human lip prints, is an emerging biometric modality useful when traditional biometrics are unavailable. This paper investigates the feasibility of utilizing lip patterns for biometric recognition using local feature extraction. The proposed method processes grayscale lip images to extract distinctive local features that characterize individual uniqueness, demonstrating that lip patterns are highly permanent and represent a viable alternative for human identification systems.",
    },
    {
      id: "pub-c-4",
      title: "A Novel Approach for Eye Gaze and Tilt Estimation through Sclera Detection",
      venue: "ICACNI, Springer",
      year: 2013,
      month: 1,
      type: "Conference",
      domain: "Computer Vision",
      abstract: "Eye gaze and tilt estimation are crucial for modern human-computer interaction and biometric systems. However, traditional iris segmentation methods often assume a frontal eye and fail in unconstrained, non-cooperative environments. To address these challenges, this paper proposes a novel approach utilizing sclera detection as the primary mechanism for estimation. Because the sclera provides high contrast even in noisy or low-resolution ocular images, detecting it allows the system to robustly estimate eye gaze and tilt when the iris is partially occluded or tilted.",
    },
    {
      id: "pub-c-5",
      title: "Evaluation of Periocular over Face Biometric: A Case Study",
      venue: "Procedia Engineering, Elsevier",
      year: 2012,
      month: 1,
      type: "Conference",
      domain: "Biometrics",
      abstract: "Abstract Recognition of a person through his face is the primitive mean of human identification. Identify a person through face biometric have grown its importance through the last decade and researchers have attempted to find unique facial feature-points. Facial data also contains change with expression and age, which makes recognition through face difficult. And there has developed a stringent necessity to identify a person on partial facial data. These motives led researchers derive auxiliary biometric traits from facial image, viz. ear, lip and periocular region. In particular, periocular region has been exploited to examine the existence of uniqueness as there are many nodal points in periocular region. Classification and recognition is achieved through periocular region which shows significant accuracy, given the fact that periocular biometric uses only 25% of a complete face data.",
    },
    {
      id: "pub-c-6",
      title: "Large Scale Cloud for Biometric Identification",
      venue: "ICACNI, Springer",
      year: 2014,
      month: 1,
      type: "Conference",
      domain: "Biometrics",
      abstract: "Managing and querying biometric records for massive populations imposes high computational and storage demands. In identification mode, a query biometric template must be matched against all templates registered in the database to find the highest match-value. This paper proposes a large-scale cloud-based architecture designed to support such high-volume biometric systems. By leveraging cloud infrastructure, the architecture distributes and parallelizes the template matching process to achieve high efficiency, scalability, and fast response times.",
    },
    {
      id: "pub-c-7",
      title: "Fast Approximate Eyelid Detection for Periocular Localization",
      venue: "ICACNI, Springer",
      year: 2014,
      month: 1,
      type: "Conference",
      domain: "Biometrics",
      abstract: "Periocular biometrics has gained attention as a reliable alternative to iris and face recognition. Accurate periocular localization, however, is challenging under non-cooperative conditions where standard iris detection fails. This paper proposes a fast, approximate eyelid detection method for robust periocular localization. The method detects horizontal edges in the eye image to identify the eyelids. It then uses this eyelid boundary mapping to estimate the iris radius and anthropometrically derive the periocular region. Validated on UBIRISv1 and UBIRISv2 databases, the approach achieves high performance without requiring exhaustive searches.",
    },
    {
      id: "pub-c-8",
      title: "Detection of Web-Based Attacks by Analyzing Web Server Log Files",
      venue: "ICACNI, Springer",
      year: 2013,
      month: 1,
      type: "Conference",
      domain: "Cyber",
      abstract: "Web server access logs capture records of every request sent to a web application, providing an invaluable data source for security auditing. However, the sheer volume of server logs makes manual analysis impossible. This paper proposes a system for automated detection of web-based attacks by parsing and analyzing web server log files. The approach preprocesses raw log data, removes noise, and extracts key request signatures to identify malicious patterns such as SQL injection, cross-site scripting (XSS), and automated vulnerabilities scans, shifting defense from signature-matching to dynamic anomaly analysis.",
    },
    {
      id: "pub-c-9",
      title: "Context-based Sarcasm Detection in Hindi Tweets",
      venue: "ICAPR, IEEE",
      year: 2017,
      month: 1,
      type: "Conference",
      domain: "Gen-AI",
      abstract: "Sarcasm is a sophisticated linguistic phenomenon that poses a significant challenge for sentiment analysis by reversing the intended meaning of a statement, often using positive words to convey a negative sentiment. While sarcasm detection has been widely studied for English, resource-constrained languages like Hindi lack annotated datasets and research. This paper proposes a context-based approach for sarcasm detection in Hindi tweets, defined as a contradiction between a tweet and its related context. By using related news as context, the proposed method achieves a sarcasm detection accuracy of 87%.",
    },
    {
      id: "pub-b-1",
      title: "Smart Surveillance through Multi-camera Networks",
      venue: "LAP LAMBERT Academic Publishing",
      year: 2019,
      month: 4,
      type: "Book",
      domain: "Visual Surveillance",
      abstract: "A comprehensive book detailing research on multi-camera networks and visual surveillance. The book covers camera placement, calibration, and collaborative tracking algorithms, exploring how multiple camera viewpoints can be integrated to overcome single-camera limitations like occlusions, limited field-of-view, and blind spots to enable smart, seamless surveillance.",
    },
    {
      id: "pub-bc-1",
      title: "Fusion of shape and texture features for lip biometry in mobile devices",
      venue: "IET Book of Mobile Biometrics",
      year: 2017,
      month: 1,
      type: "Book Chapter",
      domain: "Biometrics",
      abstract: "The article presented an HMM-based mm lip recognition for limited users of a handheld device. Tests are made on two small databases. The balanced accuracy in case of three, five, and ten classes are observed. While accuracy in case of three classes (two users) is approximately 99%, it falls to approximately 90% when ten classes (nine users) are considered. From the confusion matrices, it is evident that this fall of accuracy of 10% is due to the increase in number of classes. As this research focuses on use of handheld device by limited number of users, this limitation of scalability is not an issue. This approach can satisfactorily produce performance in considered situation. For practically using this methodology, any template replacement algorithm can be embedded into the biometric system to overcome slight challenges faced due to seasonal change of lip.",
    },
    {
      id: "pub-bc-2",
      title: "Score Level Fusion of SIFT and SURF for Iris",
      venue: "Multibiometrics Systems",
      year: 2012,
      month: 1,
      type: "Book Chapter",
      domain: "Biometrics",
      abstract: "Iris recognition using local invariant features like SIFT and SURF offers high matching accuracy. However, traditional matching algorithms simply count the number of keypoint matches, which may not represent the optimal matching score. This paper proposes a score-level fusion technique that performs nearest-neighbor classification on SIFT and SURF keypoints to produce two distinct matching scores. These scores are then combined mathematically using a monotonic fusion function, providing improved separation between genuine and imposter scores compared to using SIFT alone.",
    },
    {
      id: "pub-bc-3",
      title: "A cognitive system for lip identification using convolution neural networks",
      venue: "Cognitive Systems and Signal Processing",
      year: 2021,
      month: 1,
      type: "Book Chapter",
      domain: "Artificial Intelligence",
      abstract: "Human lips possess distinct shapes and color characteristics that can serve as a biometric identifier. This book chapter proposes a cognitive system utilizing Convolutional Neural Networks (CNNs) for automated lip identification. The system leverages deep learning features to extract and classify lip representations from image inputs. Evaluated on multi-lingual datasets, the proposed CNN-based approach achieves high identification accuracies of approximately 90.10% on an English database and 91.90% on a Kannada database, demonstrating the viability of deep-learning-based lip biometrics.",
    },
    {
      id: "pub-sm-1",
      title:
        "Acquisition and corpus description of a constrained lip database captured from handheld devices",
      venue: "ACM SIGBioinformatics Record",
      year: 2017,
      month: 2,
      type: "Scientific Magazine",
      domain: "Biometrics",
      abstract: "This report describes the dataset NITRLipV2 which is a constrained lip database captured in visible spectrum from handheld device. The database provides images of lips of different subjects. The database can be used by researchers to investigate in the domain of lip-image based user identification when images are captured from front camera of handheld devices like mobile phone.",
    },
    {
      id: "pub-sm-2",
      title: "Acquisition and corpus description of NITR conscious walk dataset",
      venue: "ACM SIGBioinformatics Record",
      year: 2017,
      month: 2,
      type: "Scientific Magazine",
      domain: "Biometrics",
      abstract: "This report describes the NITR Conscious Walk Dataset which is constraint human walk database captured in visible spectrum. The database provides videos of 8 different walk directions. The 8 discrete directions spanning from 0° to 360° with respect to view axis of camera are equiangular from neighbouring directions. The video database is ideal for the estimation of pedestrian walk direction using both inter-frame and intra-frame properties, and can also be used for the further generaized study of object tracking, person reidentification, and studying gait features in different camera angles.",
    },
    {
      id: "pub-sm-3",
      title: "NITRLipV1: a constrained lip database captured in visible spectrum",
      venue: "ACM SIGBioinformatics Record",
      year: 2016,
      month: 1,
      type: "Scientific Magazine",
      domain: "Biometrics",
      abstract: "This report introduces NITRLipV1, a constrained lip database captured in the visible spectrum. The database consists of 109 high-resolution color images collected from 15 Indian volunteers under varying illumination conditions. NITRLipV1 is designed as a public research resource to facilitate the development, training, and benchmarking of computer vision algorithms for lip segmentation, cheiloscopy, and lip-image-based biometric user identification.",
    },
    {
      id: "pub-t-1",
      title: "Pedestrian Walk Direction Estimation for Smart Surveillance",
      venue: "Thesis, PhD",
      year: 2019,
      month: 1,
      type: "Thesis",
      domain: "Visual Surveillance",
      abstract: "This PhD thesis presents research on pedestrian walk direction estimation for smart visual surveillance systems. The thesis addresses the challenges of traditional surveillance networks by developing models to estimate continuous and discrete walking directions of moving subjects. Key contributions include: (a) a kinesiology-inspired direction estimation technique, (b) a hidden Markov model (HMM) approach leveraging perspective distortion features, (c) a fuzzy logic framework for continuous walk direction modeling, and (d) proactive occlusion prediction algorithms for multi-camera network coordination.",
    },
    {
      id: "pub-t-2",
      title: "Study on models for smart surveillance through multi-camera networks",
      venue: "Thesis, MTech",
      year: 2014,
      month: 1,
      type: "Thesis",
      domain: "Visual Surveillance",
      abstract: "This M.Tech research thesis explores models and algorithms for orchestrating multi-camera networks in smart surveillance systems. The work focuses on mitigating the limitations of single-camera setups, such as blind spots and tracking loss due to occlusions. The thesis presents (a) algorithms to predict the occurrence of mutual occlusion between moving objects, (b) strategies to dynamically activate a minimal subset of cameras to maintain continuous track, and (c) a comprehensive study of camera localization models inside surveillance environments.",
    },
  ],
  awards: [],
  conferences: [],
  links: [
    { label: "Google Scholar", href: "#" },
    { label: "ORCID", href: "#" },
    { label: "DBLP", href: "#" },
  ],
};

export let scholars: Person[] = [
{
    id: "scholar-cs22d0001",
    avatar: "/images/sukesh_babu.jpg",
    role: "scholar",
    category: "PhD",
    name: "Sukesh Babu V S",
    designation: "PhD Research Scholar · Computer Vision & Deep Learning",
    affiliation: "ViBeS Lab, IIITDM",
    email: "sukeshpdm@gmail.com",
    bio: "PhD Research Scholar in Computer Vision and Deep Learning. Active researcher in pedestrian detection, attention mechanisms, and autonomous systems.",
    joined: 2022,
    domains: ["Computer Vision", "Deep Learning", "Autonomous Systems", "Visual Surveillance"],
    skills: [
      "Python",
      "C",
      "C++",
      "Java",
      "PyTorch",
      "TensorFlow",
      "OpenCV",
      "MATLAB",
      "NS3",
      "QualNet",
      "Linux",
      "Windows",
    ],
    education: [
      {
        degree: "Ph.D. (Ongoing)",
        field: "Computer Science & Engineering",
        institute: "IIITDM Kancheepuram",
        year: "Joined 2022",
      },
      {
        degree: "M.Tech",
        field: "Computer Science",
        institute: "National Institute of Technology Rourkela",
        year: "2012 (CGPA: 8.23)",
      },
      {
        degree: "B.E.",
        field: "Computer Science & Engineering",
        institute: "Institution of Engineers (India)",
        year: "2007 (CGPA: 8.87)",
      },
    ],
    publications: [
      {
        id: "pub-sukesh-j1",
        title:
          "Costaa YOLO: Convolutional Swin Transformer with Attention and Anchor Optimization for Robust Pedestrian Detection",
        venue: "Image and Vision Computing",
        year: 2026,
        month: 1,
        type: "Journal",
        domain: "Visual Surveillance",
        abstract: "This paper addresses the challenges of pedestrian detection in complex, real-world scenarios, such as occlusion, high crowd density, scale variation, and visually similar distractors. We introduce the CamPed dataset, specifically curated to capture a wide range of real-world pedestrian scenarios, and propose the CoSTAA framework which enhances YOLOv7 by integrating a Convolutional Swin Transformer and improved attention mechanisms to refine feature representation. Combined with anchor box optimization, our method outperforms state-of-the-art methods when evaluated on benchmark datasets like CrowdHuman and PennFudan.",
      },
      {
        id: "pub-sukesh-j2",
        title:
          "MECSA: Multi-scale Enhanced Channel and Spatial Attention for Robust Pedestrian Detection",
        venue: "Pattern Analysis and Applications",
        year: 2026,
        month: 2,
        type: "Journal",
        domain: "Visual Surveillance",
        abstract: "Pedestrian detection in complex environments often suffers from severe occlusion, scale variation, low-light conditions, and complex backgrounds. To address these, we propose YOLOv7-MECSA, which integrates the Multi-scale Enhanced Channel and Spatial Attention (MECSA) module into the backbone architecture of YOLOv7. The MECSA module leverages a dual attention mechanism: multi-scale pooling to capture varying receptive fields, adaptive channel attention using 1D convolutions, and lightweight spatial attention using 2D convolutions with adaptive kernel sizes. Qualitative and quantitative evaluations on WiderPerson, COCO-Person, INRIA, and the Enriched CamPed datasets demonstrate consistent improvements in detection accuracy while maintaining real-time performance.",
      },
      {
        id: "pub-sukesh-c1",
        title:
          "Enhancing Aerial Pedestrian Detection via High Resolution P2 Feature Integration in YOLOv12",
        venue: "CVPRW",
        year: 2026,
        month: 6,
        type: "Conference",
        domain: "Visual Surveillance",
        abstract: "Pedestrian detection in aerial and UAV imagery is challenging due to the extremely small scale of targets, complex background clutter, and varying camera perspectives. This paper proposes an enhanced YOLOv12 architecture tailored for aerial pedestrian detection. By integrating a high-resolution P2 feature map pathway into the neck structure and optimization of the attention mechanism, the model successfully preserves fine-grained spatial features of small objects. Experimental results on UAV benchmarks show significant improvements in detection accuracy for tiny objects compared to standard YOLOv12 variants.",
      },
      {
        id: "pub-sukesh-c2",
        title: "CamPedV2: A Comprehensive Dataset for Advancing Pedestrian Detection Models",
        venue: "ICVGIP",
        year: 2025,
        month: 12,
        type: "Conference",
        domain: "Visual Surveillance",
        abstract: "To advance robust pedestrian detection models, we introduce CamPedV2, a comprehensive dataset built upon campus-based visual collections. The dataset is designed to address the limitations of existing datasets by incorporating diverse real-world lighting conditions, variable crowd densities, complex occlusions, and challenging weather augmentations. It contains extensive annotations and acts as a robust benchmarking platform for assessing modern object detectors. The paper discusses dataset curation, annotation details, and performance evaluations of state-of-the-art detectors.",
      },
      {
        id: "pub-sukesh-c3",
        title: "ROBUST PEDESTRIAN DETECTION VIA CURATED TRAINING ON CREATED DATASET",
        venue: "IEEE INDICON",
        year: 2024,
        month: 12,
        type: "Conference",
        domain: "Visual Surveillance",
        abstract: "We present a robust pedestrian detection study addressing challenges like varying lighting, crowd occlusion, and false detections of pedestrian-like objects (e.g., sculptures or figurines). We introduce the CamPed (Campus Pedestrians) dataset, featuring 100K images and 400K annotations. By evaluating models like YOLO, DETR, and RT-DETR trained on CamPed, we show that our curated training methodology significantly improves detection of small objects and crowded scenes, while providing superior rejection of pedestrian-like distractors compared to models trained on traditional public datasets.",
      },
      {
        id: "pub-sukesh-c4",
        title: "ROBUST PEDESTRIAN DETECTION VIA ENRICHED DATASET",
        venue: "CVIP",
        year: 2024,
        month: 12,
        type: "Conference",
        domain: "Visual Surveillance",
        abstract: "Accurately detecting pedestrians at multiple scales and in crowded environments remains a complex task with critical implications for autonomous vehicles and visual surveillance. This paper extends our work on the CamPed dataset by proposing an enriched dataset strategy. We integrate synthetic and real-world pedestrian-like distractors and augment images with varying environmental conditions. We show that training detectors on this enriched representation significantly reduces false alarms in complex scenarios without compromising real-time performance.",
      },
      {
        id: "pub-sukesh-c5",
        title: "Pedestrian Direction Estimation: An Approach via Perspective Distortion Patterns",
        venue: "ICITIIT",
        year: 2023,
        month: 12,
        type: "Conference",
        domain: "Visual Surveillance",
        abstract: "Estimating pedestrian walking direction is vital for traffic control, assisted living, and autonomous vehicles. This paper presents a novel video-based direction estimation method that leverages perspective distortion patterns perceived in monocular camera coordinates. The temporal pattern of change in the bounding box dimensions of a pedestrian uniquely defines their direction of motion. We extract these features and classify them into discrete directions using a Hidden Markov Model (HMM). Experiments demonstrate that this approach is robust to segmentation noise and body orientation changes.",
      },
      {
        id: "pub-sukesh-c10",
        title: "Deep Learning for Walking Direction Estimation",
        venue: "IEEE INDICON",
        year: 2024,
        month: 12,
        type: "Conference",
        domain: "Computer Vision",
        abstract: "This paper presents a deep learning-based framework for estimating the walking direction of pedestrians from visual surveillance videos. We train a CNN-LSTM network that takes sequential pedestrian bounding boxes and extracts spatio-temporal features to classify motion into eight discrete directions. The model is trained on the NITR Conscious Walk dataset and evaluated under challenging conditions, demonstrating high direction classification accuracy and robustness to partial occlusions.",
      },
      {
        id: "pub-sukesh-c11",
        title: "Walking Direction Estimation using Silhouette and Skeletal Representations",
        venue: "CVIP",
        year: 2024,
        month: 12,
        type: "Conference",
        domain: "Biometrics",
        abstract: "Walking direction estimation is crucial for trajectory prediction and collision avoidance. We propose a hybrid representation combining pedestrian silhouette images and skeletal joint coordinates to model walking direction. The silhouette captures shape deformation during motion, while skeletal keypoints track body joint dynamics. We train a multi-branch network to fuse these representations. Evaluation on CASIA and custom datasets shows that the combined representation outperforms single-modality methods.",
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
      pdfFiles: [
        { name: "CamPed Dataset Phase 1 Report", url: "/datasets/camped/Phase1.pdf" },
        { name: "CamPed Dataset Phase 2 Report", url: "/datasets/camped/Phase2.pdf" },
        { name: "CamPed Dataset Phase 3 Report", url: "/datasets/camped/phase3.pdf" },
        { name: "PnPLO Person-Like Objects Dataset Report", url: "/datasets/camped/PnPLO_INK.pdf" }
      ]
    },
  },
{
    id: "scholar-cs24d0001",
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
    }
  },
{
    id: "scholar-cs25m1014",
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
    }
  },
{
    id: "scholar-cs25m1006",
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
    }
  },
{
    id: "scholar-ec24b1028",
    resume: "/resumes/scholar-ec24b1028_resume.pdf",
    role: "scholar",
    category: "UG",
    name: "Laxmi Nivas",
    designation: "B.Tech Student",
    affiliation: "ViBeS Lab, IIITDM",
    email: "EC24B1028@iiitdm.ac.in",
    bio: "B.Tech Student at ViBeS Lab.",
    joined: 2024,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
  },
{
    id: "scholar-cs23b1022",
    resume: "/resumes/scholar-cs23b1022_resume.pdf",
    role: "scholar",
    category: "UG",
    name: "A Navaneeswar Reddy",
    designation: "B.Tech Student",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS23B1022@iiitdm.ac.in",
    bio: "B.Tech Student at ViBeS Lab.",
    joined: 2023,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
  },
{
    id: "scholar-cs23i1032",
    resume: "/resumes/scholar-cs23i1032_resume.pdf",
    role: "scholar",
    category: "UG",
    name: "Deetya A Mehta",
    designation: "B.Tech Student",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS23I1032@iiitdm.ac.in",
    bio: "B.Tech Student at ViBeS Lab.",
    joined: 2023,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
  },
{
    id: "scholar-cs23b2030",
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
    }
  },
{
    id: "scholar-cs23b2007",
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
    }
  },
{
    id: "scholar-cs23b2021",
    resume: "/resumes/scholar-cs23b2021_resume.pdf",
    role: "scholar",
    category: "UG",
    name: "Janani V",
    designation: "B.Tech Student",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS23B2021@iiitdm.ac.in",
    bio: "B.Tech Student at ViBeS Lab.",
    joined: 2023,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
  },
{
    id: "scholar-cs23b2053",
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
    }
  },
{
    id: "scholar-cs24b2051",
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
    }
  },
{
    id: "scholar-sies2611522",
    resume: "/resumes/scholar-sies2611522_resume.pdf",
    role: "scholar",
    category: "UG",
    name: "Vempali Sai Linisha",
    designation: "B.Tech Student",
    affiliation: "ViBeS Lab, IIITDM",
    email: "SIES2611522@iiitdm.ac.in",
    bio: "B.Tech Student at ViBeS Lab.",
    joined: 2026,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
  },
{
    id: "scholar-cs24m1013",
    resume: "/resumes/scholar-cs24m1013_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Ambavaram Manasa Reddy",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS24M1013@iiitdm.ac.in",
    bio: "Project: Identity-Aware Super-Resolution of Degraded Faces for Face Verification.",
    joined: 2024,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "Identity-Aware Super-Resolution of Degraded Faces for Face Verification",
      abstract: "Face verification systems perform remarkably well under controlled, high-quality conditions, but their accuracy drops considerably when the input images have been degraded by blur, noise, or JPEG compression. This situation is common in practice surveillance cameras, messaging applications, and budget-grade sensors all introduce some form of quality loss before a face reaches the verification pipeline. When this happens, the embedding model begins to drift away from the true identity representation of the individual, causing genuine pairs to appear less similar and, in some cases,making impostor pairs look deceptively close. This work investigates whether super resolution preprocessing, when trained explicitly to preserve biometric identity rather than just visual quality, can recover the verification signal lost to image degradation. We fine-tune CodeFormer\u2014a codebook based blind face restoration network anchored to a frozen VQGAN face prior\u2014on the Labeled Faces in the Wild (LFW) dataset using a three-component composite loss that combines pixel-level L1 reconstruction, a VGG-19 perceptual term, and a FaceNet- based identity penalty that directly discourages embedding drift. Training operates on a pool of 3,000 LFW images on a single NVIDIA T4 GPU. Before fine-tuning, we sweep three fidelity weight settings of the pretrained model on a balanced set of 6,000 pairs to characterise the quality-versus-identity trade-off. Biometric evaluation uses ArcFace embeddings assessed through ROC curves, AUC, Equal Error Rate (EER), and TAR at FAR = 0.1% on the full 6,000-pair official LFW benchmark. Results show that the identity-aware fine-tuned model closes the genuine-pair similarity gap and does so without inflating impostor similarity\u2014the critical security constraint for any biometric deployment.",
      datasets: [],
      results: [],
    },
},
{
    id: "scholar-cs24m1008",
    resume: "/resumes/scholar-cs24m1008_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "P. Sri Haindavi",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS24M1008@iiitdm.ac.in",
    bio: "Project: Enhancing Vehicle Safety on Roads: An AI-Driven Driver Assistance System with Dash Cameras.",
    joined: 2024,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "Enhancing Vehicle Safety on Roads: An AI-Driven Driver Assistance System with Dash Cameras",
      abstract: "Pedestrian-related accidents in urban setting are still a major issue in road safety, due to occlusion, dynamic motion and the lack of existing Advanced Driver Assistance Systems (ADAS) to anticipate pedestrian behaviour proactively. This paper provides a real time and vision-based ADAS pipeline for pedestrian detection, panoptic segmentation, multi-object tracking, trajectory prediction, and road-aware collision warning based on information from a front facing dash camera and vehicle On-Board Diagnostics (OBD). The perception pipeline uses YOLOv8-Seg for instance segmentation and BiSeNetV2 for semantic segmentation, with a panoptic fusion module that performs Hungarian matching to fuse the two outputs. The pedestrian detection is tracked across frames with the help of a dual Kalman filter and the four-stage association in the ByteTrack framework. An ego-motion compensation module is implemented to compensate camera induced apparent motion for pedestrian trajectory before prediction by taking into account OBD speed and gyro yaw rate. Such a model is custom trained directly on PIE dashcam data to predict 12 positions of future pedestrians in the ego-compensated image space. Finally, a road-aware collision warning system (TTC) is computed in real time by three complementary methods (depth-based, lateral, trajectory-based), and every pedestrian is classified as Safe (TTC > 3.0 s), Warning (1.5 s < TTC ? 3.0 s), or Alert (TTC ? 1.5 s), where the road segmentation system BiSeNetV2 prevents false alerts for pedestrians on sidewalks.",
      datasets: [],
      results: [],
    },
},
{
    id: "scholar-cs24m1018",
    avatar: "/images/scholar-cs24m1018.png",
    resume: "/resumes/scholar-cs24m1018_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Vaagdevhi Varkkala",
    designation: "Alumni · M.Tech in Data Science & AI",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS24M1018@iiitdm.ac.in",
    bio: "M.Tech Graduate from IIITDM Kancheepuram with a specialization in Data Science and Artificial Intelligence. Recipient of IndiaAI Research Fellowship for Monocular 3D Pedestrian Detection using Transformers. Experienced Cloud Systems Engineer with hands-on expertise in Microsoft Azure.",
    joined: 2024,
    domains: ["Computer Vision", "Deep Learning", "Cloud Computing", "Data Science", "Transformers"],
    skills: ["Python", "C", "Microsoft Azure", "SQL Server", "MySQL", "NumPy", "Pandas", "Matplotlib", "Seaborn", "Machine Learning", "Deep Learning", "NLP", "Statistics"],
    education: [
      {
        degree: "M.Tech",
        field: "Data Science and Artificial Intelligence",
        institute: "IIITDM Kancheepuram",
        year: "2026 (CGPA: 9.2)",
      },
      {
        degree: "B.E.",
        field: "Electronics and Communication Engineering",
        institute: "MVSR Engineering College",
        year: "2019 (82%)",
      },
    ],
    experience: [
      {
        role: "Systems Engineer",
        org: "Infosys Limited",
        duration: "Oct 2019 – Jun 2021",
      },
      {
        role: "Data Science Intern",
        org: "Sabudh Foundation (Remote)",
        duration: "Jul 2023 – May 2024",
      },
    ],
    publications: [],
    awards: [
      {
        id: "award-vaagdevhi-1",
        title: "IndiaAI Research Fellowship for Monocular 3D Pedestrian Detection",
        org: "IndiaAI",
        year: 2025,
        month: 10,
      },
      {
        id: "award-vaagdevhi-2",
        title: "Amazon ML Challenge 2025 - Securing 269th Place",
        org: "Amazon",
        year: 2025,
        month: 8,
      },
    ],
    conferences: [],
    researchProject: {
      title: "Monocular 3D Pedestrian Detection using Transformers",
      abstract: "Monocular 3D pedestrian detection is a specific task within 3D object detection, it focuses on recognizing and localizing pedestrians in a three-dimensional space but only using a single camera. The primary objective of 3D pedestrian detection is to accurately determine the position, dimension, and orientation of pedestrians in real time, enabling systems to predict the pedestrian behavior and take proactive measures to prevent accidents. Object Detection is the prerequisite for many downstream vision tasks like object tracking, object segmentation, object re-identification, action recognition, pose estimation and scene understanding. 3D object detection is pivotal in areas like visual surveillance, robotics, AR/VR, health care, traffic management and autonomous vehicles. The impact of 3D pedestrian detection is transformative for road safety. In applications like ADAS (Advanced Driver Assistance Systems) and autonomous vehicles, where pedestrian detection with dashboard camera helps in collision avoidance, emergency braking, and path planning. It also supports smart city infrastructure, where pedestrian detection can enhance traffic management and improve pedestrian safety at intersections and crosswalks. In assisted living, 3D pedestrian detection aids in fall detection, obstacle avoidance, and activity recognition, improving the quality of life for elderly, children and disabled individuals by ensuring their safety and independence. In Business, especially in smart retail environment this can be used to monitor customer behavior and product interaction. By using transformers, which capture the long-range dependencies it can improve both the pedestrian localization and depth estimation for monocular 3D pedestrian detection. Transformer models like DETR (Detection Transformers) and it's variations can be used to detect the pedestrian.",
      datasets: ["KITTI 3D Object Detection Dataset"],
      results: [
        "Implemented transformer-based monocular 3D object detection algorithms to accurately estimate pedestrian pose and depth.",
        "Awarded IndiaAI Research Fellowship for outstanding research contribution."
      ],
    },
},
{
    id: "scholar-cs22b1071",
    resume: "/resumes/scholar-cs22b1071_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Varshitha Masaram",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS22B1071@iiitdm.ac.in",
    bio: "Project: Cluster-Based Generation of Fingerprint and Iris Biometric Images.",
    joined: 2022,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "Cluster-Based Generation of Fingerprint and Iris Biometric Images",
      abstract: "Training and testing biometric recognition models require extensive and varied training and testing datasets. Real-world collection of such data poses various privacy risks and legal concerns, and the existing datasets are usually unbalanced with poor intra class variability. We propose a cascaded diffusion-based approach to create clustering synthetic fingerprint and iris image dataset. Each cluster contains many generated images of one synthetic identity that have similar features to each other while images from different clusters look visually very different. Our proposed pipeline consists of three stages: (1) a Random Network (RNet) trained to generate privacy-safe low resolution thumbnails using the DDPM approach; (2) an enhancement network for upscaling these thumbs upto full resolution; and (3) a Deterministic Network (DNet) conditioned on identity using class embeddings and classifier-free guidance (CFG) to produce clustered outputs. A contrastive learning loss is introduced in-between diffusion steps to strengthen inter-identity separation. Our experiment with a SOCOFing fingerprint dataset and MMU Iris Database showed that the generated images were realistic and formed coherent clusters measured via silhouette coefficient, Davies-Bouldin index, intra-cluster SSIM, and Fr\u00e9chet Inception distance metrics. We tested our ap- proach with open source biometric matching algorithms, showing that ROC AUC for deep CNN matcher was larger than 0.80, and the synthetic identities were separable for real-world biometric recognition models.",
      datasets: [],
      results: [],
    },
},
{
    id: "scholar-cs22b1030",
    resume: "/resumes/scholar-cs22b1030_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Konkimalla Bala Sai Manvitha",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS22B1030@iiitdm.ac.in",
    bio: "Project: RepoSage: An AI-Based System for Natural Language Querying of Software Codebases.",
    joined: 2022,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "RepoSage: An AI-Based System for Natural Language Querying of Software Codebases",
      abstract: "This project RepoSage helps developers understand large and unfamiliar codebases by letting them ask questions in natural language. Instead of manually going through thousands of files, the user just gives a GitHub repository URL and asks what they want to know. It uses a Retrieval-Augmented Generation (RAG) architecture where the system clones a GitHub repository, parses the code into meaningful chunks using Abstract Syntax Trees for Python and language-aware text splitting for other languages, generates vector embeddings, and stores them in a vector database. When a user asks a question, the system retrieves the most relevant code segments and passes them to an LLM to generate a context-aware explanation. The chunking process enriches each chunk with file path headers and class context, filters out generic stdlib imports, and discards very small chunks to reduce noise. Embeddings are generated using the all-mpnet-base-v2 model (768 dimensions) and stored in ChromaDB. The LLM used is Llama3 running locally through Ollama, which keeps the system fully offline and ensures data privacy. The system supports both semantic and keyword-based search, multi-turn conversations, commit pinning for indexing specific repository versions, and a caching mechanism to avoid re-indexing previously processed repositories. An evaluation module measures retrieval quality using Recall@k, Precision@k, MRR, and Keyword Recall, and also scores generation quality through an LLM-as-judge approach. The final system achieves a Recall@k of 0.822 and Precision@k of 0.387. The entire system is built with Python, Streamlit, ChromaDB, and LangChain, and runs locally through an interactive web interface. Overall, this project makes it easier to understand unfamiliar codebases with less effort and saves time.",
      datasets: [],
      results: [],
    },
},
{
    id: "scholar-cs22b1018",
    resume: "/resumes/scholar-cs22b1018_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "P. Naga Sripada",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS22B1018@iiitdm.ac.in",
    bio: "Project: Study and Experimental Implementation of Mixture of Recursions (MoR) for Vision Tasks.",
    joined: 2022,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "Study and Experimental Implementation of Mixture of Recursions (MoR) for Vision Tasks",
      abstract: "Transformers have completely revolutionized modern deep leaning, they became the dominanat architecture across Natural Language Processing and Computer Vision tasks. Their success led to the development of many advanced architectures such as Vision Transformers (ViTs), Recursive Transformers, Efficient Vision Models, and recent State Space models like Mamba. Despite their strong capabilities, most existing architectures, apply uniform computation across all tokens or image patches, regardless of the complexity or importance of different regions. This results in unnecessary computational overhead, especially in resource-constrained environments. This limitation was beautifully addressed by Google\u2019s Mixture of Recursions (MoR) framework, which introduced adaptive token-level computation through recursive parameter sharing and dynamic recursion depth allocation. While MoR demonstrated promising results in language models, its adaptation to computer vision remains relatively unexplored. In this project, the principles of Mixture of Recursions were integrated into Vision Transformer architectures to develop and analyze multiple Vision-MoR implementations. The work began with a baseline Vision-MoR prototype, subsequently multiple improved versions were developed through architectural and parameter modifications. Comparative analyzes were performed across all implementations. In addition, a broader SOTA benchmark study was conducted by comparing vision-mor, with several modern post transformer and efficient vision architectures. The study highlights the effectiveness of Vision-MoR as a scalable and efficient vision framework and provides insights into the future direction of adaptive computation in computer vision systems.",
      datasets: [],
      results: [],
    },
},
{
    id: "scholar-cs23m1010",
    resume: "/resumes/scholar-cs23m1010_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "T. Ramkumar",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS23M1010@iiitdm.ac.in",
    bio: "Project: Multi-Modal Cattle Biometrics.",
    joined: 2023,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "Multi-Modal Cattle Biometrics",
      abstract: "In this project, we aim to detect and recognize cattle using their biometric features through deep learning methods. According to data released by the FAO of the United Nations in 2024, the global cattle population increased by 1.51 million, reaching 1.55 billion in 2022, up from 1.548 billion in 2021. Despite this growth, cattle recognition and identification remain significant challenges. While image processing and deep learning technologies are advancing rapidly, most existing models for cattle biometrics rely predominantly on face recognition. However, capturing high-quality facial data from cattle is challenging, and facial features can change over time. To address these limitations, we propose focusing on multimodal biometrics, including the physiological traits of cattle, for more robust recognition",
      datasets: [],
      results: [],
    },
},
{
    id: "scholar-cs23m1013",
    avatar: "/images/scholar-cs23m1013.jpg",
    resume: "/resumes/scholar-cs23m1013_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Pawan Kumar Bamne",
    designation: "Alumni · M.Tech in Computer Science & Engineering",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS23M1013@iiitdm.ac.in",
    bio: "M.Tech Graduate from IIITDM Kancheepuram specializing in Computer Science and Engineering. Experienced in robust pedestrian detection in challenging environments using YOLO models, web development, and academic teaching support.",
    joined: 2023,
    domains: ["Computer Vision", "Deep Learning", "Web Development", "Database Management Systems"],
    skills: ["C", "C++", "Python", "Java", "HTML", "CSS", "JavaScript", "SQL", "Data Structures", "DBMS", "Operating Systems", "Computer Networks", "Computer Vision", "YOLO", "Machine Learning", "Web Development"],
    education: [
      {
        degree: "M.Tech",
        field: "Computer Science and Engineering",
        institute: "IIITDM Kancheepuram",
        year: "2025",
      },
      {
        degree: "Bachelor of Engineering",
        field: "Computer Science & Engineering",
        institute: "UIT, Barkatullah University, Bhopal",
        year: "2022",
      },
      {
        degree: "Diploma",
        field: "Computer Science & Engineering",
        institute: "Sardar Vallabhbhai Polytechnic College, Bhopal",
        year: "2019",
      },
    ],
    experience: [
      {
        role: "Teaching Assistant",
        org: "IIITDM Kancheepuram",
        duration: "Aug 2023 – May 2025",
      },
    ],
    publications: [],
    awards: [
      {
        id: "award-pawan-1",
        title: "Qualified GATE CSE 2022 (Score: 258, AIR: 20376)",
        org: "GATE",
        year: 2022,
        month: 3,
      },
    ],
    conferences: [],
    researchProject: {
      title: "Robust Pedestrian Detection in Challenging Environments Using YOLO",
      abstract: "Ensuring reliable pedestrian detection under adverse environmental conditions remains a critical challenge for autonomous systems and intelligent surveillance. The study fo- cuses on analyzing model robustness, detection accuracy, and computational efficiency for real-time, single-class pedestrian detection. YOLOv10s emerged as the top per- former in terms of mAP@50-95 (0.719), while YOLOv11s demonstrated the fastest training convergence (7.8 hours). Detailed confusion matrix analyses revealed high class-specific true positive rates (>89%) with minimal false positives, highlighting the architectural efficacy of attention mechanisms and depth-wise feature learning across versions. Additionally, training behavior, inference outputs, and model parameter- ization were visualized through precision-recall curves and loss metrics. The results affirm that recent YOLO variants provide scalable, energy-efficient solutions for real- time pedestrian detection in complex environments. This work not only benchmarks the incremental advancements in YOLO architecture but also lays the foundation for deployment on edge devices and integration into broader autonomous navigation and safety-critical perception systems.",
      datasets: ["Custom foggy and rainy datasets (50,000+ images)"],
      results: [
        "Trained and benchmarked YOLOv9s to YOLOv12s models on foggy/rainy scenarios, achieving a peak Precision of 0.96 and Recall of 0.89.",
        "Demonstrated YOLOv10s as top performer and YOLOv11s with fastest convergence for edge AI deployment."
      ],
    },
},
{
    id: "scholar-me21b2036",
    resume: "/resumes/scholar-me21b2036_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "J. S. Hilton Paul Tony Raj",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "ME21B2036@iiitdm.ac.in",
    bio: "Project: Towards Robust Gait Recognition: Addressing Uncertainty Using Adversarial Learning, Multi-Task Learning and Bayesian Inference.",
    joined: 2021,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "Towards Robust Gait Recognition: Addressing Uncertainty Using Adversarial Learning, Multi-Task Learning and Bayesian Inference",
      abstract: "Gait recognition is an emerging biometric technology that identifies individuals based on their unique walking patterns with gait sequences and variations serving as strong biometric features. Unlike other biometric modalities, it can operate over long distances without requiring active participation from the subjects, thus having wide application in security and surveillance. The performance of gait recognition can be significantly affected by variations such as view angle, posture, clothing and occlusion. Despite the advances in deep learning, these variations still pose a challenge. This project explores novel methodologies to enhance gait recognition performance, particularly to mitigate occlusion and viewpoint variations. Our approach proposes three methods, Adversarial Learning, Multi-Task Learning and Bayesian Convolutional Neural Networks to develop robust feature representation. The adversarial and multi-task learning frameworks mitigate direction-specific biases, while the Bayesian model improves uncertainty estimation by modelling the weights of the neural network as distribution, leading to more reliable predictions. Experimental evaluations of adversarial methodology on benchmark datasets, such as CASIAB, demonstrate significant improvements in Rank-1 accuracy compared to traditional methods. The proposed framework contributes to advancing gait recognition by improving both robustness and computational efficiency.",
      datasets: [],
      results: [],
    },
},
{
    id: "scholar-cs21b1043",
    resume: "/resumes/scholar-cs21b1043_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Vishnu Ram A. V.",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS21B1043@iiitdm.ac.in",
    bio: "Project: Towards Improved Contrastive Learning with Adaptive Data Augmentation and Adversarial Training Paradigms.",
    joined: 2021,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "Towards Improved Contrastive Learning with Adaptive Data Augmentation and Adversarial Training Paradigms",
      abstract: "Self-Supervised Learning (SSL) has emerged as a powerful paradigm for learning meaningful representations from the large amount of cheap unlabelled data. The effectiveness of SSL, particularly in contrastive learning depends on the choice of the augmentations used to generate pairs, which are traditionally selected based on human heuristics or randomly. This reliance contradicts the fundamental goal of SSL to minimize human intervention. This work explores the potential of adaptive, policy-driven data augmentation methods for enhancing the performance of contrastive learning frameworks, specifically within SimCLR. We identify key challenges in the direct application of standard augmentation techniques, including the risk of generating overly simplistic augmentations that hinder feature learning. To address these issues, we propose an adversarial training paradigm that encourages augmentation policies to generate harder, more informative augmentations. Additionally, we enhance the policy network to produce two distinct augmentations per image, allowing the model to better control the positive pairings in contrastive learning. Our experiments demonstrate promising results, highlighting the potential of adversarially-driven adaptive augmentations to generate high-quality features specific to the model and image instances. Although our method does not outperform existing strategies, it shows a promising direction for future research in adaptive augmentation for contrastive learning.",
      datasets: [],
      results: [],
    },
},
{
    id: "scholar-cs21b1068",
    resume: "/resumes/scholar-cs21b1068_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Basab Ghosh",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS21B1068@iiitdm.ac.in",
    bio: "Project: Reducing imposter in Muzzle Biometrics.",
    joined: 2021,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "Reducing imposter in Muzzle Biometrics",
      abstract: "Muzzle biometrics in cattle pose significant challenges due to the frequent acquisition of low-quality images resulting from the animals' lack of cooperation. This study investigates various image enhancement approaches, ranging from Generative Adversarial Networks (GANs) to transformer-based architectures such as the Swin Transformer, to improve muzzle image quality and facilitate more accurate differentiation between true and false positives. We propose a novel hybrid framework that integrates a Swin-based model with a GAN, achieving state-of-the-art performance on the PSNR benchmark. Furthermore, we introduce lightweight variants of the proposed model via knowledge distillation, including a distilled Swin-based model and an FSRCNN-adapted version. Despite their reduced size, these distilled models outperform both SwinIR and Swin, demonstrating their efficiency and effectiveness in resource-constrained environments.",
      datasets: [],
      results: [],
    },
},
{
    id: "scholar-cs21b2003",
    resume: "/resumes/scholar-cs21b2003_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Girik Khullar",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS21B2003@iiitdm.ac.in",
    bio: "Project: Beyond GANs: High-Fidelity Synthetic Iris Generation with Diffusion Models.",
    joined: 2021,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "Beyond GANs: High-Fidelity Synthetic Iris Generation with Diffusion Models",
      abstract: "Iris recognition is a highly dependable biometric authentication method, leveraging the intricate and stable patterns of the human iris. However, its widespread deployment encounters several obstacles. Collecting large-scale iris datasets is both costly and logistically challenging, and it raises ethical concerns related to the storage and usage of sensitive biometric information. Moreover, publicly available datasets often exhibit limited demographic diversity and controlled capture conditions, which can introduce biases and reduce real-world applicability. To overcome these limitations, synthetic data generation using deep learning has gained traction. Although Generative Adversarial Networks (GANs) have been widely studied for this task, they often suffer from challenges like unstable training and lim- ited sample variation due to mode collapse. In contrast, diffusion models have gained attention for their improved stability, superior image quality, and greater diversity in synthesized samples. This work investigates the viability of class-conditioned diffusion models to gener- ate synthetic iris images that can supplement or replace real biometric data in recognition systems. The generated samples exhibit realistic iris textures and inter-class diversity, making them suitable for training and evaluation purposes. Both visual inspection and quantitative analysis indicate that diffusion models can generate high-quality iris images that resemble real samples in structure and texture. The report details the methodology, dataset preparation, training strategy, evaluation metrics, and results, and concludes with future directions aimed at enhancing identity control and bridging synthetic-real distribution gaps.",
      datasets: [],
      results: [],
    },
},
{
    id: "scholar-cs21b2013",
    resume: "/resumes/scholar-cs21b2013_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Ananya M.",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS21B2013@iiitdm.ac.in",
    bio: "Project: Exploring Periocular Biometrics for Cattle Identification in the Visible Spectrum.",
    joined: 2021,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "Exploring Periocular Biometrics for Cattle Identification in the Visible Spectrum",
      abstract: "Biometric identification in livestock plays a crucial role in enhancing animal manage- ment, traceability. Traditional methods relying on muzzle patterns or coat textures often encounter limitations related to image quality, environmental conditions, and breed- specific characteristics. To address these challenges, this work draws upon advance- ments in human biometrics to explore a more scalable and consistent solution for cattle identification. Iris recognition, a well-established technique in human identification, commonly requires near-infrared imaging. However, such imaging is not feasible in typical farm environments, where only visible-light data is available. Recent studies have demon- strated that the periocular region\u2014the area surrounding the eye\u2014retains distinctive identity features even under visible-light conditions, offering a promising alternative. This study investigates the potential of using visible-spectrum periocular fea- tures for cattle identification by adapting deep learning models. Comparative anal- ysis revealed structural similarities between human and cattle periocular regions, sup- porting the applicability of human-centric models. A deep learning architecture based on ResNet50 was employed for feature extraction, while ArcFace was integrated to enhance inter-class separability and improve embedding compactness. The model was evaluated on both constrained and unconstrained cattle eye datasets, showing strong identification performance across varying conditions. Grad-CAM visu- alizations confirmed that the network consistently extracted relevant periocular features.",
      datasets: [],
      results: [],
    },
},
{
    id: "scholar-cs21m1001",
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
    }
  },
{
    id: "scholar-cs21m1007",
    resume: "/resumes/scholar-cs21m1007_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Samarth",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS21M1007@iiitdm.ac.in",
    bio: "Alumni at ViBeS Lab.",
    joined: 2021,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
  },
{
    id: "scholar-cs21m1008",
    resume: "/resumes/scholar-cs21m1008_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Arima",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS21M1008@iiitdm.ac.in",
    bio: "Alumni at ViBeS Lab.",
    joined: 2021,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
  },
{
    id: "scholar-coe19b001",
    role: "scholar",
    category: "Alumni",
    name: "Ramkumar R",
    designation: "Alumni · M.Tech Student at IIT Madras",
    affiliation: "ViBeS Lab, IIITDM & IIT Madras",
    email: "COE19B001@iiitdm.ac.in",
    bio: "M.Tech Scholar at IIT Madras. Former Research Intern at ViBeS Lab specializing in monocular depth estimation and trajectory prediction.",
    joined: 2019,
    domains: ["Computer Vision", "Deep Learning", "Embedded Systems"],
    skills: [
      "Python",
      "SQL",
      "C++",
      "HTML5",
      "CSS",
      "VHDL",
      "MIPS32",
      "Deep Learning",
      "Machine Learning",
    ],
    education: [
      {
        degree: "M.Tech",
        field: "Computer Science & Engineering",
        institute: "Indian Institute of Technology Madras",
        year: "2024 - 2026 (CGPA: 8.0)",
      },
      {
        degree: "B.Tech",
        field: "Computer Science & Engineering",
        institute: "IIITDM Kancheepuram",
        year: "2019 - 2023 (CGPA: 8.02)",
      },
    ],
    publications: [
      {
        id: "pub-ramkumar-1",
        title:
          "Perspective Distortion Model for Pedestrian Trajectory Prediction for Consumer Applications",
        venue: "IEEE Transactions on Consumer Electronics",
        year: 2023,
        month: 9,
        type: "Journal",
        domain: "Visual Surveillance",
        abstract: "Predicting pedestrian trajectories is a critical task for Advanced Driver Assistance Systems (ADAS) and autonomous vehicles. We propose a novel Perspective Distortion Model (PDM) that estimates the future trajectory of a pedestrian using monocular camera images and vehicle ego-motion data (speed and yaw rate). By analyzing the perspective distortion of the pedestrian bounding box over time, the system predicts 3D coordinates of motion and proactively triggers collision warnings (TTC). Evaluated on benchmark dashcam datasets, PDM achieves low latency and trajectory prediction errors under 5%.",
      },
    ],
    awards: [],
    conferences: [],
    links: [
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
    resume: "/resumes/ramkumar_r_resume.pdf",
    researchProject: {
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
    },
  },
{
    id: "scholar-coe19b032",
    resume: "/resumes/scholar-coe19b032_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Vennela",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "COE19B032@iiitdm.ac.in",
    bio: "Alumni at ViBeS Lab.",
    joined: 2019,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
  },
{
    id: "scholar-me20b2017",
    resume: "/resumes/scholar-me20b2017_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Soorya Narayanan R",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "ME20B2017@iiitdm.ac.in",
    bio: "Alumni at ViBeS Lab.",
    joined: 2020,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
  },
{
    id: "scholar-mfd19i016",
    resume: "/resumes/scholar-mfd19i016_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Vyshnav K",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "MFD19I016@iiitdm.ac.in",
    bio: "Alumni at ViBeS Lab.",
    joined: 2019,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
  },
{
    id: "scholar-ced19i053",
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
    }
  },
{
    id: "scholar-cs20b1030",
    resume: "/resumes/scholar-cs20b1030_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Mariyam Joory",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS20B1030@iiitdm.ac.in",
    bio: "Alumni at ViBeS Lab.",
    joined: 2020,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
  },
{
    id: "scholar-ced19i001",
    resume: "/resumes/scholar-ced19i001_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Nitin Koppera",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CED19I001@iiitdm.ac.in",
    bio: "Alumni at ViBeS Lab.",
    joined: 2019,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
  },
  {
    id: "scholar-cs21b1010",
    resume: "/resumes/scholar-cs21b1010_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Rayasam Munirama Aneesh Deepak",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS21B1010@iiitdm.ac.in",
    bio: "Project: Generative AI for 3D Pedestrian Detection.",
    joined: 2021,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "Generative AI for 3D Pedestrian Detection",
      abstract: "3D pedestrian detection is a crucial component in applications such as autonomous driving and surveillance. However, collecting clean and diverse point cloud data remains a challenge due to sensor noise and constraints in real-world environments. This project explores a generative AI-based pipeline designed to enrich and simulate pedestrian data within 3D LiDAR scenes. A point cloud denoising model was developed and trained to recover clean pedestrian shapes from noisy inputs, using paired filtered and unfiltered samples. To evaluate the confidence of the model's outputs, uncertainty estimation was applied using Monte Carlo Dropout, visualized through heatmaps. Additionally, the trained model was used to generate synthetic pedestrian point clouds, which were further scaled and embedded into sparse 3D scenes, offering a method for dataset augmentation. This work highlights the combined strength of denoising and generative modeling to improve 3D pedestrian datasets. The resulting system not only cleans existing data but also produces realistic synthetic samples with spatial variety and interpretable uncertainty.",
      datasets: [],
      results: [],
    },
  },
  {
    id: "scholar-cs21b1078",
    resume: "/resumes/scholar-cs21b1078_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "E. Saileswara Reddy",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS21B1078@iiitdm.ac.in",
    bio: "Project: Forecasting Indian Agricultural Commodity Prices Using Deep Learning Methods.",
    joined: 2021,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "Forecasting Indian Agricultural Commodity Prices Using Deep Learning Methods",
      abstract: "This research is based on findings from an investigation aimed at predicting agricultural commodity prices in India using deep learning methods. Specifically, I explored the usage of various models to predict daily prices of tomatoes in Lucknow. The approach involved sourcing historical price data from the \"Agriculture Commodity Data 2019\" dataset on Kaggle, which was then merged with meteorological data sourced from the \"Indian 5000 Cities Weather Data\" dataset, also available on Kaggle. After intensive preprocessing of the data, we utilized eight various LSTM-based architectures: Standard LSTM, CNN-LSTM, Bi-LSTM, Attention-LSTM, STL-LSTM, GRU-LSTM, PCA-CNN-BiLSTM-Attention, and a standard Transformer model. The performances of these models were compared against suitable time-series forecasting metrics. This piece of research is an exploratory step towards the identification of suitable deep learning methodologies for predicting agricultural commodity prices. Although the initial research plan had also included a sentiment analysis portion via Natural Language Processing, this aspect has been reserved for future research due to limitations in sourcing data.",
      datasets: [],
      results: [],
    },
  },
  {
    id: "scholar-cs21b1065",
    resume: "/resumes/scholar-cs21b1065_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Tarra Venkata Sai",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS21B1065@iiitdm.ac.in",
    bio: "Project: LLM-Driven Financial Market Analysis and Agentic Trading System.",
    joined: 2021,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "LLM-Driven Financial Market Analysis and Agentic Trading System",
      abstract: "Artificial Intelligence (AI) has transformed financial market analysis through the use of machine learning, deep learning, and natural language processing (NLP) for enhanced trading strategies and risk management. Sentiment analysis models such as FinBERT and LLaMA analyze financial news, while predictive models such as LSTMs, Facebook Prophet, and Transformers improve stock price prediction. AI-based algorithmic trading executes trades and identifies patterns automatically. In spite of these improvements, challenges still exist, such as high computational expense, overfitting in RL, financial text misinterpretation, and the black-box nature of AI models. Hybrid AI methods incorporating Retrieval-Augmented Generation (RAG), Large Language Models (LLMs), and machine learning provide enhanced data retrieval, explainability, and flexibility to overcome these. Hybrid AI also improves financial decision-making and predictive accuracy through sentiment-aware trading strategies and effective risk management.",
      datasets: [],
      results: [],
    },
  },
  {
    id: "scholar-cs21b2032",
    resume: "/resumes/scholar-cs21b2032_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Kunduru Noniesh Reddy",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS21B2032@iiitdm.ac.in",
    bio: "Project: AI-Powered Cattle Recognition and Assistance.",
    joined: 2021,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "AI-Powered Cattle Recognition and Assistance",
      abstract: "The AI-Powered Cattle Recognition and Assistance system introduces an innovative solution for livestock management through state-of-the-art computer vision and ar- tificial intelligence. By leveraging intelligent algorithms to detect and analyze unique muzzle patterns\u2014akin to human fingerprints, the system provides a robust alterna- tive to conventional tagging methods, ensuring accurate and permanent identification of individual cattle. This biometric approach eliminates common issues like tag loss or damage, creat- ing secure digital identities for every animal in the herd. It ensures reliable traceability and record-keeping, critical for modern farming operations. Planned enhancements include machine learning-driven disease detection (iden- tifying early visual symptoms of common bovine illnesses), an AI-powered chatbot for instant veterinary guidance, and a comprehensive medical management system to track vaccinations, treatments, and health histories. These additions aim to enable proactive health monitoring and data-driven decision-making. By addressing identification errors, accelerating disease prevention, and streamlin- ing health management workflows, the system promises to improve herd health, boost productivity, and optimize resource utilization across farms of all scales.",
      datasets: [],
      results: [],
    },
  },
  {
    id: "scholar-cs21b2021",
    resume: "/resumes/scholar-cs21b2021_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Koneti Sai Dheeraj",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS21B2021@iiitdm.ac.in",
    bio: "Project: AI-Powered Cattle Recognition and Assistance.",
    joined: 2021,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "AI-Powered Cattle Recognition and Assistance",
      abstract: "The AI-Powered Cattle Recognition and Assistance system introduces an innovative solution for livestock management through state-of-the-art computer vision and ar- tificial intelligence. By leveraging intelligent algorithms to detect and analyze unique muzzle patterns\u2014akin to human fingerprints, the system provides a robust alterna- tive to conventional tagging methods, ensuring accurate and permanent identification of individual cattle. This biometric approach eliminates common issues like tag loss or damage, creat- ing secure digital identities for every animal in the herd. It ensures reliable traceability and record-keeping, critical for modern farming operations. Planned enhancements include machine learning-driven disease detection (iden- tifying early visual symptoms of common bovine illnesses), an AI-powered chatbot for instant veterinary guidance, and a comprehensive medical management system to track vaccinations, treatments, and health histories. These additions aim to enable proactive health monitoring and data-driven decision-making. By addressing identification errors, accelerating disease prevention, and streamlin- ing health management workflows, the system promises to improve herd health, boost productivity, and optimize resource utilization across farms of all scales.",
      datasets: [],
      results: [],
    },
  },
  {
    id: "scholar-cs21b2033",
    resume: "/resumes/scholar-cs21b2033_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Arpit Singh",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS21B2033@iiitdm.ac.in",
    bio: "Project: DAKU: DUAL ATTENTION KNOWLEDGE U-NET.",
    joined: 2021,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "DAKU: DUAL ATTENTION KNOWLEDGE U-NET",
      abstract: "Unet is a novel architecture used in the field of biomedical imaging for semantically segmenting the images, like brain segmentation, heart segmentation, lungs segmenta- tion e.t.c. This architecture was developed by Ronneberger et al in 2015 and it won IEEE International Symposium on Biomedical Imaging by a large margin. However it has it's problems. Among many problems the three important problems are, high com- putational cost, passing of redundant or useless features from the encoder layer to the decoder layer, and its limited global context awareness. We try to resolve these issues through our project using the idea of knowledge distillation. There are 4 methods for model compression, which are quantization, pruning, Lo-Ra and KD. We use knowledge distillation to try to reduce the size of the model, and preserve the accuracy of model. The idea of knowledge distillation is used in industry by big companies like OpenAI,Google to reduce the complexity of model for deployment in edge devices. Some examples where they used the notion of knowledge distillation for model compression are distilBert (distilled version of BERT, which is approximately 40 percent the size of BERT model, while conserving 97 percent capa- bility of the BERT model. o3- mini by Open AI is yet another example of knowledge distillation.",
      datasets: [],
      results: [],
    },
  },
  {
    id: "scholar-cs22b2030",
    resume: "/resumes/scholar-cs22b2030_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Velide Sri Manaswini",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS22B2030@iiitdm.ac.in",
    bio: "Project: Recursive Adaptive Backbone using Mixture of Recursions (MoR) for Robust Pedestrian Detection.",
    joined: 2022,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "Recursive Adaptive Backbone using Mixture of Recursions (MoR) for Robust Pedestrian Detection",
      abstract: "Detecting pedestrians in crowded scenes is genuinely difficult. When people overlap, are partially hidden, or appear at very small scales in the image, most detection models start making mistakes \u2014 merging two people into one box, missing smaller individuals, or producing uncertain predictions that get filtered during post-processing. A core reason is that standard detection backbones apply the same processing depth everywhere in the image regardless of how complex a scene region actually is. That uniform treatment is wasteful and limits what the model can do in dense crowds. This project proposes MoR-YOLOv8, a new detection architecture that modifies the YOLOv8 backbone by replacing the fixed-depth C2f blocks at the two deepest backbone stages with a recursive, weight-sharing module called MoR_C2f. Instead of stacking multiple independent convolutional blocks, one shared block is applied recursively three times, and a learned softmax-weighted mixture combines outputs from each pass. This gives the backbone deeper and more adaptive processing at the semantic stages that matter most for crowd scenes, without adding new unique parameters. The architecture is evaluated on the Crowd Human benchmark (15,000 training images, 4,370 validation images with dense pedestrian annotations) under identical 50 epoch training conditions. MoR-YOLOv8 achieves mAP@0.5 of 88.2% and mAP@0.5:0.95 of 56.8%, improving over YOLOv8L (87.2%, 56.0%) and YOLOv8X (87.2%, 56.5%) by +1.0 percentage point in the primary metric, while using fewer unique parameters than YOLOv8L. An ablation over n ? {1, 2, 3, 5, 7} recursive passes confirms n = 3 as the optimal accuracy-to-efficiency trade-off.",
      datasets: [],
      results: [],
    },
  },
  {
    id: "scholar-cs22b2042",
    resume: "/resumes/scholar-cs22b2042_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Dindigala Rahul",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS22B2042@iiitdm.ac.in",
    bio: "Project: From Language to Vision: Sparse Hebbian Linear Attention - Structural Analysis & Vision Adaptation.",
    joined: 2022,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "From Language to Vision: Sparse Hebbian Linear Attention - Structural Analysis & Vision Adaptation",
      abstract: "This project traces a two-phase research process. The first phase implements and systematically analyses the BDH-GPU architecture, a biologically motivated language model that replaces standard Transformer attention with a sparse Hebbian linear attention mechanism, and compares it against a GPT-style baseline and a proposed Hybrid model on the Tiny Shakespeare autoregressive language modelling task. The second phase generalises the BDH mechanism to the visual domain, producing the Eagle Hatchling (BEH): an encoder-only vision model that adapts the Dragon Hatchling's three shared weight matrices to image patch sequences by removing the causal constraint and operating bidirectionally across all patch positions simultaneously. The language modelling phase demonstrates that BDH-GPU achieves lower validation loss and perplexity than the GPT baseline under parameter-matched conditions (BDH: 1.52, GPT: 1.78, Hybrid: 1.80 at ~2M parameters), with activation sparsity in internal representations increasing monotonically from ~50% at initialisation to over 73% at convergence. Structured pruning experiments confirm that up to 50% of the neuron width can be removed with only 0.2 increase in perplexity while gaining 58.7% inference throughput. The vision phase demonstrates that BEH achieves 77.37% top-1 accuracy on CIFAR-10 using 0.90M parameters, outperforming a standard ViT baseline (73.89%, 2.70M parameters) by 3.48% points with 3x fewer parameters. On ImageNet-100, BEH operates at 1.09M parameters and 0.038 GFLOPs per image, reductions of 5.1x and 28x respectively relative to DeiT-Tiny and Vim-Tiny, while achieving the highest top-5 accuracy among all three models. Activation sparsity analysis confirms that the Hebbian selectivity property observed in language modelling transfers to visual feature learning. Taken together, these results establish BDH-style Hebbian sparse linear attention as a general, parameter-efficient architectural mechanism that functions across both sequential and spatial modalities.",
      datasets: [],
      results: [],
    },
  },
  {
    id: "scholar-cs22b1056",
    resume: "/resumes/scholar-cs22b1056_resume.pdf",
    role: "scholar",
    category: "Alumni",
    name: "Pranav Singh",
    designation: "Alumni",
    affiliation: "ViBeS Lab, IIITDM",
    email: "CS22B1056@iiitdm.ac.in",
    bio: "Project: Baby Dragon Hatchling for Amodal Instance Segmentation on the KINS Dataset.",
    joined: 2022,
    domains: [],
    skills: [],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    researchProject: {
      title: "Baby Dragon Hatchling for Amodal Instance Segmentation on the KINS Dataset",
      abstract: "What a camera sees and what actually exists in a scene are two very different things. Pixels record reflected light from whatever surfaces happen to face the lens, anything behind an occluder simply goes unrepresented, as if it ceased to exist. For many downstream tasks robot grasping, collision prediction, multi-object tracking - this missing information is not a minor inconvenience but a hard failure mode. Recovering it is the goal of amodal instance segmentation. This work applies, for the first time, the Brain-Dynamics Hypothesis (BDH) to that problem. The key idea is borrowed from computational neuroscience: rather than predicting a mask in one feed-forward pass, the network runs an iterative competition among spatial feature nodes inside each Region of Interest (RoI). Nodes associated with the same physical object tend to co-activate; the Lotka-Volterra (L-V) equations formalise this by letting co-firing nodes reinforce each other while inconsistent ones fade out. When the process settles -- after L steps -- the surviving activations outline the full object, visible and hidden portions alike. Tested on the KINS benchmark [2], the model achieves a mean amodal IoU of 0.8315, mean visible loU of 0.8314, and classification accuracy of 73.38% Predicted masks for common categories such as car and pedestrian visibly extend into occluded areas, confirming that the attractor mechanism is doing genuine completion work rather than merely reproducing what the camera sees.",
      datasets: [],
      results: [],
    },
  }
];

export let allPeople: Person[] = [guide, ...scholars];

export const labDomains = [
  {
    name: "Image Processing",
    desc: "Low-level vision, restoration, enhancement and multi-spectral imaging.",
    icon: "Aperture",
  },
  {
    name: "Biometrics",
    desc: "Iris, periocular, face, fingerprint and multimodal recognition.",
    icon: "Fingerprint",
  },
  {
    name: "Machine Learning",
    desc: "Self-supervised, contrastive and transformer-based modeling.",
    icon: "Brain",
  },
  {
    name: "Visual Surveillance",
    desc: "Re-ID, tracking and anomaly detection at the edge.",
    icon: "Eye",
  },
];

export let projects: Project[] = [
  {
    id: "agv-navigation",
    title: "Monocular Depth Analysis Controlled GPS Denied AGV Navigation",
    tagline: "Seamless tracking for AGVs in GPS-denied environments.",
    domain: "Visual Surveillance",
    status: "Ongoing",
    year: 2025,
    purpose:
      "Develop an autonomous navigation and tracking system for AGVs using monocular depth estimation where GPS is unavailable.",
    description:
      "Funded by TiHAN-IIT Hyderabad with a financial outlay of 19.02 Lakhs for a duration of 18 Months.",
    results: ["Depth estimation models implemented", "AGV prototype in development"],
    tech: ["Computer Vision", "Depth Estimation", "Robotics"],
    image: "from-primary/40 via-accent/20 to-primary/10",
  },
  {
    id: "cattle-biometrics",
    title: "Multi Biometric Analysis of Cattle",
    tagline: "Identification and health monitoring of livestock.",
    domain: "Biometrics",
    status: "Ongoing",
    year: 2024,
    purpose:
      "Create a tamper-proof and robust identification system for cattle using multi-biometric traits (periocular, muzzle) alongside health monitoring.",
    description:
      "Funded by the Department of Science and Technology, Govt. of India with a financial outlay of 18.32 Lakhs for 2 Years. Status: Technical Acceptance.",
    results: ["Multi-modal biometric pipeline built", "Field trials planned"],
    tech: ["Deep Learning", "Pattern Recognition", "Edge Computing"],
    image: "from-accent/40 via-primary/20 to-accent/10",
  },
];

export let achievements: Achievement[] = [];

export let labStats = {
  members: 1 + scholars.length,
  publications: guide.publications.length + scholars.reduce((s, p) => s + p.publications.length, 0),
  projects: projects.length,
  collaborations: 14,
  outlay: 37.34,
  awards: guide.awards.length + scholars.reduce((s, p) => s + p.awards.length, 0),
};

export let resources = [
  {
    name: "NVIDIA JETSON NANO DEV KIT (B01)",
    detail: "Quad-core ARM Cortex-A57 CPU, 128-core Maxwell GPU, 4GB LPDDR4 RAM, 472 GFLOPS AI performance, dual CSI camera support, Gigabit Ethernet, HDMI/DisplayPort, USB 3.0, and 40-pin GPIO for AI, robotics, and IoT applications.",
    image: "/images/rover/3.jpg"
  },
  {
    name: "NVIDIA JETSON XAVIER NX (16 GB RAM)",
    detail: "JETSON XAVIER NX MODULE, AVER MEDIA NX 215 CARRIER, HEAT SINK, 12V POWER ADAPTER",
    image: "/images/hardware/jetson_xavier.png"
  },
  {
    name: "HP MONITOR",
    detail: "Full HD (1920x1080) display with HDMI/VGA connectivity and anti-glare LED panel.",
    image: "/images/hardware/hp_monitor.png"
  },
  {
    name: "DELL OPTIPLEX 500 DESKTOP PC",
    detail: "Business desktop with Intel Core processor, DDR4/DDR5 RAM, SSD storage, and multiple USB, HDMI, and DisplayPort connectivity options.",
    image: "/images/hardware/dell_optiplex.png"
  },
  {
    name: "3 TRIPODS",
    detail: "Adjustable camera/mobile stands with stable legs for photography, videography, and project demonstrations.",
    image: "/images/hardware/tripod.png"
  },
  {
    name: "AM ROBOTICS ROVER 4WDXL60R KIT",
    detail: "Four-wheel drive robotic rover platform with DC motors, metal chassis, and support for AI, IoT, and autonomous robotics projects",
    image: "/images/rover/14.jpg"
  },
  {
    name: "LED MONITOR 60.4CM, ZEB-A24FHDLED",
    detail: "Zebronics, Full HD 24-inch LED display with 1920x1080 resolution, HDMI/VGA connectivity, and wide viewing angles.",
    image: "/images/hardware/led_monitor.png"
  },
  {
    name: "PANASONIC VIDEO CAMERA (HC-V385):",
    detail: "Video camera with adapter for high-quality recording and documentation.",
    image: "/images/hardware/panasonic_camera.png"
  },
  {
    name: "EPSON L130 PRINTER",
    detail: "Ink tank printer for efficient, low-cost color and monochrome printing.",
    image: "/images/hardware/epson_printer.png"
  },
  {
    name: "SONY A6100 CAMERA",
    detail: "24.2 MP APS-C Exmor sensor camera with 425 autofocus points, 11 fps continuous shooting, and ISO range 100–32000 (with 64 GB SD card).",
    image: "/images/hardware/sony_camera.png"
  }
];

export function getPerson(id: string) {
  return allPeople.find((p) => p.id === id);
}

export function getProjectsByDomain(domain: string) {
  return projects.filter((p) => p.domain.toLowerCase() === domain.toLowerCase());
}

export function getPublicationsByDomain(domain: string) {
  const d = domain.toLowerCase();
  return allPeople.flatMap((p) =>
    p.publications
      .filter((pub) => pub.domain.toLowerCase().includes(d) || d.includes(pub.domain.toLowerCase()))
      .map((pub) => ({ ...pub, author: p.name, authorId: p.id })),
  );
}

export function getConferencesByDomain(_domain: string) {
  // Conferences aren't tagged by domain in mock data — return them all as related events.
  return allPeople.flatMap((p) =>
    p.conferences.map((c) => ({ ...c, author: p.name, authorId: p.id })),
  );
}

export type SupervisedProject = {
  sno: number;
  studentName: string;
  rollNo: string;
  title: string;
  explanation: string;
  type: "BTP" | "MTP";
  status: "Completed" | "Ongoing";
};

export let supervisedProjects: SupervisedProject[] = [
  {
    sno: 1,
    studentName: "J. S. Hilton Paul Tony Raj",
    rollNo: "ME21B2036",
    title: "Towards Robust Gait Recognition: Addressing Uncertainty Using Adversarial Learning, Multi-Task Learning and Bayesian Inference",
    explanation: "Gait recognition is an emerging biometric technology that identifies individuals based on their unique walking patterns with gait sequences and variations serving as strong biometric features. Unlike other biometric modalities, it can operate over long distances without requiring active participation from the subjects, thus having wide application in security and surveillance. The performance of gait recognition can be significantly affected by variations such as view angle, posture, clothing and occlusion. Despite the advances in deep learning, these variations still pose a challenge. This project explores novel methodologies to enhance gait recognition performance, particularly to mitigate occlusion and viewpoint variations. Our approach proposes three methods, Adversarial Learning, Multi-Task Learning and Bayesian Convolutional Neural Networks to develop robust feature representation. The adversarial and multi-task learning frameworks mitigate direction-specific biases, while the Bayesian model improves uncertainty estimation by modelling the weights of the neural network as distribution, leading to more reliable predictions. Experimental evaluations of adversarial methodology on benchmark datasets, such as CASIAB, demonstrate significant improvements in Rank-1 accuracy compared to traditional methods. The proposed framework contributes to advancing gait recognition by improving both robustness and computational efficiency.",
    type: "BTP",
    status: "Completed",
  },
  {
    sno: 2,
    studentName: "Basab Ghosh",
    rollNo: "CS21B1068",
    title: "Reducing imposter in Muzzle Biometrics",
    explanation: "Muzzle biometrics in cattle pose significant challenges due to the frequent acquisition of low-quality images resulting from the animals' lack of cooperation. This study investigates various image enhancement approaches, ranging from Generative Adversarial Networks (GANs) to transformer-based architectures such as the Swin Transformer, to improve muzzle image quality and facilitate more accurate differentiation between true and false positives. We propose a novel hybrid framework that integrates a Swin-based model with a GAN, achieving state-of-the-art performance on the PSNR benchmark. Furthermore, we introduce lightweight variants of the proposed model via knowledge distillation, including a distilled Swin-based model and an FSRCNN-adapted version. Despite their reduced size, these distilled models outperform both SwinIR and Swin, demonstrating their efficiency and effectiveness in resource-constrained environments.",
    type: "BTP",
    status: "Completed",
  },
  {
    sno: 3,
    studentName: "Rayasam Munirama Aneesh Deepak",
    rollNo: "CS21B1010",
    title: "Generative AI for 3D Pedestrian Detection",
    explanation: "3D pedestrian detection is a crucial component in applications such as autonomous driving and surveillance. However, collecting clean and diverse point cloud data remains a challenge due to sensor noise and constraints in real-world environments. This project explores a generative AI-based pipeline designed to enrich and simulate pedestrian data within 3D LiDAR scenes. A point cloud denoising model was developed and trained to recover clean pedestrian shapes from noisy inputs, using paired filtered and unfiltered samples. To evaluate the confidence of the model's outputs, uncertainty estimation was applied using Monte Carlo Dropout, visualized through heatmaps. Additionally, the trained model was used to generate synthetic pedestrian point clouds, which were further scaled and embedded into sparse 3D scenes, offering a method for dataset augmentation. This work highlights the combined strength of denoising and generative modeling to improve 3D pedestrian datasets. The resulting system not only cleans existing data but also produces realistic synthetic samples with spatial variety and interpretable uncertainty.",
    type: "BTP",
    status: "Completed",
  },
  {
    sno: 4,
    studentName: "Vishnu Ram A. V.",
    rollNo: "CS21B1043",
    title: "Towards Improved Contrastive Learning with Adaptive Data Augmentation and Adversarial Training Paradigms",
    explanation: "Self-Supervised Learning (SSL) has emerged as a powerful paradigm for learning meaningful representations from the large amount of cheap unlabelled data. The effectiveness of SSL, particularly in contrastive learning depends on the choice of the augmentations used to generate pairs, which are traditionally selected based on human heuristics or randomly. This reliance contradicts the fundamental goal of SSL to minimize human intervention. This work explores the potential of adaptive, policy-driven data augmentation methods for enhancing the performance of contrastive learning frameworks, specifically within SimCLR. We identify key challenges in the direct application of standard augmentation techniques, including the risk of generating overly simplistic augmentations that hinder feature learning. To address these issues, we propose an adversarial training paradigm that encourages augmentation policies to generate harder, more informative augmentations. Additionally, we enhance the policy network to produce two distinct augmentations per image, allowing the model to better control the positive pairings in contrastive learning. Our experiments demonstrate promising results, highlighting the potential of adversarially-driven adaptive augmentations to generate high-quality features specific to the model and image instances. Although our method does not outperform existing strategies, it shows a promising direction for future research in adaptive augmentation for contrastive learning.",
    type: "BTP",
    status: "Completed",
  },
  {
    sno: 5,
    studentName: "E. Saileswara Reddy",
    rollNo: "CS21B1078",
    title: "Forecasting Indian Agricultural Commodity Prices Using Deep Learning Methods",
    explanation: "This research is based on findings from an investigation aimed at predicting agricultural commodity prices in India using deep learning methods. Specifically, I explored the usage of various models to predict daily prices of tomatoes in Lucknow. The approach involved sourcing historical price data from the \"Agriculture Commodity Data 2019\" dataset on Kaggle, which was then merged with meteorological data sourced from the \"Indian 5000 Cities Weather Data\" dataset, also available on Kaggle. After intensive preprocessing of the data, we utilized eight various LSTM-based architectures: Standard LSTM, CNN-LSTM, Bi-LSTM, Attention-LSTM, STL-LSTM, GRU-LSTM, PCA-CNN-BiLSTM-Attention, and a standard Transformer model. The performances of these models were compared against suitable time-series forecasting metrics. This piece of research is an exploratory step towards the identification of suitable deep learning methodologies for predicting agricultural commodity prices. Although the initial research plan had also included a sentiment analysis portion via Natural Language Processing, this aspect has been reserved for future research due to limitations in sourcing data.",
    type: "BTP",
    status: "Completed",
  },
  {
    sno: 6,
    studentName: "Tarra Venkata Sai",
    rollNo: "CS21B1065",
    title: "LLM-Driven Financial Market Analysis and Agentic Trading System",
    explanation: "Artificial Intelligence (AI) has transformed financial market analysis through the use of machine learning, deep learning, and natural language processing (NLP) for enhanced trading strategies and risk management. Sentiment analysis models such as FinBERT and LLaMA analyze financial news, while predictive models such as LSTMs, Facebook Prophet, and Transformers improve stock price prediction. AI-based algorithmic trading executes trades and identifies patterns automatically. In spite of these improvements, challenges still exist, such as high computational expense, overfitting in RL, financial text misinterpretation, and the black-box nature of AI models. Hybrid AI methods incorporating Retrieval-Augmented Generation (RAG), Large Language Models (LLMs), and machine learning provide enhanced data retrieval, explainability, and flexibility to overcome these. Hybrid AI also improves financial decision-making and predictive accuracy through sentiment-aware trading strategies and effective risk management.",
    type: "BTP",
    status: "Completed",
  },
  {
    sno: 7,
    studentName: "Girik Khullar",
    rollNo: "CS21B2003",
    title: "Beyond GANs: High-Fidelity Synthetic Iris Generation with Diffusion Models",
    explanation: "Iris recognition is a highly dependable biometric authentication method, leveraging the intricate and stable patterns of the human iris. However, its widespread deployment encounters several obstacles. Collecting large-scale iris datasets is both costly and logistically challenging, and it raises ethical concerns related to the storage and usage of sensitive biometric information. Moreover, publicly available datasets often exhibit limited demographic diversity and controlled capture conditions, which can introduce biases and reduce real-world applicability. To overcome these limitations, synthetic data generation using deep learning has gained traction. Although Generative Adversarial Networks (GANs) have been widely studied for this task, they often suffer from challenges like unstable training and lim- ited sample variation due to mode collapse. In contrast, diffusion models have gained attention for their improved stability, superior image quality, and greater diversity in synthesized samples. This work investigates the viability of class-conditioned diffusion models to gener- ate synthetic iris images that can supplement or replace real biometric data in recognition systems. The generated samples exhibit realistic iris textures and inter-class diversity, making them suitable for training and evaluation purposes. Both visual inspection and quantitative analysis indicate that diffusion models can generate high-quality iris images that resemble real samples in structure and texture. The report details the methodology, dataset preparation, training strategy, evaluation metrics, and results, and concludes with future directions aimed at enhancing identity control and bridging synthetic-real distribution gaps.",
    type: "BTP",
    status: "Completed",
  },
  {
    sno: 8,
    studentName: "Ananya M.",
    rollNo: "CS21B2013",
    title: "Exploring Periocular Biometrics for Cattle Identification in the Visible Spectrum",
    explanation: "Biometric identification in livestock plays a crucial role in enhancing animal manage- ment, traceability. Traditional methods relying on muzzle patterns or coat textures often encounter limitations related to image quality, environmental conditions, and breed- specific characteristics. To address these challenges, this work draws upon advance- ments in human biometrics to explore a more scalable and consistent solution for cattle identification. Iris recognition, a well-established technique in human identification, commonly requires near-infrared imaging. However, such imaging is not feasible in typical farm environments, where only visible-light data is available. Recent studies have demon- strated that the periocular region\u2014the area surrounding the eye\u2014retains distinctive identity features even under visible-light conditions, offering a promising alternative. This study investigates the potential of using visible-spectrum periocular fea- tures for cattle identification by adapting deep learning models. Comparative anal- ysis revealed structural similarities between human and cattle periocular regions, sup- porting the applicability of human-centric models. A deep learning architecture based on ResNet50 was employed for feature extraction, while ArcFace was integrated to enhance inter-class separability and improve embedding compactness. The model was evaluated on both constrained and unconstrained cattle eye datasets, showing strong identification performance across varying conditions. Grad-CAM visu- alizations confirmed that the network consistently extracted relevant periocular features.",
    type: "BTP",
    status: "Completed",
  },
  {
    sno: 9,
    studentName: "Kunduru Noniesh Reddy, Koneti Sai Dheeraj",
    rollNo: "CS21B2032, CS21B2021",
    title: "AI-Powered Cattle Recognition and Assistance",
    explanation: "The AI-Powered Cattle Recognition and Assistance system introduces an innovative solution for livestock management through state-of-the-art computer vision and ar- tificial intelligence. By leveraging intelligent algorithms to detect and analyze unique muzzle patterns\u2014akin to human fingerprints, the system provides a robust alterna- tive to conventional tagging methods, ensuring accurate and permanent identification of individual cattle. This biometric approach eliminates common issues like tag loss or damage, creat- ing secure digital identities for every animal in the herd. It ensures reliable traceability and record-keeping, critical for modern farming operations. Planned enhancements include machine learning-driven disease detection (iden- tifying early visual symptoms of common bovine illnesses), an AI-powered chatbot for instant veterinary guidance, and a comprehensive medical management system to track vaccinations, treatments, and health histories. These additions aim to enable proactive health monitoring and data-driven decision-making. By addressing identification errors, accelerating disease prevention, and streamlin- ing health management workflows, the system promises to improve herd health, boost productivity, and optimize resource utilization across farms of all scales.",
    type: "BTP",
    status: "Completed",
  },
  {
    sno: 10,
    studentName: "Arpit Singh",
    rollNo: "CS21B2033",
    title: "DAKU: DUAL ATTENTION KNOWLEDGE U-NET",
    explanation: "Unet is a novel architecture used in the field of biomedical imaging for semantically segmenting the images, like brain segmentation, heart segmentation, lungs segmenta- tion e.t.c. This architecture was developed by Ronneberger et al in 2015 and it won IEEE International Symposium on Biomedical Imaging by a large margin. However it has it's problems. Among many problems the three important problems are, high com- putational cost, passing of redundant or useless features from the encoder layer to the decoder layer, and its limited global context awareness. We try to resolve these issues through our project using the idea of knowledge distillation. There are 4 methods for model compression, which are quantization, pruning, Lo-Ra and KD. We use knowledge distillation to try to reduce the size of the model, and preserve the accuracy of model. The idea of knowledge distillation is used in industry by big companies like OpenAI,Google to reduce the complexity of model for deployment in edge devices. Some examples where they used the notion of knowledge distillation for model compression are distilBert (distilled version of BERT, which is approximately 40 percent the size of BERT model, while conserving 97 percent capa- bility of the BERT model. o3- mini by Open AI is yet another example of knowledge distillation.",
    type: "BTP",
    status: "Completed",
  },
  {
    sno: 11,
    studentName: "Pawan Kumar Bamne",
    rollNo: "CS23M1013",
    title: "Robust Pedestrian Detection in Challenging Environments Using YOLO",
    explanation: "Ensuring reliable pedestrian detection under adverse environmental conditions remains a critical challenge for autonomous systems and intelligent surveillance. The study fo- cuses on analyzing model robustness, detection accuracy, and computational efficiency for real-time, single-class pedestrian detection. YOLOv10s emerged as the top per- former in terms of mAP@50-95 (0.719), while YOLOv11s demonstrated the fastest training convergence (7.8 hours). Detailed confusion matrix analyses revealed high class-specific true positive rates (>89%) with minimal false positives, highlighting the architectural efficacy of attention mechanisms and depth-wise feature learning across versions. Additionally, training behavior, inference outputs, and model parameter- ization were visualized through precision-recall curves and loss metrics. The results affirm that recent YOLO variants provide scalable, energy-efficient solutions for real- time pedestrian detection in complex environments. This work not only benchmarks the incremental advancements in YOLO architecture but also lays the foundation for deployment on edge devices and integration into broader autonomous navigation and safety-critical perception systems.",
    type: "MTP",
    status: "Completed",
  },
  {
    sno: 12,
    studentName: "T. Ramkumar",
    rollNo: "CS23M1010",
    title: "Multi-Modal Cattle Biometrics",
    explanation: "In this project, we aim to detect and recognize cattle using their biometric features through deep learning methods. According to data released by the FAO of the United Nations in 2024, the global cattle population increased by 1.51 million, reaching 1.55 billion in 2022, up from 1.548 billion in 2021. Despite this growth, cattle recognition and identification remain significant challenges. While image processing and deep learning technologies are advancing rapidly, most existing models for cattle biometrics rely predominantly on face recognition. However, capturing high-quality facial data from cattle is challenging, and facial features can change over time. To address these limitations, we propose focusing on multimodal biometrics, including the physiological traits of cattle, for more robust recognition",
    type: "MTP",
    status: "Completed",
  },
  {
    sno: 13,
    studentName: "Ambavaram Manasa Reddy",
    rollNo: "CS24M1013",
    title: "Identity-Aware Super-Resolution of Degraded Faces for Face Verification",
    explanation: "Face verification systems perform remarkably well under controlled, high-quality conditions, but their accuracy drops considerably when the input images have been degraded by blur, noise, or JPEG compression. This situation is common in practice surveillance cameras, messaging applications, and budget-grade sensors all introduce some form of quality loss before a face reaches the verification pipeline. When this happens, the embedding model begins to drift away from the true identity representation of the individual, causing genuine pairs to appear less similar and, in some cases,making impostor pairs look deceptively close. This work investigates whether super resolution preprocessing, when trained explicitly to preserve biometric identity rather than just visual quality, can recover the verification signal lost to image degradation. We fine-tune CodeFormer\u2014a codebook based blind face restoration network anchored to a frozen VQGAN face prior\u2014on the Labeled Faces in the Wild (LFW) dataset using a three-component composite loss that combines pixel-level L1 reconstruction, a VGG-19 perceptual term, and a FaceNet- based identity penalty that directly discourages embedding drift. Training operates on a pool of 3,000 LFW images on a single NVIDIA T4 GPU. Before fine-tuning, we sweep three fidelity weight settings of the pretrained model on a balanced set of 6,000 pairs to characterise the quality-versus-identity trade-off. Biometric evaluation uses ArcFace embeddings assessed through ROC curves, AUC, Equal Error Rate (EER), and TAR at FAR = 0.1% on the full 6,000-pair official LFW benchmark. Results show that the identity-aware fine-tuned model closes the genuine-pair similarity gap and does so without inflating impostor similarity\u2014the critical security constraint for any biometric deployment.",
    type: "MTP",
    status: "Completed",
  },
  {
    sno: 14,
    studentName: "P. Sri Haindavi",
    rollNo: "CS24M1008",
    title: "Enhancing Vehicle Safety on Roads: An AI-Driven Driver Assistance System with Dash Cameras",
    explanation: "Pedestrian-related accidents in urban setting are still a major issue in road safety, due to occlusion, dynamic motion and the lack of existing Advanced Driver Assistance Systems (ADAS) to anticipate pedestrian behaviour proactively. This paper provides a real time and vision-based ADAS pipeline for pedestrian detection, panoptic segmentation, multi-object tracking, trajectory prediction, and road-aware collision warning based on information from a front facing dash camera and vehicle On-Board Diagnostics (OBD). The perception pipeline uses YOLOv8-Seg for instance segmentation and BiSeNetV2 for semantic segmentation, with a panoptic fusion module that performs Hungarian matching to fuse the two outputs. The pedestrian detection is tracked across frames with the help of a dual Kalman filter and the four-stage association in the ByteTrack framework. An ego-motion compensation module is implemented to compensate camera induced apparent motion for pedestrian trajectory before prediction by taking into account OBD speed and gyro yaw rate. Such a model is custom trained directly on PIE dashcam data to predict 12 positions of future pedestrians in the ego-compensated image space. Finally, a road-aware collision warning system (TTC) is computed in real time by three complementary methods (depth-based, lateral, trajectory-based), and every pedestrian is classified as Safe (TTC > 3.0 s), Warning (1.5 s < TTC ? 3.0 s), or Alert (TTC ? 1.5 s), where the road segmentation system BiSeNetV2 prevents false alerts for pedestrians on sidewalks.",
    type: "MTP",
    status: "Completed",
  },
  {
    sno: 15,
    studentName: "Vaagdevhi Varkkala",
    rollNo: "CS24M1018",
    title: "Monocular 3D Pedestrian Detection using Transformers",
    explanation: "Monocular 3D pedestrian detection is a specific task within 3D object detection, it focuses on recognizing and localizing pedestrians in a three-dimensional space but only using a single camera. The primary objective of 3D pedestrian detection is to accurately determine the position, dimension, and orientation of pedestrians in real time, enabling systems to predict the pedestrian behavior and take proactive measures to prevent accidents. Object Detection is the prerequisite for many downstream vision tasks like object tracking, object segmentation, object re-identification, action recognition, pose estimation and scene understanding. 3D object detection is pivotal in areas like visual surveillance, robotics, AR/VR, health care, traffic management and autonomous vehicles. The impact of 3D pedestrian detection is transformative for road safety. In applications like ADAS (Advanced Driver Assistance Systems) and autonomous vehicles, where pedestrian detection with dashboard camera helps in collision avoidance, emergency braking, and path planning. It also supports smart city infrastructure, where pedestrian detection can enhance traffic management and improve pedestrian safety at intersections and crosswalks. In assisted living, 3D pedestrian detection aids in fall detection, obstacle avoidance, and activity recognition, improving the quality of life for elderly, children and disabled individuals by ensuring their safety and independence. In Business, especially in smart retail environment this can be used to monitor customer behavior and product interaction. By using transformers, which capture the long-range dependencies it can improve both the pedestrian localization and depth estimation for monocular 3D pedestrian detection. Transformer models like DETR (Detection Transformers) and it's variations can be used to detect the pedestrian.",
    type: "MTP",
    status: "Completed",
  },
  {
    sno: 16,
    studentName: "Velide Sri Manaswini",
    rollNo: "CS22B2030",
    title: "Recursive Adaptive Backbone using Mixture of Recursions (MoR) for Robust Pedestrian Detection",
    explanation: "Detecting pedestrians in crowded scenes is genuinely difficult. When people overlap, are partially hidden, or appear at very small scales in the image, most detection models start making mistakes \u2014 merging two people into one box, missing smaller individuals, or producing uncertain predictions that get filtered during post-processing. A core reason is that standard detection backbones apply the same processing depth everywhere in the image regardless of how complex a scene region actually is. That uniform treatment is wasteful and limits what the model can do in dense crowds. This project proposes MoR-YOLOv8, a new detection architecture that modifies the YOLOv8 backbone by replacing the fixed-depth C2f blocks at the two deepest backbone stages with a recursive, weight-sharing module called MoR_C2f. Instead of stacking multiple independent convolutional blocks, one shared block is applied recursively three times, and a learned softmax-weighted mixture combines outputs from each pass. This gives the backbone deeper and more adaptive processing at the semantic stages that matter most for crowd scenes, without adding new unique parameters. The architecture is evaluated on the Crowd Human benchmark (15,000 training images, 4,370 validation images with dense pedestrian annotations) under identical 50 epoch training conditions. MoR-YOLOv8 achieves mAP@0.5 of 88.2% and mAP@0.5:0.95 of 56.8%, improving over YOLOv8L (87.2%, 56.0%) and YOLOv8X (87.2%, 56.5%) by +1.0 percentage point in the primary metric, while using fewer unique parameters than YOLOv8L. An ablation over n ? {1, 2, 3, 5, 7} recursive passes confirms n = 3 as the optimal accuracy-to-efficiency trade-off.",
    type: "BTP",
    status: "Completed",
  },
  {
    sno: 17,
    studentName: "Dindigala Rahul",
    rollNo: "CS22B2042",
    title: "From Language to Vision: Sparse Hebbian Linear Attention - Structural Analysis & Vision Adaptation",
    explanation: "This project traces a two-phase research process. The first phase implements and systematically analyses the BDH-GPU architecture, a biologically motivated language model that replaces standard Transformer attention with a sparse Hebbian linear attention mechanism, and compares it against a GPT-style baseline and a proposed Hybrid model on the Tiny Shakespeare autoregressive language modelling task. The second phase generalises the BDH mechanism to the visual domain, producing the Eagle Hatchling (BEH): an encoder-only vision model that adapts the Dragon Hatchling's three shared weight matrices to image patch sequences by removing the causal constraint and operating bidirectionally across all patch positions simultaneously. The language modelling phase demonstrates that BDH-GPU achieves lower validation loss and perplexity than the GPT baseline under parameter-matched conditions (BDH: 1.52, GPT: 1.78, Hybrid: 1.80 at ~2M parameters), with activation sparsity in internal representations increasing monotonically from ~50% at initialisation to over 73% at convergence. Structured pruning experiments confirm that up to 50% of the neuron width can be removed with only 0.2 increase in perplexity while gaining 58.7% inference throughput. The vision phase demonstrates that BEH achieves 77.37% top-1 accuracy on CIFAR-10 using 0.90M parameters, outperforming a standard ViT baseline (73.89%, 2.70M parameters) by 3.48% points with 3x fewer parameters. On ImageNet-100, BEH operates at 1.09M parameters and 0.038 GFLOPs per image, reductions of 5.1x and 28x respectively relative to DeiT-Tiny and Vim-Tiny, while achieving the highest top-5 accuracy among all three models. Activation sparsity analysis confirms that the Hebbian selectivity property observed in language modelling transfers to visual feature learning. Taken together, these results establish BDH-style Hebbian sparse linear attention as a general, parameter-efficient architectural mechanism that functions across both sequential and spatial modalities.",
    type: "BTP",
    status: "Completed",
  },
  {
    sno: 18,
    studentName: "Pranav Singh",
    rollNo: "CS22B1056",
    title: "Baby Dragon Hatchling for Amodal Instance Segmentation on the KINS Dataset",
    explanation: "What a camera sees and what actually exists in a scene are two very different things. Pixels record reflected light from whatever surfaces happen to face the lens, anything behind an occluder simply goes unrepresented, as if it ceased to exist. For many downstream tasks robot grasping, collision prediction, multi-object tracking - this missing information is not a minor inconvenience but a hard failure mode. Recovering it is the goal of amodal instance segmentation. This work applies, for the first time, the Brain-Dynamics Hypothesis (BDH) to that problem. The key idea is borrowed from computational neuroscience: rather than predicting a mask in one feed-forward pass, the network runs an iterative competition among spatial feature nodes inside each Region of Interest (RoI). Nodes associated with the same physical object tend to co-activate; the Lotka-Volterra (L-V) equations formalise this by letting co-firing nodes reinforce each other while inconsistent ones fade out. When the process settles -- after L steps -- the surviving activations outline the full object, visible and hidden portions alike. Tested on the KINS benchmark [2], the model achieves a mean amodal IoU of 0.8315, mean visible loU of 0.8314, and classification accuracy of 73.38% Predicted masks for common categories such as car and pedestrian visibly extend into occluded areas, confirming that the attractor mechanism is doing genuine completion work rather than merely reproducing what the camera sees.",
    type: "BTP",
    status: "Completed",
  },
  {
    sno: 19,
    studentName: "Konkimalla Bala Sai Manvitha",
    rollNo: "CS22B1030",
    title: "RepoSage: An AI-Based System for Natural Language Querying of Software Codebases",
    explanation: "This project RepoSage helps developers understand large and unfamiliar codebases by letting them ask questions in natural language. Instead of manually going through thousands of files, the user just gives a GitHub repository URL and asks what they want to know. It uses a Retrieval-Augmented Generation (RAG) architecture where the system clones a GitHub repository, parses the code into meaningful chunks using Abstract Syntax Trees for Python and language-aware text splitting for other languages, generates vector embeddings, and stores them in a vector database. When a user asks a question, the system retrieves the most relevant code segments and passes them to an LLM to generate a context-aware explanation. The chunking process enriches each chunk with file path headers and class context, filters out generic stdlib imports, and discards very small chunks to reduce noise. Embeddings are generated using the all-mpnet-base-v2 model (768 dimensions) and stored in ChromaDB. The LLM used is Llama3 running locally through Ollama, which keeps the system fully offline and ensures data privacy. The system supports both semantic and keyword-based search, multi-turn conversations, commit pinning for indexing specific repository versions, and a caching mechanism to avoid re-indexing previously processed repositories. An evaluation module measures retrieval quality using Recall@k, Precision@k, MRR, and Keyword Recall, and also scores generation quality through an LLM-as-judge approach. The final system achieves a Recall@k of 0.822 and Precision@k of 0.387. The entire system is built with Python, Streamlit, ChromaDB, and LangChain, and runs locally through an interactive web interface. Overall, this project makes it easier to understand unfamiliar codebases with less effort and saves time.",
    type: "BTP",
    status: "Completed",
  },
  {
    sno: 20,
    studentName: "Varshitha Masaram",
    rollNo: "CS22B1071",
    title: "Cluster-Based Generation of Fingerprint and Iris Biometric Images",
    explanation: "Training and testing biometric recognition models require extensive and varied training and testing datasets. Real-world collection of such data poses various privacy risks and legal concerns, and the existing datasets are usually unbalanced with poor intra class variability. We propose a cascaded diffusion-based approach to create clustering synthetic fingerprint and iris image dataset. Each cluster contains many generated images of one synthetic identity that have similar features to each other while images from different clusters look visually very different. Our proposed pipeline consists of three stages: (1) a Random Network (RNet) trained to generate privacy-safe low resolution thumbnails using the DDPM approach; (2) an enhancement network for upscaling these thumbs upto full resolution; and (3) a Deterministic Network (DNet) conditioned on identity using class embeddings and classifier-free guidance (CFG) to produce clustered outputs. A contrastive learning loss is introduced in-between diffusion steps to strengthen inter-identity separation. Our experiment with a SOCOFing fingerprint dataset and MMU Iris Database showed that the generated images were realistic and formed coherent clusters measured via silhouette coefficient, Davies-Bouldin index, intra-cluster SSIM, and Fr\u00e9chet Inception distance metrics. We tested our ap- proach with open source biometric matching algorithms, showing that ROC AUC for deep CNN matcher was larger than 0.80, and the synthetic identities were separable for real-world biometric recognition models.",
    type: "BTP",
    status: "Completed",
  },
  {
    sno: 21,
    studentName: "P. Naga Sripada",
    rollNo: "CS22B1018",
    title: "Study and Experimental Implementation of Mixture of Recursions (MoR) for Vision Tasks",
    explanation: "Transformers have completely revolutionized modern deep leaning, they became the dominanat architecture across Natural Language Processing and Computer Vision tasks. Their success led to the development of many advanced architectures such as Vision Transformers (ViTs), Recursive Transformers, Efficient Vision Models, and recent State Space models like Mamba. Despite their strong capabilities, most existing architectures, apply uniform computation across all tokens or image patches, regardless of the complexity or importance of different regions. This results in unnecessary computational overhead, especially in resource-constrained environments. This limitation was beautifully addressed by Google\u2019s Mixture of Recursions (MoR) framework, which introduced adaptive token-level computation through recursive parameter sharing and dynamic recursion depth allocation. While MoR demonstrated promising results in language models, its adaptation to computer vision remains relatively unexplored. In this project, the principles of Mixture of Recursions were integrated into Vision Transformer architectures to develop and analyze multiple Vision-MoR implementations. The work began with a baseline Vision-MoR prototype, subsequently multiple improved versions were developed through architectural and parameter modifications. Comparative analyzes were performed across all implementations. In addition, a broader SOTA benchmark study was conducted by comparing vision-mor, with several modern post transformer and efficient vision architectures. The study highlights the effectiveness of Vision-MoR as a scalable and efficient vision framework and provides insights into the future direction of adaptive computation in computer vision systems.",
    type: "BTP",
    status: "Completed",
  }
];

const API_URL = "http://localhost:5000/api";

const isSeeding = typeof (globalThis as any).process !== "undefined" && (globalThis as any).process.argv && (globalThis as any).process.argv.some((arg: string) => arg.includes("seed") || arg.includes("check_db") || arg.includes("test_import"));

if (!isSeeding) {
  try {
    const [peopleRes, projectsRes, achievementsRes, supervisedRes, resourcesRes, statsRes] = await Promise.all([
      fetch(`${API_URL}/people`).catch(() => null),
      fetch(`${API_URL}/projects`).catch(() => null),
      fetch(`${API_URL}/achievements`).catch(() => null),
      fetch(`${API_URL}/supervised`).catch(() => null),
      fetch(`${API_URL}/resources`).catch(() => null),
      fetch(`${API_URL}/stats`).catch(() => null),
    ]);

    if (peopleRes && peopleRes.ok) {
      const fetchedPeople = await peopleRes.json();
      if (Array.isArray(fetchedPeople) && fetchedPeople.length > 0) {
        const g = fetchedPeople.find(p => p.role === "guide");
        if (g) guide = g;
        scholars = fetchedPeople.filter(p => p.role === "scholar");
        allPeople = fetchedPeople;
      }
    }

    if (projectsRes && projectsRes.ok) {
      const fetchedProjects = await projectsRes.json();
      if (Array.isArray(fetchedProjects)) {
        projects = fetchedProjects;
      }
    }

    if (achievementsRes && achievementsRes.ok) {
      const fetchedAchievements = await achievementsRes.json();
      if (Array.isArray(fetchedAchievements)) {
        achievements = fetchedAchievements;
      }
    }

    if (supervisedRes && supervisedRes.ok) {
      const fetchedSupervised = await supervisedRes.json();
      if (Array.isArray(fetchedSupervised)) {
        supervisedProjects = fetchedSupervised;
      }
    }

    if (resourcesRes && resourcesRes.ok) {
      const fetchedResources = await resourcesRes.json();
      if (Array.isArray(fetchedResources)) {
        resources = fetchedResources;
      }
    }

    // Recalculate stats dynamically based on the fetched data
    labStats = {
      members: allPeople.length,
      publications: allPeople.reduce((sum, p) => sum + (p.publications?.length || 0), 0),
      projects: projects.length,
      collaborations: 14,
      outlay: 37.34,
      awards: allPeople.reduce((sum, p) => sum + (p.awards?.length || 0), 0),
    };

    if (statsRes && statsRes.ok) {
      const fetchedStats = await statsRes.json();
      if (Array.isArray(fetchedStats)) {
        fetchedStats.forEach(item => {
          if (item.key && item.value !== undefined) {
            (labStats as any)[item.key] = item.value;
          }
        });
      }
    }
  } catch (error) {
    console.warn("Failed to load dynamic data from API, falling back to static dataset.", error);
  }
}
