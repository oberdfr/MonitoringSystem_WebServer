from flask import Flask, make_response, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

username = "admin"
passwordvera = "admin"

@app.route("/")
def index():
    response = app.response_class(
        response="gabibbo",
        mimetype='application/json'
    )
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route("/posso")
def add():
    user = request.args.get("user")
    pwd = request.args.get("pwd")

    response = {
        "status": "bad request"
    }

    if user == username:
        if pwd == passwordvera:
            print("OK")
            response["status"] = "success"
            
            response["path"] = "C:/Users/loren/OneDrive/Desktop/elsito/dashboard.html"
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
