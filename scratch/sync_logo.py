import shutil
import os

logo_src = r"c:\Users\vempa\OneDrive\Desktop\Lab Website\Website_Details\ViBeS Logo 2 (1).png"
dests = [
    r"c:\Users\vempa\OneDrive\Desktop\Lab Website\frontend\public\logo.png",
    r"c:\Users\vempa\OneDrive\Desktop\Lab Website\admin\public\logo.png"
]

for dst in dests:
    shutil.copy2(logo_src, dst)
    print(f"Copied logo to {dst}")
