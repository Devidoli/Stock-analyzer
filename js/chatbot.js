// AI Chatbot System
class TradingChatbot {
    constructor() {
        this.context = [];
        this.knowledgeBase = this.initializeKnowledgeBase();
        this.responses = this.initializeResponses();
    }

    initializeKnowledgeBase() {
        return {
            patterns: {
                'doji': 'A Doji candle has virtually the same opening and closing price, indicating market indecision. It suggests a potential reversal when found at key support or resistance levels.',
                'hammer': 'A Hammer is a bullish reversal pattern with a long lower shadow (at least twice the body) and little to no upper shadow. It suggests buying pressure after a decline.',
                'hanging man': 'A Hanging Man appears identical to a Hammer but occurs at the top of an uptrend. It signals potential bearish reversal.',
                'shooting star': 'A Shooting Star has a long upper shadow and small real body at the lower end. It indicates selling pressure and potential bearish reversal.',
                'engulfing': 'Engulfing patterns occur when a larger candle completely engulfs the previous candle. Bullish engulfing is very bullish, bearish engulfing is very bearish.',
                'morning star': 'A Morning Star is a three-candle bullish reversal pattern: large red candle, small-bodied candle, then large green candle.',
                'evening star': 'An Evening Star is a three-candle bearish reversal pattern: large green candle, small-bodied candle, then large red candle.'
            },
            
            riskManagement: {
                'stop loss': 'A stop loss is a predetermined exit point to limit losses. Generally set 1-3% below entry for long positions, above for short positions.',
                'take profit': 'Take profit orders automatically close positions at predetermined profit levels. Many traders use 1:2 or 1:3 risk-reward ratios.',
                'position sizing': 'Never risk more than 1-2% of your account on a single trade. Calculate position size based on stop loss distance.',
                'risk reward': 'Risk-reward ratio compares potential loss to potential profit. A 1:2 ratio means you risk $1 to potentially make $2.'
            },
            
            trading: {
                'support': 'Support is a price level where buying interest typically emerges, preventing further decline.',
                'resistance': 'Resistance is a price level where selling pressure typically emerges, preventing further advance.',
                'trend': 'Trend is the general direction of price movement. "The trend is your friend" - trade with the trend for higher probability.',
                'volume': 'Volume confirms price movements. High volume on breakouts increases reliability.',
                'timeframe': 'Higher timeframes (4H, Daily) are more reliable than lower timeframes (1m, 5m) for pattern analysis.'
            }
        };
    }

    initializeResponses() {
        return {
            greeting: [
                "Hello! I'm your AI trading assistant. How can I help you today?",
                "Hi there! Ready to discuss some trading strategies?",
                "Welcome! I'm here to help you understand candlestick patterns and trading concepts."
            ],
            
            unknown: [
                "I'm not sure about that specific topic. Could you ask about candlestick patterns, risk management, or trading strategies?",
                "That's outside my expertise. Try asking about technical analysis or pattern recognition!",
                "I specialize in trading education. Ask me about patterns, stop losses, or market analysis!"
            ],
            
            encouragement: [
                "Great question! Understanding this concept will improve your trading.",
                "That's an important topic for successful trading!",
                "Excellent! Risk management is crucial for long-term success."
            ]
        };
    }

    async processMessage(message, analysisResults = null) {
        const userMessage = message.toLowerCase().trim();
        
        // Add to context
        this.context.push({role: 'user', content: userMessage});
        
        // Generate response
        let response;
        
        if (this.isGreeting(userMessage)) {
            response = this.getRandomResponse('greeting');
        } else if (analysisResults && this.isAboutAnalysis(userMessage)) {
            response = this.generateAnalysisResponse(userMessage, analysisResults);
        } else if (this.isPatternQuestion(userMessage)) {
            response = this.generatePatternResponse(userMessage);
        } else if (this.isRiskManagementQuestion(userMessage)) {
            response = this.generateRiskManagementResponse(userMessage);
        } else if (this.isTradingQuestion(userMessage)) {
            response = this.generateTradingResponse(userMessage);
        } else {
            response = await this.generateAIResponse(userMessage);
        }
        
        // Add to context
        this.context.push({role: 'assistant', content: response});
        
        return response;
    }

    isGreeting(message) {
        const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
        return greetings.some(greeting => message.includes(greeting));
    }

    isAboutAnalysis(message) {
        const analysisKeywords = ['analysis', 'result', 'pattern detected', 'what do you think', 'explain this'];
        return analysisKeywords.some(keyword => message.includes(keyword));
    }

    isPatternQuestion(message) {
        const patternKeywords = Object.keys(this.knowledgeBase.patterns);
        return patternKeywords.some(pattern => message.includes(pattern));
    }

    isRiskManagementQuestion(message) {
        const riskKeywords = Object.keys(this.knowledgeBase.riskManagement);
        return riskKeywords.some(keyword => message.includes(keyword));
    }

    isTradingQuestion(message) {
        const tradingKeywords = Object.keys(this.knowledgeBase.trading);
        return tradingKeywords.some(keyword => message.includes(keyword));
    }

