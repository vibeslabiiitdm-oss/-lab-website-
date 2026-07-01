import { execSync } from "child_process";
import path from "path";

try {
    const pythonScript = path.resolve(process.cwd(), "../chatbot/query.py");
    const venvPython = path.resolve(process.cwd(), "../chatbot/venv/Scripts/python.exe");
    const query = "Who is rahul raman?";
    
    console.log("Python script path:", pythonScript);
    console.log("Venv Python path:", venvPython);
    
    const result = execSync(`"${venvPython}" "${pythonScript}" "${query}"`, {
        cwd: path.resolve(process.cwd(), "../chatbot"),
        maxBuffer: 1024 * 1024 * 10
    });
    console.log("SUCCESS:");
    console.log(result.toString());
} catch (e) {
    console.log("ERROR:");
    console.log(e.toString());
    console.log(e.stdout ? e.stdout.toString() : "");
    console.log(e.stderr ? e.stderr.toString() : "");
}
