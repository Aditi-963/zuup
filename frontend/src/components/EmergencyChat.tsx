import React, { useState } from 'react';
import type { ChatMessage } from '../models/types';
import * as api from '../services/api';

export const EmergencyChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'ai',
      text: 'नमस्ते! I\'m RailSaarthi, your multilingual railway emergency assistant. I speak Hindi, English, Marathi, Telugu, Tamil and more. How can I help you right now?',
      label: 'RailSaarthi AI',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    if (!textToSend) setInputText('');

    const userMsgId = Date.now();
    const newUserMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      label: 'You',
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsThinking(true);

    try {
      const data = await api.sendChatMessage(text, currentLang);
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.reply,
        label: 'RailSaarthi AI',
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: Date.now() + 2,
        sender: 'ai',
        text: 'Please call Railway helpline 139 for immediate assistance. For medical emergencies on trains, contact the Train Superintendent. (Network fallback active)',
        label: 'RailSaarthi AI',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="view active" id="view-emergency">
      <div className="section">
        <div className="section-label">Emergency AI Assistant</div>
        <div className="section-title">Multilingual Railway Emergency Chat</div>
        <p className="section-subtitle">Ask anything in any language. Get instant help — translated, localized, and actionable.</p>

        <div className="emergency-grid">
          <div className="chat-area">
            <div 
              className="quick-prompts" 
              id="quick-prompts" 
              style={{ 
                display: 'flex', 
                gap: '8px', 
                flexWrap: 'wrap', 
                padding: '16px 20px', 
                borderBottom: '1px solid var(--border-color)',
                background: 'rgba(10, 10, 10, 0.4)'
              }}
            >
              <span className="quick-btn" onClick={() => sendMessage('My train is 2 hours late and I will miss my connecting train to Mumbai')}>⏱️ Missed connection</span>
              <span className="quick-btn" onClick={() => sendMessage('मेरी ट्रेन लेट है और मुझे नहीं पता क्या करें')}>🇮🇳 Hindi help</span>
              <span className="quick-btn" onClick={() => sendMessage('Platform change announced but I am disabled and cannot find elevator')}>♿ Accessibility</span>
              <span className="quick-btn" onClick={() => sendMessage('There is a medical emergency on Platform 4')}>🆘 Medical emergency</span>
            </div>

            <div className="chat-messages" id="chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`msg ${msg.sender === 'user' ? 'msg-user' : 'msg-ai'}`}
                >
                  <div className={`msg-label ${msg.sender === 'ai' ? 'ai' : 'user'}`}>{msg.label}</div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                </div>
              ))}
              {isThinking && (
                <div className="msg msg-ai">
                  <div className="msg-label ai">RailSaarthi AI</div>
                  <div className="dot-pulse"><span></span><span></span><span></span></div>
                </div>
              )}
            </div>

            <div className="lang-toggle">
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, marginRight: '8px', alignSelf: 'center', fontFamily: "'Space Grotesk', sans-serif" }}>RESPONSE LANGUAGE:</span>
              <button className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`} onClick={() => setCurrentLang('en')}>English</button>
              <button className={`lang-btn ${currentLang === 'hi' ? 'active' : ''}`} onClick={() => setCurrentLang('hi')}>हिंदी</button>
              <button className={`lang-btn ${currentLang === 'mr' ? 'active' : ''}`} onClick={() => setCurrentLang('mr')}>मराठी</button>
              <button className={`lang-btn ${currentLang === 'te' ? 'active' : ''}`} onClick={() => setCurrentLang('te')}>తెలుగు</button>
              <button className={`lang-btn ${currentLang === 'ta' ? 'active' : ''}`} onClick={() => setCurrentLang('ta')}>தமிழ்</button>
            </div>

            <div className="chat-input-row" style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px', background: 'rgba(10, 10, 10, 0.6)' }}>
              <input
                className="chat-input"
                id="chat-input"
                placeholder="Type your emergency in any language..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isThinking}
              />
              <button className="chat-send" id="send-btn" onClick={() => sendMessage()} disabled={isThinking}>Send →</button>
            </div>
          </div>

          <div>
            <div className="card" style={{ marginBottom: '16px', borderTop: '2px solid var(--saffron)' }}>
              <div className="card-title" style={{ marginBottom: '12px', fontFamily: "'Space Grotesk', sans-serif" }}>🎯 What This Demo Shows</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.9 }}>
                ✓ Real-time AI Agent response<br />
                ✓ Full multilingual support<br />
                ✓ Context-aware emergency protocols<br />
                ✓ Fallback offline safety guidelines<br />
                ✓ Indian railway network knowledge
              </div>
            </div>

            <div className="card" style={{ borderTop: '2px solid var(--green)' }}>
              <div className="card-title" style={{ marginBottom: '12px', fontFamily: "'Space Grotesk', sans-serif" }}>🚨 Try These Scenarios</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 2.2 }}>
                <div>→ "I lost my luggage on platform 2"</div>
                <div>→ "Where is the wheelchair assistant?"</div>
                <div>→ "Is there a pharmacy inside station?"</div>
                <div>→ "What is the medical emergency protocol?"</div>
                <div>→ Report security issues on train</div>
                <div style={{ marginTop: '8px', color: 'var(--saffron-light)', fontSize: '0.72rem' }} className="mono">[ Type in Hindi or Telugu too ]</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
