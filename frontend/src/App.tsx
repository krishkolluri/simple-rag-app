import { useState, useRef, useEffect } from "react";
import "./App.css";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const HINTS = [
  "What is Node.js used for?",
  "How do React hooks work?",
  "What is Express.js?",
  "Explain useState and useEffect",
];

/* Neural network nodes (x, y) and edges between them */
const NODES = [
  [120, 80], [320, 50], [560, 90], [760, 60], [950, 100],
  [80,  260], [280, 220], [480, 270], [680, 230], [900, 260],
  [150, 430], [400, 400], [620, 450], [820, 410],
  [250, 580], [500, 560], [750, 590],
];

const EDGES = [
  [0,1],[1,2],[2,3],[3,4],[0,5],[1,6],[2,7],[3,8],[4,9],
  [5,6],[6,7],[7,8],[8,9],[5,10],[6,11],[7,12],[8,13],
  [10,11],[11,12],[12,13],[10,14],[11,15],[12,16],[14,15],[15,16],
  [1,7],[2,8],[6,12],[7,13],[0,6],[3,9],
];

function NeuralBackground() {
  return (
    <div className="bg">
      <svg className="neural-canvas" viewBox="0 0 1024 640" preserveAspectRatio="xMidYMid slice">
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            className="edge"
            x1={NODES[a][0]} y1={NODES[a][1]}
            x2={NODES[b][0]} y2={NODES[b][1]}
          />
        ))}
        {NODES.map(([cx, cy], i) => (
          <circle key={i} className="node" cx={cx} cy={cy} r="5" />
        ))}
      </svg>
      {[1,2,3,4,5].map(i => <div key={i} className="packet" />)}
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(question?: string) {
    const q = (question ?? input).trim();
    if (!q || loading) return;

    setMessages(prev => [...prev, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.answer }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "Error: Could not reach the backend. Make sure it is running on port 5000." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <NeuralBackground />

      <div className="app">
        <header className="header">
          <span className="header-icon">🤖</span>
          <h1>RAG AI Agent</h1>
          <span className="badge">llama3.2 · Ollama · Local</span>
        </header>

        <div className="chat-window">
          {messages.length === 0 && (
            <div className="empty-state">
              <svg className="empty-icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Head */}
                <rect x="24" y="6" width="32" height="28" rx="8" fill="#3b82f6" />
                {/* Eyes */}
                <circle cx="34" cy="18" r="4" fill="white" />
                <circle cx="46" cy="18" r="4" fill="white" />
                <circle cx="35" cy="19" r="2" fill="#1d4ed8" />
                <circle cx="47" cy="19" r="2" fill="#1d4ed8" />
                {/* Antenna */}
                <line x1="40" y1="6" x2="40" y2="0" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="40" cy="0" r="2.5" fill="#60a5fa" />
                {/* Mouth */}
                <rect x="32" y="27" width="16" height="3" rx="1.5" fill="white" opacity="0.8" />
                {/* Neck */}
                <rect x="36" y="34" width="8" height="5" rx="2" fill="#2563eb" />
                {/* Body */}
                <rect x="20" y="39" width="40" height="26" rx="8" fill="#2563eb" />
                {/* Chest panel */}
                <rect x="28" y="44" width="24" height="14" rx="4" fill="#1d4ed8" />
                <circle cx="36" cy="51" r="3" fill="#60a5fa" />
                <circle cx="44" cy="51" r="3" fill="#34d399" />
                {/* Arms */}
                <rect x="6" y="39" width="12" height="22" rx="6" fill="#3b82f6" />
                <rect x="62" y="39" width="12" height="22" rx="6" fill="#3b82f6" />
                {/* Hands */}
                <circle cx="12" cy="63" r="5" fill="#2563eb" />
                <circle cx="68" cy="63" r="5" fill="#2563eb" />
                {/* Legs */}
                <rect x="26" y="65" width="11" height="14" rx="5" fill="#2563eb" />
                <rect x="43" y="65" width="11" height="14" rx="5" fill="#2563eb" />
              </svg>
              <p>Ask anything about <strong>Node.js</strong> or <strong>React</strong></p>
              <div className="empty-hints">
                {HINTS.map(h => (
                  <div key={h} className="hint" onClick={() => sendMessage(h)}>
                    {h}
                  </div>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`bubble ${msg.role}`}>
              <span className="label">
                {msg.role === "user" ? "👤 You" : "🤖 AI"}
              </span>
              <p>{msg.text}</p>
            </div>
          ))}

          {loading && (
            <div className="bubble assistant loading">
              <span className="label">🤖 AI</span>
              <p>
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="input-row">
          <input
            type="text"
            placeholder="Ask a question and press Enter..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            disabled={loading}
            autoFocus
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            Send ➤
          </button>
        </div>
      </div>
    </>
  );
}
