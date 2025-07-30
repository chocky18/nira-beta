import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPaperclip, FaArrowUp, FaRedo } from "react-icons/fa";
import "./ChatInterface.css";

const ChatInterface = () => {
  const [stage, setStage] = useState("quiz"); // quiz | chat
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState([]);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizImages, setQuizImages] = useState([]);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [chat, setChat] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [response, setResponse] = useState("");
  const [steps, setSteps] = useState([]);
  const [userId, setUserId] = useState("u001");

  const responseRef = useRef(null);

  useEffect(() => {
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [chat, metrics, response]);

  const resetAll = () => {
    setStage("quiz");
    setUserId("u" + Date.now());
    setQuizQuestion("");
    setQuizOptions([]);
    setQuizAnswer("");
    setQuizImages([]);
    setMessage("");
    setImage(null);
    setPreviewURL(null);
    setChat([]);
    setMetrics({});
    setResponse("");
    setSteps([]);
    fetchQuiz();
  };

  const fetchQuiz = async (answer = null) => {
    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      if (answer) formData.append("message", answer);

      const res = await axios.post("https://nira-ai-chat.duckdns.org/chat", formData);

      if (res.data.quiz_completed) {
        setStage("chat");
        setResponse(res.data.response || "");
        setMetrics(res.data.metrics || {});
        setSteps(res.data.steps || []);
        setQuizImages(res.data.images_from_quiz || []);
      } else {
        setQuizQuestion(res.data.current_question || res.data.response);
        setQuizOptions(res.data.options || []);
        setQuizImages(res.data.images_from_quiz || []);
      }
    } catch (error) {
      console.error("Quiz error:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewURL(reader.result);
    reader.readAsDataURL(file);
  };

  const sendMessage = async () => {
    if (!message && !image) return;

    setChat((prev) => [...prev, { sender: "user", text: message, image: previewURL }]);

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("message", message);
    if (image) formData.append("image_file", image);

    try {
      const res = await axios.post("https://nira-ai-chat.duckdns.org/chat", formData);
      setChat((prev) => [...prev, { sender: "ai", text: res.data.response }]);
      setMetrics(res.data.metrics || {});
      setSteps(res.data.steps || []);
      setResponse(res.data.response || "");
    } catch {
      setChat((prev) => [...prev, { sender: "ai", text: "❌ Error connecting to backend." }]);
    }

    setMessage("");
    setImage(null);
    setPreviewURL(null);
  };

  return (
    <div className="chat-wrapper">
      {stage === "quiz" ? (
        <div className="quiz-card">
          <h2>❓ {quizQuestion}</h2>
          <div className="quiz-options">
            {quizOptions.length > 0 ? (
              quizOptions.map((opt, idx) => (
                <button key={idx} className="pill-button" onClick={() => fetchQuiz(opt)}>
                  {opt}
                </button>
              ))
            ) : (
              <>
                <input
                  type="text"
                  value={quizAnswer}
                  placeholder="Your answer..."
                  onChange={(e) => setQuizAnswer(e.target.value)}
                />
                <button onClick={() => fetchQuiz(quizAnswer)}>Submit</button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="chat-layout">
          {/* LEFT - Conversation */}
          <div className="chat-left">
            <div className="chat-header">
              ⚡ NIRA AI <button onClick={resetAll}><FaRedo /> Reset</button>
            </div>
            <div className="chat-area" ref={responseRef}>
              {chat.map((msg, idx) => (
                <div key={idx} className={`chat-bubble ${msg.sender}`}>
                  {msg.text}
                  {msg.image && <img src={msg.image} alt="" />}
                </div>
              ))}
            </div>
            <div className="input-bar">
              <label>
                <FaPaperclip />
                <input type="file" hidden onChange={handleImageUpload} />
              </label>
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={sendMessage}><FaArrowUp /></button>
            </div>
          </div>

          {/* RIGHT - Analytics */}
          <div className="chat-right">
            {response && (
              <div className="chat-section">
                <h3>✅ Response</h3>
                <p>{response}</p>
              </div>
            )}
            {metrics && Object.keys(metrics).length > 0 && (
              <div className="chat-section">
                <h3>🧪 Metrics</h3>
                {Object.entries(metrics).map(([region, regionMetrics]) => (
                  <div key={region}>
                    <h4>{region}</h4>
                    <ul>
                      {Object.entries(regionMetrics).map(([metric, value]) => {
                        if (typeof value === "object" && "severity" in value) {
                          return (
                            <li key={metric}>
                              {metric}:{" "}
                              <span className={`badge ${value.severity}`}>
                                {value.severity}
                              </span>
                            </li>
                          );
                        } else {
                          return <li key={metric}>{metric}: {value}</li>;
                        }
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
