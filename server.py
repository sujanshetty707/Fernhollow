import os
import json
from flask import Flask, request, jsonify, send_from_directory
import eco_analyzer

app = Flask(__name__, static_folder=".")

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory(".", filename)

@app.route("/api/analyze", methods=["POST"])
def analyze_endpoint():
    try:
        data = request.get_json(force=True, silent=True) or {}
        url = data.get("url", "").strip()
        if not url:
            return jsonify({"success": False, "error": "Please provide a valid product URL."}), 400
        
        result = eco_analyzer.analyze_product(url)
        if "error" in result:
            return jsonify({"success": False, "error": result["error"]}), 400
            
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": f"Analysis failed: {str(e)}"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    print(f"Fernhollow Server running at http://localhost:{port}/")
    app.run(host="0.0.0.0", port=port, debug=False)
