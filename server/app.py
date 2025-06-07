from flask import Flask, send_from_directory
from flask_restx import Api
from flask_cors import CORS
from api.get_text import file_api
from api.translate_text import translate_api

app = Flask(__name__, static_folder='../client/dist', static_url_path='')
api = Api(app, version='1.0', title='Translator API', description='Translator with Swagger')
CORS(app)

api.add_namespace(file_api, path='/')
api.add_namespace(translate_api, path='/')  

# 홈 화면 렌더링
@app.route('/home')
def home():
  return send_from_directory(app.static_folder, 'index.html')

# 텍스트 추출 결과 보여주는 화면 렌더링
@app.route('/text')
def text():
  return send_from_directory(app.static_folder, 'pdfResult.html')

if __name__ == "__main__":
  app.run(debug=True, port=6001)