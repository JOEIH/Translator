from flask import Flask, send_from_directory
from flask_restx import Api
from flask_cors import CORS
from api.get_text import file_api
from api.translate_text import translate_api

# 화면 렌더링 위해 client 폴더에서 사용할 파일의 경로 지정
app = Flask(__name__, static_folder='../client/dist', static_url_path='')

# flask_restx가 자동생성하는 swagger 문서를 사용하기 위해 설정
api = Api(app, version='1.0', title='Translator API', description='Translator with Swagger')
CORS(app)

# 설정한 api요청의 앞에 /api를 추가 -> /translate로 지정했다면 최종 요청 주소는 /api/translate가 됨
api.add_namespace(file_api, path='/api')
api.add_namespace(translate_api, path='/api')  

# 홈 화면 렌더링
@app.route('/home')
def home():
  return send_from_directory(app.static_folder, 'index.html')

# 텍스트 추출 결과 보여주는 화면 렌더링
@app.route('/text')
def text():
  return send_from_directory(app.static_folder, 'pdfResult.html')

# 6001포트에서 실행
if __name__ == "__main__":
  app.run(debug=True, port=6001)