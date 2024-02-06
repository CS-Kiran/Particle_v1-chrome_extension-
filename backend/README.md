# Web Scraping and Summarization API with Flask

This Flask application provides a simple API for web scraping and summarizing textual content from web pages.

## Overview

The application utilizes Flask, BeautifulSoup, transformers library, and Flask-CORS for handling cross-origin requests. It exposes an endpoint `/scrape` that accepts POST requests with a JSON payload containing a URL to scrape and summarize.

## Features

- Web scraping of text content from web pages using BeautifulSoup.
- Text summarization using the transformers library.
- Cross-Origin Resource Sharing (CORS) support using Flask-CORS.
- Error handling for invalid URLs and internal server errors.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your_username/your_repository.git
    cd your_repository
    ```

2. Install the required Python packages:

    ```bash
    pip install -r requirements.txt
    ```

3. Run the Flask application:

    ```bash
    python app.py
    ```

The application will start running on `http://localhost:5000`.

## API Usage

### `POST /scrape`

#### Request Payload

```json
{
    "url": "https://example.com"
}
