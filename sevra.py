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

# define bin vars
BIDONE_CARTA = 1
CARTA_HEIGHT = 70
BIDONE_PLASTICA = 2
PLASTICA_HEIGHT = 80

# Define the path to the file that will store the data
TMP_BIN_DATA = 'tmp_bin_data.json'
PERM_BIN_DATA = 'perm_bin_data.json'
TMP_AIR_DATA = 'tmp_air_data.json'
PERM_AIR_DATA = 'perm_air_data.json'
# data types
AIR_TYPE = {"MQ2": [], "MQ7": []}
BIN_TYPE = {"carta": [], "plastica": []}

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

@app.route('/sendqoa')
def getQoa():
    val = request.args.get("qa")
    val2 = request.args.get("co2")
    print("qualita: ")
    print(val)
    print("co2")
    print(val2)
    data = read_data(PERM_AIR_DATA, AIR_TYPE)
    data["MQ7"].append(val2)
    data["MQ2"].append(val)
    write_data(data, PERM_AIR_DATA)
    return jsonify(status="people sent")


# Function to read data from the file
def read_data(fileToRead, type):
    if os.path.exists(fileToRead):
        try:
            with open(fileToRead, 'r') as file:
                data = json.load(file)
        except (json.JSONDecodeError, IOError):
            data = type
    else:
        data = type
    return data

# Function to write data to the file
def write_data(data, fileToWrite):
    with open(fileToWrite, 'w') as file:
        json.dump(data, file)


def convertBinData(distanza, bin):
    if (bin == BIDONE_CARTA):
        offsetvalue = 6
        bin_height = CARTA_HEIGHT
    elif(bin == BIDONE_PLASTICA):
        offsetvalue = 12
        bin_height = PLASTICA_HEIGHT

    if distanza <= offsetvalue:
        return 100
    elif distanza >= 200:
        return 0
    else:
        percentuale = 100 - (((distanza - offsetvalue) / bin_height) * 100)
        print(percentuale)
        print(bin)
        return int(round(percentuale / 10) * 10)

    
@app.route('/sendbin')
def getBin():
    misCarta = int(request.args.get("miscarta", 0))
    misPlastica = int(request.args.get("misplastica", 0))
    print("carta percentuali prima di round:")
    percentCarta = convertBinData(misCarta, BIDONE_CARTA)
    print("plastica percentuali prima di round:")
    percentPlastica = convertBinData(misPlastica, BIDONE_PLASTICA)

    temp_data = read_data(TMP_BIN_DATA, BIN_TYPE)
    
    # calc bin diff if emptied
    if (percentCarta - temp_data["carta"][9]) <= -10:
        perm_data = read_data(PERM_BIN_DATA, BIN_TYPE)
        emptyDiffCarta = abs(percentCarta - temp_data["carta"][9])
        try:
            if perm_data["carta"][0]:
                perm_data["carta"][0] = (perm_data["carta"][0] + emptyDiffCarta)
        except (KeyError, IndexError):
            perm_data["carta"].append(emptyDiffCarta)
        write_data(perm_data, PERM_BIN_DATA)

    if (percentPlastica - temp_data["plastica"][9]) <= -10:
        perm_data = read_data(PERM_BIN_DATA, BIN_TYPE)
        emptyDiffPlastica = abs(percentPlastica - temp_data["plastica"][9])
        try:
            if perm_data["plastica"][0]:
                perm_data["plastica"][0] = (perm_data["plastica"][0] + emptyDiffPlastica)
        except (KeyError, IndexError):
            perm_data["plastica"].append(emptyDiffPlastica)
        write_data(perm_data, PERM_BIN_DATA)
    
    # Update the carta values
    temp_data["carta"].append(percentCarta)
    if len(temp_data["carta"]) > 10:
        temp_data["carta"].pop(0)
    
    # Update the plastica values
    temp_data["plastica"].append(percentPlastica)
    if len(temp_data["plastica"]) > 10:
        temp_data["plastica"].pop(0)

    write_data(temp_data, TMP_BIN_DATA)
    
    # debug
    print("distanza carta: " + str(misCarta))
    print("distanza plastica: " + str(misPlastica))
    print("percentuale carta: " + str(percentCarta))
    print("percentuale plastica: " + str(percentPlastica))
    
    return jsonify(status="bin mis sent")

@app.route('/latestbins')
def latest_bins():
    data = read_data(TMP_BIN_DATA, BIN_TYPE)
    latest_data = {
        "carta": data["carta"][-1] if data["carta"] else 0,
        "plastica": data["plastica"][-1] if data["plastica"] else 0
    }
    response = jsonify(latest_data)
    response.headers['Cache-Control'] = 'no-store'
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
