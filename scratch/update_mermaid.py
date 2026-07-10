import os
import re

files = [
    r'c:\Users\vempa\.gemini\antigravity-ide\brain\c13d9944-8691-44d2-990b-2bdb380d9857\chapter1_introduction.md'
]

replacement = "```mermaid\n%%{init: {'theme': 'default', 'themeVariables': { 'background': '#ffffff'}}}%%\n"

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Replace if not already replaced
        content = re.sub(r'```mermaid\n(?!%%\{init)', replacement, content)
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated {f}")
