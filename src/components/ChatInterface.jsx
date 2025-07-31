import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatInterface.css";

export default function ChatInterface() {
  const [stage, setStage] = useState("quiz");
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState([]);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizImages, setQuizImages] = useState([]);
  const [quizError, setQuizError] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [chat, setChat] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [response, setResponse] = useState("");
  const [steps, setSteps] = useState([]);
  const [responseImages, setResponseImages] = useState({});
  const [intermediateResponses, setIntermediateResponses] = useState([]);
  const [recommendation, setRecommendation] = useState([]);
  const [userId, setUserId] = useState("u001");
  const [loadingChat, setLoadingChat] = useState(false);

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
    const newId = "u" + Date.now();
    setUserId(newId);
    setStage("quiz");
    setQuizQuestion("");
    setQuizOptions([]);
    setQuizAnswer("");
    setQuizImages([]);
    setQuizError("");
    setMessage("");
    setImage(null);
    setPreviewURL(null);
    setChat([]);
    setMetrics({});
    setResponse("");
    setSteps([]);
    setResponseImages({});
    setIntermediateResponses([]);
    setRecommendation([]);
    fetchQuiz(null, newId);
  };

  const fetchQuiz = async (answer = null, forcedUserId = null) => {
    try {
      setQuizError("");
      const formData = new FormData();
      formData.append("user_id", forcedUserId || userId);
      if (answer) formData.append("message", answer);

      const res = await axios.post("https://nira-ai-chat.duckdns.org/chat", formData);
      console.log("Quiz Response:", res.data);

      const quizDone =
        res.data.quiz_completed === true ||
        String(res.data.quiz_completed).toLowerCase() === "true" ||
        String(res.data.quiz_completed) === "1";

      if (quizDone) {
        setLoadingChat(true);
        setTimeout(() => {
          setLoadingChat(false);
          setStage("chat");
          setResponse(res.data.response || "");
          setMetrics(res.data.metrics || {});
          setSteps(res.data.steps || []);
          setIntermediateResponses(res.data.intermediate_responses || []);
          setRecommendation(res.data.recommendation || []);
          setQuizImages(res.data.images_from_quiz || []);
          setResponseImages(res.data.images || {});
        }, 2000);
      } else {
        setQuizQuestion(res.data.current_question || res.data.response || "");
        setQuizOptions(res.data.options || []);
        setQuizImages(res.data.images_from_quiz || []);
      }
    } catch (error) {
      console.error("Quiz error:", error);
      setQuizError("Unable to connect to the server. Please try again.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
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
      setIntermediateResponses(res.data.intermediate_responses || []);
      setRecommendation(res.data.recommendation || []);
      setResponseImages(res.data.images || {});
    } catch {
      setChat((prev) => [...prev, { sender: "ai", text: "❌ Error connecting to backend." }]);
    }

    setMessage("");
    setImage(null);
    setPreviewURL(null);
  };

  return (
    <div className={`chat-wrapper stage-${stage}`}>
      {loadingChat ? (
        <div className="loading-chat">
          <div className="spinner"></div>
          <p>Loading Chat UI...</p>
        </div>
      ) : stage === "quiz" ? (
        <div className="quiz-card fade-in">
          <h2>Skin Science Assessment</h2>
          <p style={{ marginBottom: "20px", color: "#6b7280", fontSize: "1rem" }}>{quizQuestion}</p>
          {quizError && (
            <div className="error-message">
              <p>{quizError}</p>
              <button className="retry-button" onClick={resetAll}>Retry Connection</button>
            </div>
          )}
          <div className="quiz-options">
            {quizOptions.length > 0 ? (
              quizOptions.map((opt, idx) => (
                <button key={idx} className="pill-button" onClick={() => fetchQuiz(opt)}>{opt}</button>
              ))
            ) : !quizError && (
              <>
                <input
                  type="text"
                  value={quizAnswer}
                  placeholder="Please type your answer here..."
                  onChange={(e) => setQuizAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && quizAnswer.trim() && fetchQuiz(quizAnswer)}
                />
                <button
                  onClick={() => quizAnswer.trim() && fetchQuiz(quizAnswer)}
                  style={{
                    background: "linear-gradient(135deg, #c084fc 0%, #a855f7 100%)",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "500",
                    marginTop: "12px"
                  }}
                >
                  Submit Answer
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="chat-layout fade-in">
          {/* LEFT PANEL */}
          <div className="chat-left">
            <div className="chat-header">
              <h1>
                <div className="logo">NS</div>
                NIRA Skin Science
              </h1>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="reset-button" onClick={resetAll}>Reset Session</button>
              </div>
            </div>
            <div className="chat-area" ref={responseRef}>
              {chat.length === 0 && (
                <div className="empty-chat">
                  <div className="logo-block">NS</div>
                  <h3>Welcome to Your Skin Analysis</h3>
                  <p>Ask me anything about your skin health, upload images for analysis, or get recommendations.</p>
                </div>
              )}
              {chat.map((msg, idx) => (
                <div key={idx} className={`chat-bubble ${msg.sender}`}>
                  {msg.text}
                  {msg.image && <img src={msg.image} alt="Uploaded" />}
                </div>
              ))}
            </div>
            <div className="input-bar">
              <label className="file-upload-label">📎
                <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
              </label>
              {previewURL && (
                <div className="preview-thumb">
                  <img src={previewURL} alt="Preview" />
                  <button onClick={() => { setImage(null); setPreviewURL(null); }}>×</button>
                </div>
              )}
              <input
                type="text"
                placeholder="Ask about your skin..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="send-button" onClick={sendMessage} disabled={!message.trim() && !image}>Send</button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="chat-right">
            {response && <div className="response-section"><h3>✅ Response</h3><p>{response}</p></div>}
            {recommendation.length > 0 && (
              <div className="response-section">
                <h3>💡 Recommendation</h3>
                <ul>{recommendation.map((rec, idx) => (<li key={idx}>{rec}</li>))}</ul>
              </div>
            )}
            {metrics && Object.keys(metrics).length > 0 && (
              <div className="response-section">
                <h3>🧪 Metrics</h3>
                {Object.entries(metrics).map(([region, regionMetrics]) => (
                  <div key={region}>
                    <h4>{region}</h4>
                    <ul>{Object.entries(regionMetrics).map(([metric, value]) => (<li key={metric}>{metric}: {JSON.stringify(value)}</li>))}</ul>
                  </div>
                ))}
              </div>
            )}
            {quizImages.length > 0 && (
              <div className="response-section">
                <h3>📚 Reference Images</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 80px)", gap: "8px" }}>
                  {quizImages.map((imgUrl, idx) => (<img key={idx} src={imgUrl} alt={`ref-${idx}`} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" }} />))}
                </div>
              </div>
            )}
            {responseImages.original && (
              <div className="response-section"><h3>📷 Original Image</h3><img src={`data:image/jpeg;base64,${responseImages.original}`} alt="Original" /></div>
            )}
            {responseImages.enhanced && (
              <div className="response-section"><h3>✨ Enhanced Image</h3><img src={`data:image/jpeg;base64,${responseImages.enhanced}`} alt="Enhanced" /></div>
            )}
            {responseImages.masks && Object.keys(responseImages.masks).length > 0 && (
              <div className="response-section">
                <h3>🎭 Face Parsing Masks</h3>
                {Object.entries(responseImages.masks).map(([key, base64]) => (
                  <div key={key}><p>{key}</p><img src={`data:image/png;base64,${base64}`} alt={key} /></div>
                ))}
              </div>
            )}
            {responseImages.cv2_filters && Object.keys(responseImages.cv2_filters).length > 0 && (
              <div className="response-section">
                <h3>🧪 CV2 Filters</h3>
                {Object.entries(responseImages.cv2_filters).map(([region, filters]) => (
                  <div key={region}>
                    <h4>{region}</h4>
                    {Object.entries(filters).map(([filterName, base64]) => (
                      <div key={filterName}><p>{filterName}</p><img src={`data:image/png;base64,${base64}`} alt={`${region}-${filterName}`} /></div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {steps.length > 0 && (
              <div className="response-section">
                <h3>🛠 Steps</h3>
                <ul>{steps.map((step, idx) => (<li key={idx}><strong>{step.stage}</strong>: {step.msg}</li>))}</ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
