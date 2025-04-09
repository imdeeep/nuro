import React, { useState } from "react";
import "./App.css";
import { enhancePrompt, copyToClipboard } from "./chromeutils";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [refinedPrompt, setRefinedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to enhance.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const enhanced = await enhancePrompt(prompt);
      setRefinedPrompt(enhanced);
    } catch (error) {
      setError("Failed to enhance prompt. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!refinedPrompt) return;
    
    const success = await copyToClipboard(refinedPrompt);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      setError("Failed to copy to clipboard.");
      setTimeout(() => setError(null), 3000);
    }
  };
  const formatRefinedPrompt = (text) => {
    if (!text) return "";
    
    return text
      .replace(/^--*$\n/gm, "")
      .trim();
  };

  return (
    <div className="nuro-container">
      <header className="nuro-header">
        <div className="logo-wrapper">
          <div className="title-container">
            <h1 className="logo">Nuro</h1>
            <span className="tagline">Think better. Write smarter.</span>
          </div>
        </div>
      </header>

      <main className="nuro-main">
        {error && (
          <div className="error-alert">
            {error}
            <button className="close-alert" onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="input-section">
          <label htmlFor="prompt-input">
            Your prompt
          </label>
          <textarea
            id="prompt-input"
            className="prompt-textarea"
            placeholder="Enter your raw ideas here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          
          <button 
            className="enhance-button" 
            onClick={handleSubmit}
            disabled={!prompt.trim() || isLoading}
          >
            {isLoading ? (
              <span className="loader">
                <span className="loader-dot"></span>
                <span className="loader-dot"></span>
                <span className="loader-dot"></span>
              </span>
            ) : (
              <span>Enhance</span>
            )}
          </button>
        </div>

        {refinedPrompt && (
          <div className="output-section">
            <div className="output-header">
              <h3 className="output-title">Refined Prompt</h3>
              <button 
                className="copy-button" 
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                {isCopied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="refined-output">
              {formatRefinedPrompt(refinedPrompt)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;