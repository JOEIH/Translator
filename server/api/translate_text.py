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
string_parser = reqparse.RequestParser()
string_parser.add_argument('text', required=True)

@translate_api.route('/translate')
@translate_api.expect(string_parser)
class PostAndGetResult(Resource):
  def get(self):
    # 선택된 텍스트
    selectedText = request.args.get('text')
    # selectedLang = request.args.get('lang')
    
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
            {'role' : 'user', 'content': f'번역하려는 문장: {selectedText}'},
            {'role' : 'user', 'content': (
              '번역하려는 문장의 언어를 확실히 파악한 후 아래와 같은 조건을 지켜서 번역해줘.\n' 
              '1. 입력된 텍스트가 한국어일 경우 영어와 일본어로 번역.\n' 
              '2. 입력된 텍스트가 영어일 경우 한국어와 일본어로 번역.\n' 
              '3. 입력된 텍스트가 일본어일 경우 영어와 한국어로 번역.\n' 
              '4. 입력된 텍스트가 한국어, 영어, 일본어를 제외한 언어인 경우 한국어, 영어, 일본어 모두로 번역.\n'
              '5. 번역 결과를 확인하고, 번역된 문장이 입력된 문장과 동일할 경우 다시 번역해야 함.\n'
              '6. 위 조건에 따라 번역 결과는 두 개 이상이어야 함.'
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
                  # 번역 결과는 두 가지 이상이므로 배열로 반환
                  "type": "array",
                  "description": "List of translations in other languages",
                  "items": {
                    "type": "object",
                    "properties": {
                      # 번역 결과의 type에 들어갈 언어는 한국어, 영어, 일본어로 한정
                      "language": {
                        "type": "string",
                        "description": "The language of the translation",
                        "enum": ["한국어", "영어", "일본어"]
                      },
                      # 번역된 문장
                      "text": {
                        "type": "string",
                        "description": "The translated text"
                      }
                    },
                    # language와 text는 호출 시 반드시 포함되어야 함
                    "required": ["language", "text"]
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