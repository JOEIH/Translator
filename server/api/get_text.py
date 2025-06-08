from flask import request, jsonify
from flask_restx import Resource, Namespace, reqparse
from PyPDF2 import PdfReader

file_api = Namespace('File', description='파일 업로드')

upload_parser = reqparse.RequestParser()
upload_parser.add_argument('file', location='files', type='FileStorage', required=True)

@file_api.route('api/upload')
@file_api.expect(upload_parser)
class FilePost(Resource):
  def post(self):
    uploaded_file = request.files.get('file')
    
    if not uploaded_file:
      return {'error': 'No file uploaded'}, 400
    
    try:
      filename = uploaded_file.filename.split('.pdf')[0]
      reader = PdfReader(uploaded_file)
      pages = reader.pages
    
      text = ""
    
      for page in pages:
        text += page.extract_text()
     
      data = {'filename': filename, 'extracted_text': text}
      
      return data, 200
    
    except Exception as e:
      return {'error': str(e)}, 500
    
    
    