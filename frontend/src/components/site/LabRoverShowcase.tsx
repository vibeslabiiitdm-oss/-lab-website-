import { useState, useRef } from "react";
import {
  Play,
  Pause,
  Maximize2,
  Cpu,
  Layers,
  Video,
  Image as ImageIcon,
  Battery,
  Wifi,
  Activity,
  Camera,
  Compass,
  Crosshair,
  Grid,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Reveal } from "./Reveal";

interface VideoCase {
  id: string;
  file: string;
  title: string;
  mission: string;
  resolution: string;
  sensors: string;
  gps: string;
  velocity: string;
  model: string;
  logs: string[];
}

const VIDEO_CASES: VideoCase[] = [
  {
    id: "case-1",
    file: "/videos/rover/case_1.mp4",
    title: "Autonomous Obstacle Avoidance Run",
    mission: "Detect and navigate around lab obstacles in indoor environment.",
    resolution: "1920x1080 @ 30 FPS",
    sensors: "Stereo Camera, LiDAR (active), IMU",
    gps: "INDOORS (No Signal Lock)",
    velocity: "0.45 m/s",
    model: "YOLOv8-Nano-Edge (TensorRT)",
    logs: [
      "Initializing ROS nodes...",
      "LiDAR spin-up complete. Range check: OK.",
      "Weights loaded for YOLOv8-Nano. Precision: FP16.",
      "Telemetry link established over local AP.",
      "Starting traversal. Target path planned.",
      "Obstacle detected at 1.42m. Steering adjusted left.",
      "Local map updated. Re-evaluating waypoints.",
    ],
  },
  {
    id: "case-2",
    file: "/videos/rover/case_2.mp4",
    title: "Target Localization & SLAM",
    mission: "Perform active localization and construct 2D occupancy grid map.",
    resolution: "1280x720 @ 60 FPS",
    sensors: "LiDAR (active), Wheel Encoders, Gyroscope",
    gps: "INDOORS (Local Anchor Sync)",
    velocity: "0.22 m/s",
    model: "RTAB-Map (SLAM & Odom)",
    logs: [
      "Wheel encoder calibration: OK.",
      "Syncing IMU covariance matrix...",
      "Laser scan matching started. Scan-to-Scan loss: 0.04.",
      "RTAB-Map database opened in memory-save mode.",
      "Loop closure detected! Correcting drift.",
      "Grid cell updates: 242 occupied, 1085 free.",
    ],
  },
  {
    id: "case-3",
    file: "/videos/rover/case_3.mp4",
    title: "Dynamic Obstacle Tracking",
    mission: "Track moving entities (human research scholars) in the lab corridor.",
    resolution: "1920x1080 @ 30 FPS",
    sensors: "RGB-D Intel RealSense (active), IMU",
    gps: "INDOORS",
    velocity: "0.55 m/s",
    model: "ByteTrack + YOLOv8-Medium (Edge Inference)",
    logs: [
      "RGB-D depth stream aligned with color stream.",
      "Detector pipeline initialized. Batch size = 1.",
      "Tracking context initialized (ByteTrack).",
      "Entity identified: Person_001 (Conf: 92%).",
      "Tracking Person_001. Est. velocity: 1.1m/s.",
      "Maintaining safe margin of 2.0 meters.",
    ],
  },
  {
    id: "case-4",
    file: "/videos/rover/case_5.mp4",
    title: "Outdoor Traversal & Ground Estimation",
    mission: "Navigate rough gravel and grass outside the lab building.",
    resolution: "1920x1080 @ 30 FPS",
    sensors: "RTK-GPS (active), Stereo Camera, LiDAR",
    gps: "RTK FIXED (Accuracy: 1.2cm)",
    velocity: "0.80 m/s",
    model: "TerrainNet Ground Segmentation",
    logs: [
      "RTK GPS signal acquired. Satellites: 18.",
      "Ground segmentation model initialized on Orin GPU.",
      "Terrain type identified: Gravel (friction factor: 0.65).",
      "High torque profile activated for BLDC motors.",
      "GPS waypoint navigation enabled. Deviation: 0.05m.",
      "Target goal coordinates reached.",
    ],
  },
];

interface PhotoItem {
  id: number;
  file: string;
  title: string;
  detail: string;
}

