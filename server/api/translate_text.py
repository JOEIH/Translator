from flask import request
from flask_restx import Resource, Namespace, reqparse # api 요청을 위해 import
from openai import OpenAI
from dotenv import load_dotenv
import json
import os

# swagger에 'Translate'라는 이름의 api 요청을 추가하기 위해 작성
translate_api = Namespace('Translate', description='선택된 텍스트 번역')

# 환경변수파일(.env)에 작성한 openai API KEY를 불러오기 위해 dotenv 사용
load_dotenv()
OpenAI.api_key = os.getenv('OPENAI_API_KEY') 

# text를 request parameter로 추가
parser = reqparse.RequestParser()
parser.add_argument('text', required=True)
parser.add_argument('lang', required=True)

@translate_api.route('/translate')
@translate_api.expect(parser)
class PostAndGetResult(Resource):
  def get(self):
    # 선택된 텍스트
    selectedText = request.args.get('text')
    selectedLang = request.args.get('lang')
    
    # 선택된 텍스트가 없을 경우 에러 전송
    if not selectedText:
      return {'error': f'{selectedText}'}, 400
    
    try: 
      # 선택된 텍스트가 있으면 다음 작업 수행
      if selectedText:
        # openai 응답 설정
        response = OpenAI().chat.completions.create(
          model='gpt-3.5-turbo',
          messages=[
            {'role' : 'system', 'content': '너는 입력된 문장을 정확하게 번역해주는 챗봇이야.'},
            {'role' : 'user', 'content': f'입력된 문장: {selectedText}'},
            {'role' : 'user', 'content': f'번역할 언어: {selectedLang}'},
            {'role' : 'user', 'content': (
              '입력된 문장을 번역할 언어에 따라 번역해줘.\n ' 
              '입력된 문장을 번역할 언어에 입력된 모든 언어로 번역해야 해.'
              )}
          ],
          # JSON 반환 형식 지정
          functions=[{
            "name": "result",
            "description": "translation results",
            "parameters": {
              "type": "object",
              "properties": {
                # 감지된 텍스트의 언어 반환
                "detected_language": { 
                  "type": "string",
                  "description": "The language that was detected from the query"
                },
                # 번역 결과 반환
                "translations": {
                  # 번역 결과는 한 가지 이상이므로 배열로 반환
                  "type": "array",
                  "description": "List of translations in other languages",
                  "items": {
                    "type": "object",
                    "properties": {
                      # 번역 결과의 type에 들어갈 언어는 selectedLang으로 한정
                      "lang": {
                        "type": "string",
                        "description": "The language of the translation",
                        "enum": selectedLang.split(',')
                      },
                      # 번역된 문장
                      "text": {
                        "type": "string",
                        "description": "The translated text"
                      }
                    },
                    # language와 text는 호출 시 반드시 포함되어야 함
                    "required": ["lang", "text"]
                  }
                },
              }
            }
          }],
          function_call={"name":"result"}, # 위에서 정의한 함수를 호출하도록 설정
        )
        
        # 문자열로 되어 있는 결과를 dictionary로 변경하기 위해 json.loads 사용
        translated_result = json.loads(response.choices[0].message.function_call.arguments)
        
        return {"result": translated_result}, 200
      
    # 예기치 못한 예외 발생 시 에러처리
    except Exception as e:
      return {'error': str(e)}, 500