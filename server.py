from flask import Flask, request, jsonify, redirect, url_for, send_from_directory, session, render_template
from flask_cors import CORS
from flask_session import Session
import json
import os
import datetime
import time
import schedule

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
BLANK_FILE = 'blankfile'
TMP_BIN_DATA = 'tmp_bin_data.json'
PERM_BIN_DATA_TOTAL = 'perm_bin_data_total.json'
PERM_BIN_DATA_WEEK = 'perm_bin_data_week.json'
TMP_AIR_DATA = 'tmp_air_data.json'
PERM_AIR_DATA = 'perm_air_data.json'
# data types
AIR_TYPE = {"MQ2": [], "MQ7": []}
BIN_TYPE = {"carta": [], "plastica": []}

def reset_weekly_measurements():
    if os.path.exists(PERM_BIN_DATA_WEEK):
        blank_data = {
            "carta": [0, 0, 0, 0, 0, 0, 0, 0],
            "plastica": [0, 0, 0, 0, 0, 0, 0, 0]
        }
        with open(PERM_BIN_DATA_WEEK, 'w') as file:
            json.dump(blank_data, file)
        print("Weekly measurements reset at:", datetime.now())
    else:
        template = read_data(BLANK_FILE, BIN_TYPE)
        write_data(template, PERM_BIN_DATA_WEEK)

# Schedule the reset task at midnight on Mondays
schedule.every().monday.at("00:00").do(reset_weekly_measurements)


def reset_monthly_measurements():
    blank_data = {
        "carta": [0] * 31,
        "plastica": [0] * 31
    }
    with open(PERM_BIN_DATA_MONTH, 'w') as file:
        json.dump(blank_data, file)
    print("Monthly measurements reset at:", datetime.datetime.now())

def reset_yearly_measurements():
    blank_data = {
        "carta": [0] * 12,
        "plastica": [0] * 12
    }
    with open(PERM_BIN_DATA_YEAR, 'w') as file:
        json.dump(blank_data, file)
    print("Yearly measurements reset at:", datetime.datetime.now())

def check_and_reset():
    now = datetime.datetime.now()
    if now.day == 1 and now.hour == 0:
        reset_monthly_measurements()
    if now.month == 1 and now.day == 1 and now.hour == 0:
        reset_yearly_measurements()

# Schedule the check_and_reset function to run every day at midnight
schedule.every().day.at("00:00").do(check_and_reset)
    

# Function to keep the scheduler running
def run_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(1)

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

def is_json_file_empty(file_path):
    # Check if the file exists and has a size greater than 0
    if os.path.isfile(file_path) and os.path.getsize(file_path) > 0:
        with open(file_path, 'r') as file:
            try:
                data = json.load(file)
                # Check if the data is an empty dictionary or an empty list
                if data == {} or data == []:
                    return True
                else:
                    return False
            except json.JSONDecodeError:
                # If there's an error decoding JSON, consider it as not empty
                return False
    else:
        return True
    
def update_week_data(percentCarta, percentPlastica, temp_data, now, file_path):
    perm_weekdata = read_data(file_path, BIN_TYPE)
    if not os.path.exists(file_path) or is_json_file_empty(file_path):
        perm_weekdata = {"carta": [0]*7, "plastica": [0]*7}
    emptyDiffCarta = abs(percentCarta - temp_data["carta"][-2])
    emptyDiffPlastica = abs(percentPlastica - temp_data["plastica"][-2])
    if emptyDiffCarta >= 10:
        perm_weekdata["carta"][now.weekday()] += emptyDiffCarta
    if emptyDiffPlastica >= 10:
        perm_weekdata["plastica"][now.weekday()] += emptyDiffPlastica
    write_data(perm_weekdata, file_path)