const PHOTO_ITEMS: PhotoItem[] = [
  { id: 1, file: "/images/rover/1.jpg", title: "Chassis Assembly", detail: "Structural frame of the custom 4-wheel drive rover platform." },
  { id: 2, file: "/images/rover/2.jpg", title: "LIDAR Integration", detail: "Mounting and testing the 360-degree laser rangefinder." },
  { id: 3, file: "/images/rover/3.jpg", title: "Jetson Orin Compute", detail: "High-performance AI edge board mounted on the main chassis." },
  { id: 4, file: "/images/rover/4.jpg", title: "Power Management Rig", detail: "Dual LiFePO4 batteries with custom charging and monitoring circuitry." },
  { id: 5, file: "/images/rover/5.jpg", title: "Stereo Camera Mount", detail: "Dual-lens spatial intelligence camera for depth perception." },
  { id: 6, file: "/images/rover/6.jpg", title: "Drive Motor Gearbox", detail: "High-torque brush-less DC motors for rough outdoor terrain." },
  { id: 7, file: "/images/rover/7.jpg", title: "Under-chassis Wiring", detail: "Clean routing of control wires and power distribution lines." },
  { id: 8, file: "/images/rover/8.jpg", title: "Calibration Rig", detail: "Setting up checkerboard calibration for stereo-vision alignment." },
  { id: 9, file: "/images/rover/9.jpg", title: "Full Assembly (Side View)", detail: "Completed rover assembly ready for initial indoor test runs." },
  { id: 10, file: "/images/rover/10.jpg", title: "Remote Controller Link", detail: "Configuring telemetry link and manual override controls." },
  { id: 11, file: "/images/rover/11.jpg", title: "Telemetry Screen", detail: "Monitoring ROS diagnostics and mapping status on remote monitor." },
  { id: 12, file: "/images/rover/12.jpg", title: "Field Test Prep", detail: "Verifying wheel alignment and sensor stability before deployment." },
  { id: 13, file: "/images/rover/13.jpg", title: "LiDAR Point Cloud", detail: "Visualization of the 3D point cloud scans from the lab interior." },
  { id: 14, file: "/images/rover/14.jpg", title: "Final Build (Front View)", detail: "ViBeS Rover in its final configuration with protective shell." },
];

