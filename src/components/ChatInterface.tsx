
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Bot, User } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: Date;
  agent?: string;
}

interface ChatInterfaceProps {
  onClose: () => void;
  initialPrompt?: string;
}

const ChatInterface = ({ onClose, initialPrompt }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      message: "Hello! I'm your AI travel concierge. How can I help you plan your perfect trip today?",
      timestamp: new Date(),
      agent: 'travel_concierge_agent'
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // Handle initial prompt when component mounts
  useEffect(() => {
    if (initialPrompt) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        message: initialPrompt,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);

      // Simulate AI response to the initial prompt
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          message: "Perfect! I'd be happy to help you with that. Let me gather some information to provide you with the best assistance possible. What specific details can you share to get started?",
          timestamp: new Date(),
          agent: 'travel_planning_agent'
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    }
  }, [initialPrompt]);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        message: "I'd be happy to help you with that! Let me connect you with the right agent for your needs.",
        timestamp: new Date(),
        agent: 'travel_budget_agent'
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] koncii-card flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border/50">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-primary" />
            <span>AI Travel Concierge</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border/50'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'ai' && (
                      <Bot className="w-4 h-4 mt-0.5 text-primary" />
                    )}
                    {message.sender === 'user' && (
                      <User className="w-4 h-4 mt-0.5 text-primary-foreground" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.message}</p>
                      {message.agent && (
                        <p className="text-xs text-muted-foreground mt-1">
                          via {message.agent.replace(/_/g, ' ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your trip..."
                className="flex-1 bg-background/50"
              />
              <Button onClick={sendMessage} size="icon" className="koncii-button">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs bg-card/50 hover:bg-primary hover:text-primary-foreground"
                onClick={() => setInputMessage("Plan a 7-day trip to Japan")}
              >
                Plan a trip to Japan
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs bg-card/50 hover:bg-primary hover:text-primary-foreground"
                onClick={() => setInputMessage("Find cheap flights to Europe")}
              >
                Find cheap flights
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs bg-card/50 hover:bg-primary hover:text-primary-foreground"
                onClick={() => setInputMessage("What's the weather like in Bali?")}
              >
                Weather updates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