def update_month_data(percentCarta, percentPlastica, temp_data, now, file_path):
    perm_monthdata = read_data(file_path, BIN_TYPE)
    if not os.path.exists(file_path) or is_json_file_empty(file_path):
        perm_monthdata = {"carta": [0]*31, "plastica": [0]*31}
    emptyDiffCarta = abs(percentCarta - temp_data["carta"][-2])
    emptyDiffPlastica = abs(percentPlastica - temp_data["plastica"][-2])
    if emptyDiffCarta >= 10:
        perm_monthdata["carta"][now.day-1] += emptyDiffCarta
    if emptyDiffPlastica >= 10:
        perm_monthdata["plastica"][now.day-1] += emptyDiffPlastica
    write_data(perm_monthdata, file_path)

def update_year_data(percentCarta, percentPlastica, temp_data, now, file_path):
    perm_yeardata = read_data(file_path, BIN_TYPE)
    if not os.path.exists(file_path) or is_json_file_empty(file_path):
        perm_yeardata = {"carta": [0]*12, "plastica": [0]*12}
    emptyDiffCarta = abs(percentCarta - temp_data["carta"][-2])
    emptyDiffPlastica = abs(percentPlastica - temp_data["plastica"][-2])
    if emptyDiffCarta >= 10:
        perm_yeardata["carta"][now.month-1] += emptyDiffCarta
    if emptyDiffPlastica >= 10:
        perm_yeardata["plastica"][now.month-1] += emptyDiffPlastica
    write_data(perm_yeardata, file_path)
    
@app.route('/sendbin')
def getBin():
    misCarta = int(request.args.get("miscarta", 0))
    misPlastica = int(request.args.get("misplastica", 0))
    percentCarta = convertBinData(misCarta, BIDONE_CARTA)
    percentPlastica = convertBinData(misPlastica, BIDONE_PLASTICA)

    temp_data = read_data(TMP_BIN_DATA, BIN_TYPE)
    now = datetime.datetime.now()
    
    # Update temp data
    temp_data["carta"].append(percentCarta)
    if len(temp_data["carta"]) > 10:
        temp_data["carta"].pop(0)
    temp_data["plastica"].append(percentPlastica)
    if len(temp_data["plastica"]) > 10:
        temp_data["plastica"].pop(0)
    write_data(temp_data, TMP_BIN_DATA)

    # Update permanent total data
    update_perm_data(percentCarta, percentPlastica, temp_data, PERM_BIN_DATA_TOTAL)

    # Update weekly data
    update_week_data(percentCarta, percentPlastica, temp_data, now, PERM_BIN_DATA_WEEK)

    # Update monthly data
    update_month_data(percentCarta, percentPlastica, temp_data, now, PERM_BIN_DATA_MONTH)

    # Update yearly data
    update_year_data(percentCarta, percentPlastica, temp_data, now, PERM_BIN_DATA_YEAR)

    print(f"Distanza carta: {misCarta}, plastica: {misPlastica}")
    print(f"Percentuale carta: {percentCarta}, plastica: {percentPlastica}")
    return jsonify(status="bin mis sent")

@app.route('/latestbins')
def latest_bins():
    data = read_data(TMP_BIN_DATA, BIN_TYPE)
    latest_data = {
        "carta": data["carta"][-1] if data["carta"] else 0,
        "plastica": data["plastica"][-1] if data["plastica"] else 0,
    }
    response = jsonify(latest_data)
    response.headers['Cache-Control'] = 'no-store'
    return response

@app.route('/weekbins')
def week_bins():
    data = read_data(PERM_BIN_DATA_WEEK, BIN_TYPE)
    response = jsonify(data)
    response.headers['Cache-Control'] = 'no-store'
    return response

@app.route('/latestco2')
def latest_co2():
    data = read_data(PERM_AIR_DATA, AIR_TYPE)
    latest_data = {
        "MQ7": data["MQ7"][len(data["MQ7"]) - 1] if data["MQ7"] else 0,
    }
    response = jsonify(latest_data)
    response.headers['Cache-Control'] = 'no-store'
    return response

@app.route('/latestairquality')
def latest_airquality():
    data = read_data(PERM_AIR_DATA, AIR_TYPE)
    latest_data = {
        "MQ2": data["MQ2"][len(data["MQ2"]) - 1] if data["MQ2"] else 0,
    }
    response = jsonify(latest_data)
    response.headers['Cache-Control'] = 'no-store'
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    run_scheduler()