    generateAnalysisResponse(message, analysisResults) {
        const pattern = analysisResults.pattern.toLowerCase();
        const confidence = analysisResults.confidence;
        
        let response = `Based on your uploaded chart, I detected a ${analysisResults.pattern} pattern with ${confidence}% confidence. `;
        
        if (pattern in this.knowledgeBase.patterns) {
            response += this.knowledgeBase.patterns[pattern];
        }
        
        response += `\n\nThe trading signal is: ${analysisResults.signal}`;
        response += `\nRecommended stop loss: ${analysisResults.stopLoss}`;
        response += `\nTake profit target: ${analysisResults.takeProfit}`;
        response += `\nRisk-reward ratio: ${analysisResults.riskReward}`;
        
        if (confidence > 80) {
            response += "\n\nThis is a high-confidence pattern! However, always confirm with other indicators and proper risk management.";
        } else {
            response += "\n\nThis is a moderate-confidence pattern. Consider waiting for additional confirmation before entering a trade.";
        }
        
        return response;
    }

    generatePatternResponse(message) {
        for (const [pattern, description] of Object.entries(this.knowledgeBase.patterns)) {
            if (message.includes(pattern)) {
                let response = description;
                
                // Add trading tips based on pattern
                switch(pattern) {
                    case 'doji':
                        response += "\n\nTrading tip: Wait for the next candle to confirm direction before entering a trade.";
                        break;
                    case 'hammer':
                        response += "\n\nTrading tip: Enter long positions above the hammer's high with stop loss below the low.";
                        break;
                    case 'engulfing':
                        response += "\n\nTrading tip: Engulfing patterns are most reliable when they occur at key support/resistance levels.";
                        break;
                }
                
                return response;
            }
        }
        
        return "Could you specify which candlestick pattern you'd like to learn about? I can explain Doji, Hammer, Engulfing, Morning Star, and many more!";
    }

    generateRiskManagementResponse(message) {
        for (const [concept, description] of Object.entries(this.knowledgeBase.riskManagement)) {
            if (message.includes(concept)) {
                let response = description;
                
                // Add practical examples
                switch(concept) {
                    case 'stop loss':
                        response += "\n\nExample: If you buy at $100, set stop loss at $97 (3% risk). If price hits $97, you exit automatically.";
                        break;
                    case 'position sizing':
                        response += "\n\nExample: With a $10,000 account, risk $100-200 per trade. If your stop loss is $2 away, buy 50-100 shares.";
                        break;
                }
                
                return response;
            }
        }
        
        return "Risk management is crucial! Ask me about stop losses, position sizing, take profits, or risk-reward ratios.";
    }

    generateTradingResponse(message) {
        for (const [concept, description] of Object.entries(this.knowledgeBase.trading)) {
            if (message.includes(concept)) {
                return description;
            }
        }
        
        return "I can help with support/resistance, trends, volume analysis, and timeframe selection. What specific trading concept interests you?";
    }

    async generateAIResponse(message) {
        // For free version, use rule-based responses
        // In paid version, this would call OpenAI API
        
        const keywords = message.split(' ');
        
        // Check for specific trading terms
        if (keywords.some(word => ['buy', 'sell', 'trade', 'entry', 'exit'].includes(word))) {
            return "I can provide educational information about trading concepts, but I cannot give specific buy/sell advice. Always do your own research and consider your risk tolerance!";
        }
        
        if (keywords.some(word => ['learn', 'education', 'beginner', 'start'].includes(word))) {
            return "Great! Start with understanding basic candlestick patterns like Doji, Hammer, and Engulfing. Then learn about support/resistance and risk management. Would you like me to explain any of these concepts?";
        }
        
        if (keywords.some(word => ['timeframe', 'chart', 'analysis'].includes(word))) {
            return "For pattern analysis, I recommend starting with 4-hour and daily charts as they're more reliable. 1-minute and 5-minute charts can be noisy. What timeframe are you most interested in trading?";
        }
        
        return this.getRandomResponse('unknown');
    }

    getRandomResponse(type) {
        const responses = this.responses[type];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Initialize chatbot
const chatbot = new TradingChatbot();

function initializeChat() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    sendBtn.addEventListener('click', sendMessage);
}

async function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Clear input
    chatInput.value = '';
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Get bot response
        const response = await chatbot.processMessage(message, analysisResults);
        
        // Remove typing indicator and add bot response
        setTimeout(() => {
            removeTypingIndicator();
            addMessageToChat(response, 'bot');
        }, 1000);
        
    } catch (error) {
        removeTypingIndicator();
        addMessageToChat("Sorry, I'm having trouble processing your message. Please try again!", 'bot');
    }
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `<p>${message.replace(/\n/g, '<br>')}</p>`;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add animation
    messageDiv.classList.add('fade-in-up');
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function askQuestion(question) {
    const chatInput = document.getElementById('chat-input');
    chatInput.value = question;
    sendMessage();
}

// Add CSS for typing indicator
const typingCSS = `
.typing-dots {
    display: flex;
    gap: 4px;
    align-items: center;
}

.typing-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-secondary);
    animation: typing-bounce 1.4s infinite ease-in-out both;
}

.typing-dots span:nth-child(1) {
    animation-delay: -0.32s;
}

.typing-dots span:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes typing-bounce {
    0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
    }
    40% {
        transform: scale(1);
        opacity: 1;
    }
}
`;

// Add typing CSS to document
const style = document.createElement('style');
style.textContent = typingCSS;
document.head.appendChild(style);
const AI_CONFIG = {
    GEMINI_KEY: 'AIzaSyDaEqaIZdc2x7YrRlpo2lXwApDWe95zKlc', // From makersuite.google.com
};