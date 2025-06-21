import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Bot, User } from "lucide-react";

//npm install react-markdown

interface Place {
  place_name: string;
  address: string;
  lat: string;
  long: string;
  review_ratings: string;
  highlights: string;
  image_url: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  message: string | Place[];
  timestamp: Date;
  agent?: string;
}

interface ChatInterfaceProps {
  onClose: () => void;
}

const ChatInterface = ({ onClose }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      message:
        "Hello! I'm your AI travel concierge. How can I help you plan your perfect trip today?",
      timestamp: new Date(),
      agent: "travel_concierge_agent",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      message: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    try {
      const res = await fetch("http://localhost:9000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await res.json();

      const newMessages: ChatMessage[] = [];

      // Handle text replies
      if (Array.isArray(data.text)) {
        data.text.forEach((text: string) => {
          newMessages.push({
            id: Date.now().toString() + Math.random(),
            sender: "ai",
            message: text,
            timestamp: new Date(),
            agent: "travel_concierge_agent",
          });
        });
      }

      // Handle places
      if (Array.isArray(data.reply) && data.reply.length > 0) {
        newMessages.push({
          id: Date.now().toString() + "_places",
          sender: "ai",
          message: data.reply,
          timestamp: new Date(),
          agent: "travel_concierge_agent",
        });
      }

      setMessages((prev) => [...prev, ...newMessages]);
    } catch (error) {
      console.error("Error talking to backend:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        sender: "ai",
        message: "Sorry, something went wrong. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-grat/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] koncii-card flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border/50">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-primary" />
            <span>AI Travel Concierge</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 p-0">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border/50"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === "ai" ? (
                      <Bot className="w-4 h-4 mt-0.5 text-primary" />
                    ) : (
                      <User className="w-4 h-4 mt-0.5 text-primary-foreground" />
                    )}
                    <div className="flex-1">
                      {Array.isArray(message.message) ? (
                        <div className="space-y-4">
                          {message.message.map((place, idx) => (
                            <div
                              key={idx}
                              className="bg-background p-2 rounded-md border"
                            >
                              {place.image_url && (
                                <img
                                  src={place.image_url}
                                  alt={place.place_name}
                                  className="w-full max-h-40 object-cover rounded"
                                  onError={(e) =>
                                    (e.currentTarget.style.display = "none")
                                  }
                                />
                              )}
                              <h3 className="font-semibold text-sm mt-2">
                                {place.place_name}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {place.address}
                              </p>
                              <p className="text-xs mt-1">{place.highlights}</p>
                              <p className="text-xs mt-1">
                                ⭐ {place.review_ratings}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="prose prose-sm text-sm text-muted-foreground">
                          <ReactMarkdown>
                            {message.message as string}
                          </ReactMarkdown>
                        </div>
                      )}
                      {message.agent && (
                        <p className="text-xs text-muted-foreground mt-1">
                          via {message.agent.replace(/_/g, " ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-border/50">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything about your trip..."
                className="flex-1 bg-background/50"
              />
              <Button
                onClick={sendMessage}
                size="icon"
                className="koncii-button"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "Plan a 7-day trip to Japan",
                "Find cheap flights to Europe",
                "What's the weather like in Bali?",
              ].map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="text-xs bg-card/50 hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setInputMessage(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
