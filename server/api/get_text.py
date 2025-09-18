from flask import request
from flask_restx import Resource, Namespace, reqparse
import fitz

# File이라는 이름의 api 요청 추가
file_api = Namespace('File', description='파일 업로드')

# 파일을 request parameter로 설정 -> 요청 시 파일을 추가해야 함
upload_parser = reqparse.RequestParser()
upload_parser.add_argument('file', location='files', type='FileStorage', required=True)

@file_api.route('/upload')
@file_api.expect(upload_parser)
class FilePost(Resource):
  def post(self):
    # file 파라미터를 가져옴
    uploaded_file = request.files.get('file')
    
    # 업로드된 파일이 없다면 에러처리
    if not uploaded_file:
      return {'error': 'No file uploaded'}, 400
    # 업로드된 파일이 pdf가 아니라면 에러처리
    if uploaded_file.mimetype != 'application/pdf':
      return {'error': 'PDF 파일만 업로드 가능합니다.'}, 400
    
    try:
      res = uploaded_file.read() # 파일을 바이트 그대로 읽어옴
      # 파일 제목을 반환하기 위해 .pdf 앞부분만 잘라냄
      filename = uploaded_file.filename.split('.pdf')[0]
      doc = fitz.open(stream=res, filetype='pdf') # stream에서 바이트를 읽음
    
      # 반환할 텍스트를 담기 위해 text 변수 선언
      text = ""
    
      # 각 페이지에서 text 추출
      for i in range(len(doc)):
        page = doc[i]
        text += page.get_text()
      
      data = {'filename': filename, 'extracted_text': text}
      
      # 파일 이름과 추출된 텍스트를 json 형식으로 반환
      return data, 200
    
    # 예외발생 시 에러처리
    except Exception as e:
      return {'error': str(e)}, 500
    
    
    