import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { SendOutlined, CloseOutlined, MessageFilled } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { sendMessage } from "../api/chatBotApi";

const formatMessageText = (text) => {
  if (!text) return "";
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trim();
    const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
    const content = isBullet ? trimmed.substring(2) : line;

    // Handle bold formatting: **text** -> <strong>text</strong>
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = boldRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      parts.push(<strong key={match.index}>{match[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    const renderedText = parts.length > 0 ? parts : content;

    if (isBullet) {
      return (
        <li key={i} style={{ marginLeft: "15px", marginBottom: "4px", listStyleType: "disc" }}>
          {renderedText}
        </li>
      );
    }

    return (
      <p key={i} style={{ margin: "0 0 8px 0" }}>
        {renderedText}
      </p>
    );
  });
};

const AICoachChat = () => {
  const location = useLocation();


  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "coach",
      text: "Hey there! I am your Fithub AI Coach. Ask me anything about workout routines, nutrition tips, exercise form, or wellness!",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);


  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // 1. Add user's message
    const userMsg = { sender: "user", text: inputMessage };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");

    // 2. Trigger typing skeleton loader
    setIsTyping(true);

    const payload = {
      chatHistory: messages,
      message: userMsg.text
    };

    try {
      const reply = await sendMessage(payload, process.env.REACT_APP_BASE_URL);
      setMessages((prev) => [...prev, { sender: "coach", text: reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "coach", text: "Sorry, I'm having trouble connecting right now. Please try again in a moment!" }
      ]);
    } finally {
      setIsTyping(false); // Ensures the loader stops in both success and error cases
    }
  }, [inputMessage, messages]);


  const handleSuggestionClick = useCallback(async (suggestionText) => {
    if (isTyping) return;

    // 1. Add user's message
    const userMsg = { sender: "user", text: suggestionText };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");

    // 2. Trigger typing skeleton loader
    setIsTyping(true);

    const payload = {
      chatHistory: messages,
      message: suggestionText
    };

    try {
      const reply = await sendMessage(payload, process.env.REACT_APP_BASE_URL);
      setMessages((prev) => [...prev, { sender: "coach", text: reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "coach", text: "Sorry, I'm having trouble connecting right now. Please try again in a moment!" }
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, messages]);

  const suggestions = useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes("exercise")) {
      return [
        "Tips for correct squat execution form.",
        "Alternative to bench press for shoulder pain?",
        "How to avoid lower back strain during deadlifts?",
        "Good warm-up routine before heavy lifting?"
      ];
    }
    if (path.includes("workout")) {
      return [
        "Suggest a quick 15-minute core routine.",
        "How many rest days do I need per week?",
        "What is the difference between split and full body?",
        "How to progress when weights feel too light?"
      ];
    }
    if (path.includes("recipe")) {
      return [
        "How much protein do I need to bulk up?",
        "Suggest a high-protein post-workout meal.",
        "What should I eat before an early morning workout?",
        "Tips for healthy meal prep on a budget."
      ];
    }
    return [
      "Alternative to bench press for shoulder pain?",
      "Suggest a quick 15-minute core routine.",
      "How much protein do I need to bulk up?",
      "Tips for correct squat execution form.",
    ];
  }, [location.pathname]);

  return (
    <div className="ai-chat-container">
      {/* Floating Action Button */}
      <button
        className={`ai-chat-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with AI Fitness Coach"
      >
        {isOpen ? <CloseOutlined /> : <MessageFilled />}
      </button>

      {/* Slide-out Chat Panel */}
      {isOpen && (
        <div className="ai-chat-drawer">
          {/* Chat Header */}
          <div className="ai-chat-header">
            <div className="coach-profile">
              <div className="avatar-wrapper">
                <span className="coach-avatar">🤖</span>
                <span className="online-dot"></span>
              </div>
              <div className="coach-info">
                <h3>Fithub Coach</h3>
                <span>AI Assistant • Online</span>
              </div>
            </div>
            <button className="close-drawer-btn" onClick={() => setIsOpen(false)}>
              <CloseOutlined />
            </button>
          </div>

          {/* Messages Area */}
          <div className="ai-chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender === "user" ? "user" : "coach"}`}
              >
                <div className="message-bubble">
                  {msg.sender === "coach" ? formatMessageText(msg.text) : <p>{msg.text}</p>}
                </div>
              </div>
            ))}

            {/* Bouncing Typing Animation */}
            {isTyping && (
              <div className="chat-message coach typing">
                <div className="message-bubble">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick-reply Suggestion Chips */}
          {messages.length === 1 && (
            <div className="ai-chat-suggestions">
              <div className="suggestions-scroll">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="suggestion-chip"
                    onClick={() => handleSuggestionClick(sug)}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <form className="ai-chat-footer" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask AI Coach..."
              className="ai-chat-input"
            />
            <button type="submit" className="ai-chat-send" disabled={!inputMessage.trim()}>
              <SendOutlined />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AICoachChat;
