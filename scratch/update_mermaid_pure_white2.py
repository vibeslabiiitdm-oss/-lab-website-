import os
import re

files = [
    r'c:\Users\vempa\.gemini\antigravity-ide\brain\c13d9944-8691-44d2-990b-2bdb380d9857\chapter1_introduction.md',
    r'c:\Users\vempa\.gemini\antigravity-ide\brain\c13d9944-8691-44d2-990b-2bdb380d9857\chapter2_methodology.md',
    r'c:\Users\vempa\.gemini\antigravity-ide\brain\770952a6-8669-4aba-81c2-541c960b7c88\chapter3_work_done.md'
]

# We switch to 'default' theme which handles arrows better, but override background and node colors to pure white/black.
replacement = "```mermaid\n%%{init: {'theme': 'default', 'themeVariables': { 'background': '#ffffff', 'primaryColor': '#ffffff', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'primaryBorderColor': '#000000', 'primaryTextColor': '#000000', 'lineColor': '#000000', 'textColor': '#000000'}}}%%\n"

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Replace the existing init block
        content = re.sub(r'```mermaid\n(%%\{init.*?\}%%\n)?', replacement, content)
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated {f}")
