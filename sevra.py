from flask import Flask, request, jsonify, redirect, url_for, send_from_directory, session, render_template
from flask_cors import CORS
from flask_session import Session
import json
import os


app = Flask(__name__)
CORS(app)

# Secret key for sessions
app.secret_key = 'your_secret_key'

# Session configuration
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = '/tmp/flask_session'
Session(app)

# Hardcoded credentials
USERNAME = "admin"
PASSWORD = "admin"

# Define the path to the file that will store the data
TMP_BIN_DATA = 'tmp_bin_data.json'

@app.route("/login")
def index():
    return render_template('login.html')  # Default page for login

@app.route("/posso")
def posso():
    user = request.args.get("user")
    pwd = request.args.get("pwd")

    if user == USERNAME and pwd == PASSWORD:
        session['logged_in'] = True
        print(f"Session set: {session['logged_in']}")
        return jsonify(status="success", path=url_for('dashboard', _external=True))
    else:
        return jsonify(status="bad request")

@app.route("/logout")
def logout():
    session.pop('logged_in', None)
    return jsonify(status="logged out")

@app.route("/check_session")
def check_session():
    if session.get('logged_in'):
        return jsonify(status="authenticated")
    else:
        return jsonify(status="unauthenticated")

@app.route("/dashboard.html")
def dashboard():
    print(f"Accessing dashboard: logged_in={session.get('logged_in')}")
    if session.get('logged_in'):
        return render_template('dashboard.html')
    else:
        return render_template('login.html')

@app.route("/<page>.html")
def render_page(page):
    if session.get('logged_in'):
        return render_template(f'{page}.html')
    else:
        return render_template('login.html')

@app.route("/static/<path:path>")
def send_static(path):
    return send_from_directory('static', path)

@app.route("/error")
def error():
    return render_template('error.html')

@app.route('/sendpeople')
def getP():
    p = request.args.get("people")
    print(p)
    return jsonify(status="people sent")

# Function to read data from the file
def read_data():
    if os.path.exists(TMP_BIN_DATA):
        try:
            with open(TMP_BIN_DATA, 'r') as file:
                data = json.load(file)
        except (json.JSONDecodeError, IOError):
            data = {"carta": [], "plastica": []}
    else:
        data = {"carta": [], "plastica": []}
    return data

# Function to write data to the file
def write_data(data):
    with open(TMP_BIN_DATA, 'w') as file:
        json.dump(data, file)

def convertBinData(mis):
    if distanza <= 16:
        return 100
    elif distanza >= 200:
        return 0
    else:
        percentuale = 100 - ((distanza - 16) / (200 - 16)) * 100
        return int(round(percentuale / 5) * 5)
    
@app.route('/sendbin')
def getBin():
    misCarta = convertBinData(int(request.args.get("miscarta", 0)))
    misPlastica = convertBinData(int(request.args.get("misplastica", 0)))

    data = read_data()
    
    # Update the carta values
    data["carta"].append(misCarta)
    if len(data["carta"]) > 10:
        data["carta"].pop(0)
    
    # Update the plastica values
    data["plastica"].append(misPlastica)
    if len(data["plastica"]) > 10:
        data["plastica"].pop(0)

    write_data(data)
    
    print("carta: " + str(misCarta))
    print("plastica: " + str(misPlastica))
    
    return jsonify(status="bin mis sent")

@app.route('/latestbins')
def latest_bins():
    data = read_data()
    latest_data = {
        "carta": data["carta"][-1] if data["carta"] else 0,
        "plastica": data["plastica"][-1] if data["plastica"] else 0
    }
    response = jsonify(latest_data)
    response.headers['Cache-Control'] = 'no-store'
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
