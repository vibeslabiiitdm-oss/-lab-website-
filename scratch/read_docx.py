import zipfile
import xml.etree.ElementTree as ET
import os

def read_docx(file_path):
    print(f"\n=========================================\nFILE: {os.path.basename(file_path)}\n=========================================")
    try:
        with zipfile.ZipFile(file_path) as docx:
            xml_content = docx.read('word/document.xml')
            root = ET.fromstring(xml_content)
            
            # Namespaces
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            text_parts = []
            for paragraph in root.findall('.//w:p', ns):
                para_text = []
                for text_el in paragraph.findall('.//w:t', ns):
                    if text_el.text:
                        para_text.append(text_el.text)
                if para_text:
                    text_parts.append("".join(para_text))
            
            content = "\n".join(text_parts)
            print(content)
            return content
    except Exception as e:
        print(f"Error reading docx: {e}")
        return ""

base_dir = r"c:\Users\vempa\OneDrive\Desktop\Lab Website\Website_Details"
read_docx(os.path.join(base_dir, "Apurba", "Apurba_Details.docx"))
read_docx(os.path.join(base_dir, "Sahith", "Sahith_Details.docx"))
read_docx(os.path.join(base_dir, "Sukesh", "Camped_dataset", "Dataset_Details.docx"))
