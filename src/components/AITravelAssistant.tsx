import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, Send, Camera, MapPin, Utensils, Clock } from "lucide-react";
import { aiTravelService } from "@/services/aiTravelService";

interface Booking {
  id: number;
  destination: string;
  dates: string;
  status: string;
  image: string;
  hotel: string;
  coordinates: { lat: number; lng: number };
  activities: string[];
  totalCost: number;
  travelers: number;
}

interface AITravelAssistantProps {
  booking: Booking;
}

interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
}

const AITravelAssistant = ({ booking }: AITravelAssistantProps) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      type: 'ai',
      content: 'Hello! I\'m your AI travel assistant. How can I help you plan your next adventure?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const aiSuggestions = [
    {
      icon: <Utensils className="w-5 h-5" />,
      title: "Restaurant Recommendations",
      description: "Find the best local dining spots based on your preferences",
      action: "Get Food Recommendations"
    },
    {
      icon: <Camera className="w-5 h-5" />,
      title: "Photo Opportunities",
      description: "Discover Instagram-worthy spots and photography tips",
      action: "Find Photo Spots"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Hidden Gems",
      description: "Uncover secret locations that locals love",
      action: "Show Hidden Gems"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Optimal Itinerary",
      description: "AI-optimized schedule to maximize your experience",
      action: "Create Itinerary"
    }
  ];

  const quickQuestions = [
    "Plan a weekend trip",
    "Find cheap flights",
    "Best time to visit",
    "Local recommendations"
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      type: 'user',
      content: inputMessage
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiTravelService.sendMessage(inputMessage);
      
      const aiMessage: ChatMessage = {
        type: 'ai',
        content: response.response
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        type: 'ai',
        content: 'Sorry, I\'m having trouble connecting right now. Please try again later.'
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setChatMessages([
      ...chatMessages,
      {
        type: "user",
        content: suggestion.action
      },
      {
        type: "ai",
        content: `Here are my ${suggestion.title.toLowerCase()} for ${booking.destination}...`
      }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* AI Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiSuggestions.map((suggestion, index) => (
          <Card 
            key={index} 
            className="koncii-card cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                  {suggestion.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{suggestion.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {suggestion.description}
                  </p>
                  <Button size="sm" className="koncii-button">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {suggestion.action}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chat Interface */}
      <Card className="koncii-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-primary" />
            AI Travel Chat
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat Messages */}
          <div className="max-h-64 overflow-y-auto space-y-3 p-4 bg-card/30 rounded-lg">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Quick Questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs rounded-full"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about travel..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              disabled={isLoading || !inputMessage.trim()}
              className="koncii-button"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AITravelAssistant;
