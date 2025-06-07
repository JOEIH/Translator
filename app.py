from flask import Flask, render_template
from flask_restx import Api
from flask_cors import CORS
from api.get_text import file_api
from api.translate_text import translate_api

app = Flask(__name__)
api = Api(app, version='1.0', title='Translator API', description='Translator with Swagger')
CORS(app)

api.add_namespace(file_api, path='/')
api.add_namespace(translate_api, path='/')

@app.route('/home')
def home():
  return render_template('index.html')

@app.route('/text')
def text():
  return render_template('pdfResult.html')

if __name__ == "__main__":
  app.run(debug=True, port=6001)