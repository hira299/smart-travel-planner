import os
import json
import requests

def create_itinerary(event, context):
    try:
        print('Received event:', event)
        body = event.get('body')
        if body is None:
            body = {}
        elif isinstance(body, str):
            try:
                body = json.loads(body)
            except Exception as e:
                print('JSON decode error:', e)
                return {
                    'statusCode': 400,
                    'body': json.dumps({'error': f'Invalid JSON in request body: {e}'})
                }
        elif not isinstance(body, dict):
            print('Unexpected body type:', type(body))
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Request body must be a JSON object.'})
            }
        print('Parsed body:', body)
        destination = body.get('destination', 'a surprise destination')
        dates = body.get('dates', 'some dates')
        budget = body.get('budget', 'any budget')
        travel_style = body.get('travelStyle', 'any style')

        prompt = (
            f"Create a detailed travel itinerary for a trip to {destination} "
            f"from {dates} with a budget of {budget} and a travel style of {travel_style}. "
            f"Format the itinerary as follows: For multi-day trips, use clear headings like 'Day 1:', 'Day 2:', etc., and list each day's activities as plain bullet points. Do NOT use asterisks (*) for bullets—use '-' or just plain lines if needed. Do not use any markdown, asterisks, or extra formatting. For single-day trips, use the heading 'Your Trip Plan:' instead of 'Day 1:'. Make the output easy to read and visually clean."
        )
        print('Prompt:', prompt)
        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={os.environ['GEMINI_API_KEY']}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        }
        response = requests.post(
            api_url,
            headers={'Content-Type': 'application/json'},
            json=payload
        )
        print('Gemini API status:', response.status_code)
        print('Gemini API response:', response.text)
        if response.status_code != 200:
            return {
                'statusCode': 500,
                'body': response.text
            }
        gemini_response = response.json()
        text = gemini_response['candidates'][0]['content']['parts'][0]['text']
        return {
            'statusCode': 200,
            'body': json.dumps({'result': text})
        }
    except Exception as e:
        import traceback
        print('Exception:', e)
        print(traceback.format_exc())
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e), 'trace': traceback.format_exc()})
        } 