export default function LabRoverShowcase() {
  const [activeTab, setActiveTab] = useState<"video" | "photo">("video");
  
  // Video Section State
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentCase = VIDEO_CASES[activeCaseIdx];

  // Photo Section State
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((err) => console.log("Video play error:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoSelect = (idx: number) => {
    setActiveCaseIdx(idx);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="mt-20 border border-border/60 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-card/80 to-background glass relative overflow-hidden">
      {/* Grid background mask */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/60 pb-6 mb-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] text-accent font-semibold uppercase tracking-wider mb-2">
            <Cpu size={12} className="animate-pulse" /> Custom Machine Assembly
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight">ViBeS Autonomous Rover Platform</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            Our custom-built robotic rover designed for visual surveillance, 3D mapping, and edge-AI deployment research.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex rounded-lg border border-border/80 bg-background/50 p-1 self-stretch md:self-auto">
          <button
            onClick={() => setActiveTab("video")}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === "video"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
            }`}
          >
            <Video size={14} /> Operators Console
          </button>
          <button
            onClick={() => setActiveTab("photo")}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === "photo"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
            }`}
          >
            <ImageIcon size={14} /> Hardware Blueprint
          </button>
        </div>
      </div>

      {/* Tab: Video Operator Console */}
      {activeTab === "video" && (
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Case Selector list */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <h3 className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold flex items-center gap-1.5 mb-1">
              <Activity size={12} className="text-accent" /> Telemetry Case Studies
            </h3>
            {VIDEO_CASES.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleVideoSelect(idx)}
                className={`w-full text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
                  activeCaseIdx === idx
                    ? "bg-primary/10 border-primary text-foreground shadow-md shadow-primary/5"
                    : "border-border/60 hover:border-primary/40 text-muted-foreground hover:text-foreground bg-background/30"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-accent">
                    CASE {item.id.split("-")[1]}
                  </span>
                  {activeCaseIdx === idx && (
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
                  )}
                </div>
                <div className="font-semibold text-sm mt-1 text-foreground">{item.title}</div>
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{item.mission}</p>
              </button>
            ))}
          </div>

          {/* Main Monitor Display */}
          <div className="lg:col-span-8 flex flex-col border border-border/80 rounded-2xl bg-black overflow-hidden relative shadow-inner">
            {/* Operator Header HUD */}
            <div className="flex items-center justify-between border-b border-white/10 bg-zinc-950 px-4 py-2 text-[10px] font-mono text-zinc-400">
              <div className="flex items-center gap-4">
                <span className="text-primary flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> LIVE STREAM
                </span>
                <span>SRC: Rover_Cam_0</span>
                <span>VEL: {currentCase.velocity}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Wifi size={10} className="text-primary" /> -62dBm
                </span>
                <span className="flex items-center gap-1">
                  <Battery size={10} className="text-emerald-500 animate-pulse" /> 84%
                </span>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video group bg-zinc-950 flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src={currentCase.file}
                loop
                muted={isMuted}
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* HUD Target Overlay Reticle */}
              <div className="absolute inset-0 border border-white/5 pointer-events-none flex items-center justify-center">
                <div className="absolute top-4 left-4 h-4 w-4 border-t-2 border-l-2 border-primary/40" />
                <div className="absolute top-4 right-4 h-4 w-4 border-t-2 border-r-2 border-primary/40" />
                <div className="absolute bottom-4 left-4 h-4 w-4 border-b-2 border-l-2 border-primary/40" />
                <div className="absolute bottom-4 right-4 h-4 w-4 border-b-2 border-r-2 border-primary/40" />

                {/* Central Scope */}
                <div className="h-20 w-20 rounded-full border border-dashed border-accent/20 flex items-center justify-center">
                  <Crosshair size={20} className="text-accent/20" />
                </div>
              </div>

              {/* Play / Pause Big Button Overlay */}
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition hover:bg-black/50 group/play"
                >
                  <div className="h-16 w-16 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/40 flex items-center justify-center text-primary-foreground group-hover/play:scale-105 transition-transform">
                    <Play size={24} fill="currentColor" className="ml-1 text-primary" />
                  </div>
                </button>
              )}

              {/* Hover Bottom Controls Panel */}
              <div className="absolute bottom-3 right-3 left-3 bg-black/60 backdrop-blur-md rounded-lg px-4 py-2 border border-white/5 flex items-center justify-between text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="hover:text-primary cursor-pointer">
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button onClick={toggleMute} className="hover:text-primary cursor-pointer">
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </div>
                <div className="font-mono text-[10px] tracking-wider text-zinc-400">
                  DEC: {currentCase.resolution}
                </div>
              </div>
            </div>


          </div>
        </div>
      )}

      {/* Tab: Photo Hardware Gallery */}
      {activeTab === "photo" && (
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {PHOTO_ITEMS.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 30}>
                <button
                  onClick={() => setSelectedPhoto(item)}
                  className="group relative w-full aspect-square rounded-xl border border-border/70 overflow-hidden bg-background cursor-pointer hover:border-primary/50 transition-all duration-300 shadow-sm"
                >
                  <img
                    src={item.file}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Photo Index indicator */}
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-black/60 text-zinc-300 border border-white/5">
                    {String(item.id).padStart(2, "0")}
                  </div>
                  {/* Info Button Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-semibold rounded shadow flex items-center gap-1">
                      Inspect Build <ChevronRight size={10} />
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-dashed border-border/60 bg-muted/5 p-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left justify-between">
            <div>
              <div className="font-semibold text-sm">Need deep physical specifications or sensor schematics?</div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Our mechanical blueprint folders and mounting assembly diagrams are hosted on the lab repository servers.
              </p>
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-chatbot", { detail: "show me photos of hardware blueprint" }))}
              className="inline-flex items-center gap-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              Request Hardware schematics
            </button>
          </div>
        </div>
      )}

      {/* Lightbox / Detail Photo Dialog Modal */}
      <Dialog open={selectedPhoto !== null} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 text-white rounded-xl">
          {selectedPhoto && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl text-zinc-100">{selectedPhoto.title}</DialogTitle>
                <DialogDescription className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
                  ViBeS Rover Blueprint // Component Spec {String(selectedPhoto.id).padStart(2, "0")}
                </DialogDescription>
              </DialogHeader>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 mt-2 flex items-center justify-center">
                <img
                  src={selectedPhoto.file}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-4 border-t border-zinc-900 pt-4 flex gap-3 items-start">
                <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <Cpu size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">Hardware & Deployment Info</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{selectedPhoto.detail}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
