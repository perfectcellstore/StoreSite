'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ChatbotModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! I\'m Perfect Cell Bot! How can I help you today?', sender: 'bot', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 800);
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return 'I\'m here to help! You can ask me about our products, shipping, or orders. What would you like to know?';
    }
    if (lowerMessage.includes('ship') || lowerMessage.includes('delivery')) {
      return 'We offer fast delivery across Iraq! Shipping takes 1-3 business days. Free shipping on orders over 50,000 IQD.';
    }
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return 'We accept Cash on Delivery (COD). You can pay when you receive your order!';
    }
    if (lowerMessage.includes('product') || lowerMessage.includes('item')) {
      return 'We have an amazing collection of rare collectibles, figures, masks, and more! Check out our shop to see all items.';
    }
    if (lowerMessage.includes('promo') || lowerMessage.includes('discount') || lowerMessage.includes('code')) {
      return 'Try finding our secret easter egg for a special promo code! 😉';
    }
    
    return 'Thanks for your message! For specific inquiries, you can also reach us via WhatsApp. How else can I assist you?';
  };

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <>
      {/* Full-screen backdrop */}
      <div 
        className="chatbot-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9998,
        }}
      />
      
      {/* Chatbot container - mobile-safe positioning */}
      <div 
        className="chatbot-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          maxHeight: '100%',
          zIndex: 9999,
        }}
      >
        {/* Inner content with proper scrolling */}
        <div className="chatbot-inner md:max-w-md md:mx-auto md:my-8 md:h-auto bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-bio-green-500/30 md:rounded-xl shadow-2xl flex flex-col"
          style={{
            height: '100%',
            maxHeight: '100%',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-bio-green-500/30 bg-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-bio-green-500/20 flex items-center justify-center">
                <Bot className="h-6 w-6 text-bio-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Perfect Cell Bot</h3>
                <p className="text-xs text-gray-400">Here to help! 💚</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Messages area - scrollable */}
          <div 
            className="flex-1 p-4 space-y-4"
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-bio-green-500 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area - fixed at bottom */}
          <div className="p-4 border-t border-bio-green-500/30 bg-gray-800/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-bio-green-500 focus:border-transparent"
              />
              <Button
                onClick={handleSend}
                className="bg-bio-green-500 hover:bg-bio-green-600 text-white px-4"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Mobile-first: full screen */
        .chatbot-inner {
          height: 100%;
          border-radius: 0;
        }

        /* Desktop: modal style */
        @media (min-width: 768px) {
          .chatbot-container {
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%);
            width: auto !important;
            height: auto !important;
            max-width: 28rem;
            max-height: 90vh;
          }
          
          .chatbot-inner {
            height: 600px;
            max-height: 90vh;
          }
        }

        /* iOS safe areas */
        @supports (padding: env(safe-area-inset-top)) {
          .chatbot-inner {
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
      `}</style>
    </>
  );

  // Render at body level using portal
  return createPortal(modalContent, document.body);
}
