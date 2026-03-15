import { useState, useRef, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../lib/api';

/**
 * Embedded AI Floral Assistant Chat
 * Based on the FiftyFlowers flowerchat, adapted for React and embedded use.
 * When a product is clicked, it's added to Featured Blooms.
 */
export default function FlowerChatEmbed({ onSelectProduct, isExpanded, onToggle }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(() => `consult_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [conversationId, setConversationId] = useState(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of messages container (not the whole page)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message to AI agent
  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = { type: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ai-agent/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          action: 'process',
          user_id: userId,
          conversation_id: conversationId,
          message: messageText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Save conversation ID for follow-up messages
      if (data.conversation_id && !conversationId) {
        setConversationId(data.conversation_id);
      }

      // Add assistant response
      const assistantMessage = {
        type: 'assistant',
        content: data.response || data.message || '',
        products: data.products || [],
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('AI chat error:', error);
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: "Sorry, I couldn't process that request. Please try again.",
        products: [],
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, conversationId, isLoading]);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // Handle product click - add to Featured Blooms
  const handleProductClick = (product) => {
    if (!onSelectProduct) return;

    const handle = product.handle || product.product_handle;
    if (!handle) {
      console.error('No product handle found:', product);
      return;
    }

    onSelectProduct({ handle });
  };

  // Quick prompts for common searches
  const quickPrompts = [
    { label: 'Pink Roses', prompt: 'Show me pink roses' },
    { label: 'White Focal', prompt: 'Show me white focal flowers' },
    { label: 'Greenery', prompt: 'Show me greenery and eucalyptus' },
    { label: 'Budget Options', prompt: 'What are your most affordable flowers?' },
  ];

  return (
    <div className="border border-[#e0e0e0] rounded-[10px] bg-[#fafafa] overflow-hidden">
      {/* Header - Clickable to toggle expand/collapse */}
      <button
        onClick={onToggle}
        className="w-full bg-[#3BA59A] text-white px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[#349085] transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="2" fill="currentColor" opacity="0.9"/>
            <circle cx="8" cy="12" r="1.5" fill="currentColor" opacity="0.8"/>
            <circle cx="16" cy="12" r="1.5" fill="currentColor" opacity="0.8"/>
            <circle cx="6" cy="16" r="1" fill="currentColor" opacity="0.7"/>
            <circle cx="12" cy="16" r="1.5" fill="currentColor" opacity="0.8"/>
            <circle cx="18" cy="16" r="1" fill="currentColor" opacity="0.7"/>
            <path d="M12 10L8 12M12 10L16 12M8 12L6 16M8 12L12 16M16 12L18 16M16 12L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
          </svg>
          <span className="font-semibold text-[14px]">AI Floral Assistant</span>
          <span className="text-[12px] opacity-80">— Explore flowers by color, style, or occasion</span>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="relative">
          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            className="h-[300px] overflow-y-auto overscroll-contain bg-white p-4"
          >
            {messages.length === 0 ? (
              // Welcome state with quick prompts
              <div className="text-center py-4">
                <p className="text-[#666] text-[14px] mb-4 font-['Nunito_Sans',sans-serif]">
                  Hi! I can help you explore FiftyFlowers' catalog. Try asking me about specific flowers, colors, or styles.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickPrompts.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(qp.prompt)}
                      className="px-3 py-1.5 bg-[#f0f9f7] text-[#3BA59A] text-[12px] rounded-full border border-[#3BA59A] hover:bg-[#3BA59A] hover:text-white transition-colors font-medium"
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Messages
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className="animate-[fadeIn_0.3s_ease]"
                  >
                    {/* Message bubble - always constrained width */}
                    <div className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-3 text-[14px] leading-[20px] ${
                        msg.type === 'user'
                          ? 'bg-white text-black border border-[#e0e0e0] rounded-[18px] rounded-br-[4px]'
                          : 'bg-[#E6F0E4] text-black rounded-[18px] rounded-bl-[4px]'
                      }`}>
                        {msg.content}
                      </div>
                    </div>

                    {/* Products grid - full width, below the message bubble */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-3">
                        <div className="grid grid-cols-2 gap-3">
                          {msg.products.slice(0, 6).map((product, pIdx) => (
                            <div
                              key={pIdx}
                              onClick={() => handleProductClick(product)}
                              className="bg-white border border-[#e8e8e8] rounded-[12px] cursor-pointer hover:border-[#d0d0d0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all overflow-hidden"
                            >
                              {/* Product image */}
                              <div className="relative w-full aspect-square overflow-hidden bg-[#f5f6f7]">
                                {(product.image_urls?.[0] || product.image_url || product.image) ? (
                                  <img
                                    src={product.image_urls?.[0] || product.image_url || product.image}
                                    alt={product.product_name || product.title}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#ccc]">
                                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                                      <path d="M12 3C9 3 6 6 6 9C6 12 9 15 12 18C15 15 18 12 18 9C18 6 15 3 12 3Z" stroke="currentColor" strokeWidth="1.5"/>
                                    </svg>
                                  </div>
                                )}
                              </div>
                              {/* Product details */}
                              <div className="p-3">
                                <span className="block text-[10px] uppercase tracking-[0.5px] text-[#2a7f62] font-semibold mb-1">
                                  {product.product_type || product.category || 'Flower'}
                                </span>
                                <p className="text-[13px] font-bold text-[#1a1a1a] mb-1 line-clamp-2 leading-tight">
                                  {product.product_name || product.title}
                                </p>
                                <p className="text-[12px] text-[#666] mb-2">
                                  {product.price_range
                                    ? `$${product.price_range.min?.toFixed(2)} - $${product.price_range.max?.toFixed(2)}`
                                    : product.variant_price
                                      ? `$${product.variant_price.toFixed(2)}`
                                      : product.price || ''
                                  }
                                </p>
                                <span className="block w-full bg-[#2a7f62] text-white text-center py-2 px-3 rounded-[6px] text-[12px] font-semibold hover:bg-[#1f5a47] transition-colors">
                                  Add to Blooms
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                  <div className="flex justify-start animate-[fadeIn_0.3s_ease]">
                    <div className="bg-[#E6F0E4] rounded-[18px] rounded-bl-[4px] px-4 py-3">
                      <div className="flex gap-1 items-center">
                        <span className="w-2 h-2 bg-[#999] rounded-full animate-[typingDot_1.4s_infinite]" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-[#999] rounded-full animate-[typingDot_1.4s_infinite]" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 bg-[#999] rounded-full animate-[typingDot_1.4s_infinite]" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="border-t border-[#e0e0e0] p-4 bg-white relative z-[1]">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about flowers, colors, styles..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-[#e0e0e0] rounded-[24px] text-[14px] outline-none focus:border-[#4CAF50] disabled:bg-[#f5f5f5] transition-colors font-['Nunito_Sans',sans-serif]"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-6 py-3 bg-[#3BA59A] text-white rounded-[24px] text-[14px] font-semibold hover:scale-105 disabled:bg-[#ccc] disabled:cursor-not-allowed disabled:hover:scale-100 transition-transform"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
