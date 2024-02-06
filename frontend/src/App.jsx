import { useState } from 'react';
import particleLogo from './assets/short.png';
import shortVideo from './assets/short.mp4';
import './App.css';

function App() {
    const [cleanedText, setCleanedText] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showDescription, setShowDescription] = useState(false);

    const sendUrlToBackend = async () => {
        try {
            setShowDescription(false);
            setLoading(true);

            chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                const activeTab = tabs[0];
                const tabUrl = activeTab.url;

                const response = await fetch('http://127.0.0.1:5000/scrape', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: tabUrl }),
                });

                if (!response.ok) {
                    console.error('Failed to fetch data from backend.');
                    return;
                }

                const data = await response.json();
                const cleanedSummary = data.cleaned_text
                    .replace(/<pad>|<s>|<\/s>/g, '')
                    .trim();
                const capitalizedText = cleanedSummary.replace(/(\. )(^\w|\s\w)/g, (match) => match.toUpperCase());
                setCleanedText(capitalizedText);
    

                // Calculate word count
                const words = data.cleaned_text.split(/\s+/).filter(word => word !== '');
                setWordCount(words.length);

                setLoading(false);
            });
        } catch (error) {
            console.error('Error sending URL to backend:', error);
            setLoading(false);
        }
    };

    return (
        <>
            <div className="banner">
                <video className="banner-video" autoPlay loop muted>
                    <source src={shortVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="header">
                    <a onClick={() => setShowDescription(!showDescription)}>
                        <img src={particleLogo} className="logo" alt="pARTICLE logo" />
                    </a>
                    <h1>pARTICLE</h1>
                </div>
            </div>
            {/* Conditionally render the description based on the showDescription state */}
            {showDescription && (
                <div className="description">
                    <p >
                        <b>pARTICLE</b> is a browser extension designed to summarize web pages quickly and efficiently.
                        With advanced natural language processing, it condenses lengthy content into concise summaries
                        at the click of a button. Features include customization options, seamless integration, and
                        enhanced productivity. Join the pARTICLE community and streamline your online reading experience
                        today!
                        <h3>Developed By : [Kiran]</h3>
                    </p>
                </div>
            )}
            <div className="card">
                <div className="loader-container">
                    {loading && <div className="loader"></div>}
                </div>
                {!loading && !showDescription && !cleanedText && (
                    <button onClick={sendUrlToBackend} disabled={loading}>
                        Partify
                    </button>
                )}
                {!showDescription && cleanedText && !loading && (
                    <div className="cleaned-text">
                        <p>{cleanedText}</p>
                        <code><b>Word Count: {wordCount}</b></code>
                    </div>
                )}
            </div>
        </>
    );
}

export default App;
