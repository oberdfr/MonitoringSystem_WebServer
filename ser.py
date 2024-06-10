from flask import Flask, request, jsonify, redirect, url_for, send_from_directory, session
from flask_cors import CORS
from flask_session import Session
import os

app = Flask(__name__)
CORS(app)

# Secret key for sessions
app.secret_key = 'your_secret_key'

# Session configuration
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# Hardcoded credentials
USERNAME = "admin"
PASSWORD = "admin"

# Base path for HTML and static files
BASE_DIR = os.getcwd()
HTML_DIR = BASE_DIR
STATIC_DIR = os.path.join(BASE_DIR, 'static')

@app.route("/")
def index():
    return send_from_directory(HTML_DIR, 'login.html')  # Default page for login

@app.route("/posso")
def posso():
    user = request.args.get("user")
    pwd = request.args.get("pwd")

    if user == USERNAME and pwd == PASSWORD:
        session['logged_in'] = True
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
    if session.get('logged_in'):
        return send_from_directory(HTML_DIR, 'dashboard.html')
    else:
        return redirect(url_for('error'))

@app.route("/<page>.html")
def render_page(page):
    if session.get('logged_in'):
        return send_from_directory(HTML_DIR, f'{page}.html')
    else:
        return redirect(url_for('error'))

@app.route("/static/<path:path>")
def send_static(path):
    if session.get('logged_in'):
        return send_from_directory(STATIC_DIR, path)
    else:
        return redirect(url_for('error'))

@app.route("/error")
def error():
    return send_from_directory(HTML_DIR, 'error.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
