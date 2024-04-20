import { useState, useEffect, useRef } from "react";
import axios from "axios";
import logo from "../public/logo.jpeg";
import company_logo from "../public/company_logo.png";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent default to avoid newline in textarea
      const message = input.trim();
      if (message) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message, sender: "user" },
        ]);
        setInput(""); // Clear input after sending
        sendRequest(message);
      }
    }
  };

  const sendRequest = (content) => {
    setLoading(true);
    axios
      .post("http://20.240.200.80/api/chat/", { question: content })
      .then((response) => {
        const reply = response.data.answer; // Assuming the response has an 'answer' key
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: reply, sender: "ai" },
        ]);
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Error occurred.", sender: "ai" },
        ]);
      })
      .finally(() => {
        setLoading(false);
        scrollToBottom();
      });
  };

  return (
    <>
      <nav style={{ backgroundColor: "#f8f9fa", padding: "10px 20px" }}>
        <div className="container">
          <img src={company_logo} alt="Logo" style={{ height: "80px" }} />
        </div>
      </nav>

      <div className="container d-flex justify-content-center">
        <div className="card mt-5">
          <div className="d-flex flex-row justify-content-between p-3 adiv text-white">
            <i className="fas fa-chevron-left"></i>
            <span className="pb-3 ">Hero Buddy ChatBot</span>
            <i className="fas fa-times"></i>
          </div>
          <div
            className="messages-container"
            style={{ overflowY: "auto", maxHeight: "400px" }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`d-flex flex-row p-3 ${
                  message.sender === "ai"
                    ? "justify-content-start"
                    : "justify-content-end"
                }`}
              >
                {message.sender === "ai" && (
                  <img src={logo} alt="AI" width="30" height="30" />
                )}
                <div
                  className={`chat ml-2 p-3 ${
                    message.sender === "ai" ? "bg-light" : "bg-white text-right"
                  }`}
                >
                  {message.text}
                </div>
                {message.sender === "user" && (
                  <img
                    src="https://img.icons8.com/color/48/000000/circled-user-male-skin-type-7.png"
                    alt="User"
                    width="30"
                    height="30"
                  />
                )}
              </div>
            ))}
            {loading && (
              <div className="d-flex flex-row justify-content-start p-3">
                <img src={logo} alt="AI" width="30" height="30" />
                <div className="chat ml-2 p-3 bg-light">...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="form-group px-3 py-3">
            <textarea
              className="form-control"
              rows="5"
              placeholder="Type your message"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
