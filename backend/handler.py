import os
import json
import requests

def create_itinerary(event, context):
    try:
        # Log only essential info, not sensitive data
        print('Request received from:', event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown'))
        
        body = event.get('body')
        if body is None:
            body = {}
        elif isinstance(body, str):
            try:
                body = json.loads(body)
            except Exception as e:
                print('JSON decode error')
                return {
                    'statusCode': 400,
                    'body': json.dumps({'error': 'Invalid JSON in request body'})
                }
        elif not isinstance(body, dict):
            print('Unexpected body type')
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Request body must be a JSON object'})
            }
        destination = body.get('destination', 'a surprise destination')
        dates = body.get('dates', 'some dates')
        budget = body.get('budget', 'any budget')
        travel_style = body.get('travelStyle', 'any style')

        prompt = (
            f"Create a detailed travel itinerary for a trip to {destination} "
            f"from {dates} with a budget of {budget} and a travel style of {travel_style}. "
            f"Format the itinerary as follows: For multi-day trips, use clear headings like 'Day 1:', 'Day 2:', etc., and list each day's activities as plain bullet points. Do NOT use asterisks (*) for bullets—use '-' or just plain lines if needed. Do not use any markdown, asterisks, or extra formatting. For single-day trips, use the heading 'Your Trip Plan:' instead of 'Day 1:'. Make the output easy to read and visually clean."
        )
        # Validate and sanitize input
        if not destination or len(destination.strip()) == 0:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Destination is required'})
            }
        
        # Sanitize input to prevent prompt injection
        destination = destination.strip()[:100]  # Limit length
        dates = dates.strip()[:50] if dates else 'some dates'
        budget = budget.strip()[:50] if budget else 'any budget'
        travel_style = travel_style.strip()[:50] if travel_style else 'any style'
        
        prompt = (
            f"Create a detailed travel itinerary for a trip to {destination} "
            f"from {dates} with a budget of {budget} and a travel style of {travel_style}. "
            f"Format the itinerary as follows: For multi-day trips, use clear headings like 'Day 1:', 'Day 2:', etc., and list each day's activities as plain bullet points. Do NOT use asterisks (*) for bullets—use '-' or just plain lines if needed. Do not use any markdown, asterisks, or extra formatting. For single-day trips, use the heading 'Your Trip Plan:' instead of 'Day 1:'. Make the output easy to read and visually clean."
        )
        
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
        print('Exception occurred')
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error'})
        } 