'use client';

import { useState, useRef, useEffect } from 'react';
import { useOperationsStore } from '../../../store/useOperationsStore';
import { chatService } from '../../../services/api';
import { MessageSquareWarning, Send, Bot, User, Trash2, ArrowRight, RefreshCw } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { ChatMessage } from '../../../types';

const suggestions = [
  'Passenger fainted on platform 3',
  'Smoke detected near track 2',
  'Crowd surge on platform 5',
];

export default function EmergencyChatPage() {
  const { chatMessages, addChatMessage, clearChat } = useOperationsStore();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    // 1. Append user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString(),
    };
    addChatMessage(userMsg);
    setInputText('');
    setLoading(true);

    // 2. Fetch AI response
    try {
      const response = await chatService.sendQuery(text);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString(),
      };
      addChatMessage(assistantMsg);
    } catch (e) {
      console.error('Error fetching chat response', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto h-[calc(100vh-140px)]">
      
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-wide uppercase">
            Emergency AI Assistant
          </h2>
          <p className="text-xs text-text-secondary font-mono tracking-wider mt-0.5">
            TACTICAL AI COPILOT FOR STATION PROTOCOLS AND ROUTE EVACUATION
          </p>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-surface px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          title="Clear Chat Logs"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear Logs</span>
        </button>
      </div>

      {/* Chat Area Box */}
      <div className="flex-1 bg-card rounded-xl border border-border shadow-sm flex flex-col overflow-hidden relative">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {chatMessages.map((msg) => {
            const isAI = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-4 max-w-[85%] items-start",
                  isAI ? "self-start" : "self-end flex-row-reverse"
                )}
              >
                {/* Avatar Icon */}
                <div className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center border shrink-0",
                  isAI 
                    ? "bg-primary/10 border-primary/20 text-primary" 
                    : "bg-surface border-border text-text-secondary"
                )}>
                  {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Message Body bubble */}
                <div className={cn(
                  "flex flex-col gap-1.5 rounded-xl px-4 py-3 border text-xs leading-relaxed",
                  isAI 
                    ? "bg-surface/30 border-border text-text-primary" 
                    : "bg-primary border-primary/10 text-black font-medium"
                )}>
                  <div className="whitespace-pre-line font-sans">
                    {msg.text}
                  </div>
                  
                  <span className={cn(
                    "text-[9px] font-mono self-end",
                    isAI ? "text-text-secondary" : "text-black/60"
                  )}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* AI Loader Bubble */}
          {loading && (
            <div className="flex gap-4 max-w-[80%] items-start self-start">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center border bg-primary/10 border-primary/20 text-primary shrink-0">
                <Bot className="h-4 w-4 animate-pulse" />
              </div>
              <div className="flex items-center gap-2 rounded-xl px-4 py-3 border bg-surface/30 border-border text-xs text-text-secondary">
                <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                <span>AI Agent analyzing operational protocol...</span>
              </div>
            </div>
          )}
          
          <div ref={scrollRef} />
        </div>

        {/* Suggestion boxes */}
        {chatMessages.length === 1 && !loading && (
          <div className="px-6 py-3 border-t border-border/60 bg-surface/20 flex flex-col gap-2">
            <span className="font-mono text-[9px] text-text-secondary uppercase tracking-wider font-bold">Suggestions</span>
            <div className="flex flex-wrap gap-2.5">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  className="flex items-center gap-1 text-[11px] font-sans border border-border bg-card hover:bg-surface px-3 py-1.5 rounded-lg text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  <span>{sug}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="border-t border-border p-4 bg-surface/40 flex gap-2">
          <input
            type="text"
            placeholder="Describe operations emergency (e.g., track obstruction, signal failure)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            disabled={loading}
            className="flex-1 bg-background border border-border text-xs rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-primary disabled:opacity-40"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim() || loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-black hover:bg-primary-hover shadow-[0_0_12px_rgba(232,255,63,0.3)] transition-colors cursor-pointer disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
