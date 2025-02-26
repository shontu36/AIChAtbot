import { useState } from "react";
import axios from "axios";

const App = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",

        {
          inputs: input,
          parameters: { max_new_tokens: 100, temperature: 0.7, top_p: 0.9 },
        },
        {
          headers: {
            Authorization: `Bearer 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`,
          },
        }
      );

      console.log("API Response:", response.data);

      const botMessage = {
        sender: "bot",
        text: response.data?.generated_text || "I couldn't understand that.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Error: ${
            error.response?.data?.error || "Failed to fetch response"
          }`,
        },
      ]);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-2 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-600 self-end"
                : "bg-gray-700 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-800 flex">
        <input
          type="text"
          className="flex-grow p-2 bg-gray-700 rounded-lg outline-none"
          placeholder="How you feeling today ?..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="ml-2 bg-blue-500 px-4 py-2 rounded-lg"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
