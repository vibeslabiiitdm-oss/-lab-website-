import json
import re

image_map = {
    "NVIDIA JETSON NANO DEV KIT (B01)": "/images/rover/3.jpg",
    "NVIDIA JETSON XAVIER NX (16 GB RAM)": "/images/hardware/jetson_xavier.png",
    "HP MONITOR": "/images/hardware/hp_monitor.png",
    "DELL OPTIPLEX 500 DESKTOP PC": "/images/hardware/dell_optiplex.png",
    "3 TRIPODS": "/images/hardware/tripod.png",
    "AM ROBOTICS ROVER 4WDXL60R KIT": "/images/rover/14.jpg",
    "LED MONITOR 60.4CM, ZEB-A24FHDLED": "/images/hardware/led_monitor.png",
    "PANASONIC VIDEO CAMERA (HC-V385):": "/images/hardware/panasonic_camera.png",
    "EPSON L130 PRINTER": "/images/hardware/epson_printer.png",
    "SONY A6100 CAMERA": "/images/hardware/sony_camera.png"
}

# 1. Patch chatbot/lab_data.json
with open('chatbot/lab_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for res in data.get('resources', []):
    if res['name'] in image_map:
        res['image'] = image_map[res['name']]

# Let's also add all rover photos as resources so the chatbot can find them easily!
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

for p in rover_photos:
    data['resources'].append({
        "name": f"ViBeS Rover Hardware Photo: {p['title']}",
        "detail": p['detail'],
        "image": p['file']
    })

with open('chatbot/lab_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

# 2. Patch frontend/src/data/lab.ts and admin/src/data/lab.ts
for filepath in ['frontend/src/data/lab.ts', 'admin/src/data/lab.ts']:
    with open(filepath, 'r', encoding='utf-8') as f:
        ts_content = f.read()

    match = re.search(r'(export (?:let|const) resources = \[)(.*?)(];)', ts_content, re.DOTALL)
    if match:
        resources_str = match.group(2)
        for name, img in image_map.items():
            pattern = r'({[^}]*name:\s*"' + re.escape(name) + r'"[^}]*)'
            def repl(m):
                obj = m.group(1)
                if 'image:' not in obj:
                    return obj.rstrip() + f',\n    image: "{img}"\n  '
                return obj
            resources_str = re.sub(pattern, repl, resources_str)
        
        new_content = ts_content[:match.start(2)] + resources_str + ts_content[match.end(2):]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

print("Patch successful!")
