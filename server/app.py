from flask import Flask, send_from_directory, request, jsonify
from flask_restx import Api
from flask_cors import CORS
from api.get_text import file_api
from api.translate_text import translate_api
from dotenv import load_dotenv
import os

load_dotenv()
siteUrl = 'https://stt-translator.netlify.app'
localSiteUrl = os.getenv('LOCAL_URL')

origins = [siteUrl, localSiteUrl]

app = Flask(__name__)

api = Api(app, version='1.0', title='Translator API', description='Translator with Swagger')
CORS(app, resources={r"/api/*": {"origins": origins}})

api.add_namespace(file_api, path='/api')
api.add_namespace(translate_api, path='/api')  

@app.route('/home')
def home():
  return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
  app.run(debug=True, port=6001)