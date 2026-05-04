import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your Event Assistant. How can I help you today?", isBot: true }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');

    // Simple FAQ Logic
    setTimeout(() => {
      let botReply = "I'm sorry, I didn't understand that. Please contact support.";
      const lower = userMsg.toLowerCase();
      
      if (lower.includes('book') || lower.includes('ticket')) {
        botReply = "To book a ticket, go to the Dashboard, click on an event, and fill out the booking form!";
      } else if (lower.includes('refund') || lower.includes('cancel')) {
        botReply = "Tickets are non-refundable. Please read our terms and conditions.";
      } else if (lower.includes('payment') || lower.includes('pay')) {
        botReply = "We accept all major simulated payment methods. Just scan the QR code and enter any transaction ID during checkout.";
      } else if (lower.includes('hi') || lower.includes('hello')) {
        botReply = "Hello! Let me know if you have questions about events or bookings.";
      }

      setMessages(prev => [...prev, { text: botReply, isBot: true }]);
    }, 600);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          zIndex: 1000
        }}
      >
        <MessageSquare size={28} />
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '350px',
          height: '500px',
          backgroundColor: 'var(--surface)',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          border: '1px solid var(--surface-light)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>Event Assistant</h3>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
          
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                backgroundColor: msg.isBot ? 'var(--surface-light)' : 'var(--primary)',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                maxWidth: '80%',
                borderBottomLeftRadius: msg.isBot ? '0' : '1rem',
                borderBottomRightRadius: !msg.isBot ? '0' : '1rem',
              }}>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>{msg.text}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--surface-light)', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Type a message..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', margin: 0 }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem' }}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
