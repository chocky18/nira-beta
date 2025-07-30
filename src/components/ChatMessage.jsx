import { GrokIcon } from './GrokIcon';
import './ChatMessage.css';

export const ChatMessage = ({ message, isUser, timestamp }) => {
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'ai-message'}`}>
      {!isUser && (
        <div className="message-avatar">
          <GrokIcon />
        </div>
      )}
      
      <div className="message-content">
        <div className="message-text">
          {message}
        </div>
        {timestamp && (
          <div className="message-timestamp">
            {timestamp.toLocaleTimeString()}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="user-avatar">
          U
        </div>
      )}
    </div>
  );
};