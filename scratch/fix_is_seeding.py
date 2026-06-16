import os

def fix_seeding(file_path):
    print(f"Fixing isSeeding check in {file_path}...")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    target = 'const isSeeding = typeof process !== "undefined" && process.argv && process.argv.some(arg => arg.includes("seed") || arg.includes("check_db") || arg.includes("test_import"));'
    replacement = 'const isSeeding = typeof (globalThis as any).process !== "undefined" && (globalThis as any).process.argv && (globalThis as any).process.argv.some((arg: string) => arg.includes("seed") || arg.includes("check_db") || arg.includes("test_import"));'

    if target in content:
        content = content.replace(target, replacement)
        print("Replaced target.")
    else:
        # Check if it's already modified or slightly different
        print("Target not found exactly, trying search and replace.")
        # Let's search for a similar string
        pos = content.find("const isSeeding = typeof process")
        if pos != -1:
            end_pos = content.find(";", pos) + 1
            content = content[:pos] + replacement + content[end_pos:]
            print("Successfully found and replaced isSeeding.")
        else:
            print("Could not find any process check.")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

fix_seeding(r"c:\Users\vempa\OneDrive\Desktop\Lab Website\frontend\src\data\lab.ts")
fix_seeding(r"c:\Users\vempa\OneDrive\Desktop\Lab Website\admin\src\data\lab.ts")

print("Seeding fix completed!")
