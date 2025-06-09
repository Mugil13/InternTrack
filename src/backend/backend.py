import pytesseract
import re
import cv2
import numpy as np
from flask import Flask, request, jsonify
from pdf2image import convert_from_bytes
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def preprocess_image(img):
    """Convert image to grayscale, apply thresholding, and denoise."""
    img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2GRAY)
    img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    return Image.fromarray(img)

extracted_info={}

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Read the file from memory (without saving)
    file_bytes = file.read()

    # Convert PDF bytes to images
    images = convert_from_bytes(file_bytes, dpi=300)

    # Extract text from images
    extracted_text = []
    for img in images:
        img = preprocess_image(img)  # Apply preprocessing
        text = pytesseract.image_to_string(img, config="--psm 6")  
        extracted_text.append(text)

    # Combine text from all pages
    full_text = "\n".join(extracted_text)

    # Define patterns to extract required fields
    patterns = {
        "Name": r"Name\s*:\s*(.+)",
        "Register Number": r"Register Number\s*:\s*(\d+)",
        "CGPA": r"CGPA\s*:\s*([\d.]+)",
        "Mobile Number": r"Mobile Number\s*:\s*(\d{10})",
        "Email ID": r"Email ID\s*:\s*([\w\.-]+@[\w\.-]+)",
        "Company": r"Name of the Company / Institution\s*:\s*(.+)",
        "Internship Start Date": r"Internship start date\s*:\s*([\d./-]+)",
        "Internship End Date": r"Internship end date\s*:\s*([\d./-]+)"
    }


    for key, pattern in patterns.items():
        match = re.search(pattern, full_text, re.IGNORECASE)
        extracted_info[key] = match.group(1).strip() if match else "Not found"
    
    print(extracted_info)

    return jsonify(extracted_info)


@app.route("/extracteddata", methods=["GET"])
def dispatchdata():
    print(extracted_info)
    if extracted_info=={}:
        return jsonify({"message":"no data"})
    else:
        return jsonify(extracted_info)


if __name__ == "__main__":
    app.run(debug=True,port=5001)
