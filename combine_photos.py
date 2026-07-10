import json

with open('chatbot/lab_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Keep non-rover-photo resources
new_resources = []
for res in data.get('resources', []):
    if not res['name'].startswith("ViBeS Rover Hardware Photo:"):
        new_resources.append(res)

# Create a combined entry
gallery_detail = "Collection of all hardware photos used in the lab projects, including the custom autonomous rover.\n"
rover_photos = [
  { "id": 1, "file": "/images/rover/1.jpg", "title": "Chassis Assembly", "detail": "Structural frame of the custom 4-wheel drive rover platform." },
  { "id": 2, "file": "/images/rover/2.jpg", "title": "LIDAR Integration", "detail": "Mounting and testing the 360-degree laser rangefinder." },
  { "id": 3, "file": "/images/rover/3.jpg", "title": "Jetson Orin Compute", "detail": "High-performance AI edge board mounted on the main chassis." },
  { "id": 4, "file": "/images/rover/4.jpg", "title": "Power Management Rig", "detail": "Dual LiFePO4 batteries with custom charging and monitoring circuitry." },
  { "id": 5, "file": "/images/rover/5.jpg", "title": "Stereo Camera Mount", "detail": "Dual-lens spatial intelligence camera for depth perception." },
  { "id": 6, "file": "/images/rover/6.jpg", "title": "Drive Motor Gearbox", "detail": "High-torque brush-less DC motors for rough outdoor terrain." },
  { "id": 7, "file": "/images/rover/7.jpg", "title": "Under-chassis Wiring", "detail": "Clean routing of control wires and power distribution lines." },
  { "id": 8, "file": "/images/rover/8.jpg", "title": "Calibration Rig", "detail": "Setting up checkerboard calibration for stereo-vision alignment." },
  { "id": 9, "file": "/images/rover/9.jpg", "title": "Full Assembly (Side View)", "detail": "Completed rover assembly ready for initial indoor test runs." },
  { "id": 10, "file": "/images/rover/10.jpg", "title": "Remote Controller Link", "detail": "Configuring telemetry link and manual override controls." },
  { "id": 11, "file": "/images/rover/11.jpg", "title": "Telemetry Screen", "detail": "Monitoring ROS diagnostics and mapping status on remote monitor." },
  { "id": 12, "file": "/images/rover/12.jpg", "title": "Field Test Prep", "detail": "Verifying wheel alignment and sensor stability before deployment." },
  { "id": 13, "file": "/images/rover/13.jpg", "title": "LiDAR Point Cloud", "detail": "Visualization of the 3D point cloud scans from the lab interior." },
  { "id": 14, "file": "/images/rover/14.jpg", "title": "Final Build (Front View)", "detail": "ViBeS Rover in its final configuration with protective shell." }
]

gallery_entry = {
    "name": "ViBeS Rover Hardware Photo Gallery (All Images)",
    "detail": "Collection of all hardware photos used in the lab projects, including the custom autonomous rover. When the user asks for hardware photos, return all these images.",
    "images_list": rover_photos
}

new_resources.append(gallery_entry)
data['resources'] = new_resources

with open('chatbot/lab_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
