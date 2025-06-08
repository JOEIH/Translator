from flask import request
from flask_restx import Resource, Namespace, reqparse
from openai import OpenAI
from dotenv import load_dotenv
import json
import os

load_dotenv()

translate_api = Namespace('Translate', description='선택된 텍스트 번역')
OpenAI.api_key = os.getenv('OPENAI_API_KEY')


upload_parser = reqparse.RequestParser()
upload_parser.add_argument('text', required=True)

@translate_api.route('api/translate')
@translate_api.expect(upload_parser)
class PostAndGetResult(Resource):
  def get(self):
    selectedText = request.args.get('text')
    
    if not selectedText:
      return {'error': f'{selectedText}'}, 400
    
    try: 
      if selectedText:
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
              '5. 번역 결과를 확인하고, 번역된 문장이 입력된 문장과 동일할 경우 1번 다시 번역해야 함.\n'
              '6. 위 조건에 따라 번역 결과는 두 개 이상이어야 함.'
              )}
          ],
          functions=[{
            "name": "result",
            "description": "translation results",
            "parameters": {
              "type": "object",
              "properties": {
                "detected_language": {
                  "type": "string",
                  "description": "The language that was detected from the query"
                },
                "translations": {
                  "type": "array",
                  "description": "List of translations in other languages",
                  "items": {
                    "type": "object",
                    "properties": {
                      "language": {
                        "type": "string",
                        "description": "The language of the translation",
                        "enum": ["한국어", "영어", "일본어"]
                      },
                      "text": {
                        "type": "string",
                        "description": "The translated text"
                      }
                    },
                    "required": ["language", "text"]
                  }
                },
              }
            }
          }],
          function_call={"name":"result"},
          temperature=0
        )
        
        translated_result = json.loads(response.choices[0].message.function_call.arguments)
        
        return {"result": translated_result}, 200
      
    except Exception as e:
      return {'error': str(e)}, 500