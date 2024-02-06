from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) 

@app.route('/scrape', methods=['POST'])
def scrape():
    data = request.get_json()
    url = data.get('url')
    print(url)

    if not url:
        return jsonify({'error': 'URL not provided'}), 400

    try:
        response = requests.get(url)
        response.raise_for_status()
        html_content = response.text

        # Use BeautifulSoup for web scraping
        soup = BeautifulSoup(html_content, 'html.parser')

        # Extract text content from <p> tags
        p_tags = soup.find_all('p')

        # Extract text from each <p> tag
        p_texts = [p.get_text() for p in p_tags]

        # Join the extracted text
        cleaned_text = '\n'.join(p_texts)

        # You can add more processing or cleaning steps here
        text = cleaned_text
        tokenizer = AutoTokenizer.from_pretrained("t5-base")
        model = AutoModelForSeq2SeqLM.from_pretrained("t5-base")

        tokens_input = tokenizer.encode("summarizer: "+ text, return_tensors='pt', max_length=len(text), truncation=True)
        summary_ids = model.generate(tokens_input, min_length=80, max_length=400)
        summary = tokenizer.decode(summary_ids[0], skip_special_token=True)

        return jsonify({'cleaned_text': summary}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
