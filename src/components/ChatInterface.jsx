import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { FeatureButton } from "./FeatureButton";
import { GrokIcon } from "./GrokIcon";
import { Send, Zap, ImagePlus, Search, Edit, Newspaper, Users } from "lucide-react";
import './ChatInterface.css';

export const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (title, description) => {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-title">${title}</div>
      <div class="toast-description">${description}</div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm a demo chatbot inspired by Grok! I can help you with various tasks like answering questions, creating content, and more. What would you like to explore?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleFeatureClick = (feature) => {
    showToast(feature, `${feature} feature clicked! This is a demo interface.`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-interface">
      {/* Header */}
      <header className="chat-header">
        <div className="header-logo">
          <GrokIcon />
        </div>
        <div className="header-buttons">
          <button className="header-btn secondary">Sign up</button>
          <button className="header-btn primary">Sign in</button>
        </div>
      </header>

      {/* Main Content */}
      <div className="chat-main">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="welcome-screen">
            <div className="welcome-header">
              <GrokIcon className="large" />
              <h1 className="welcome-title">Grok</h1>
            </div>

            <div className="welcome-content">
              <div className="input-container">
                <input
                  type="text"
                  placeholder="What do you want to know?"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="main-input"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="send-button"
                >
                  <Send size={16} />
                </button>
              </div>

              {/* Feature Buttons */}
              <div className="feature-buttons">
                <FeatureButton
                  icon={Zap}
                  label="Fast"
                  onClick={() => handleFeatureClick("Fast")}
                />
                <FeatureButton
                  icon={ImagePlus}
                  label="Create Images"
                  onClick={() => handleFeatureClick("Create Images")}
                />
                <FeatureButton
                  icon={Search}
                  label="Research"
                  onClick={() => handleFeatureClick("Research")}
                />
                <FeatureButton
                  icon={Edit}
                  label="Edit Image"
                  onClick={() => handleFeatureClick("Edit Image")}
                />
                <FeatureButton
                  icon={Newspaper}
                  label="Latest News"
                  onClick={() => handleFeatureClick("Latest News")}
                />
                <FeatureButton
                  icon={Users}
                  label="Personas"
                  onClick={() => handleFeatureClick("Personas")}
                />
              </div>
            </div>

            <p className="welcome-footer">
              By messaging Grok, you agree to our{" "}
              <span className="link">Terms</span> and{" "}
              <span className="link">Privacy Policy</span>.
            </p>
          </div>
        ) : (
          /* Chat Messages */
          <div className="chat-container">
            <div className="messages-container">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <div className="loading-message">
                  <GrokIcon className="loading-icon" />
                  <div className="loading-text">Thinking...</div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="chat-input-container">
              <div className="chat-input-wrapper">
                <input
                  type="text"
                  placeholder="Ask Grok anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="chat-input"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="send-button small"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};