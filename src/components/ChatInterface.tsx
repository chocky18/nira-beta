import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "./ChatMessage";
import { FeatureButton } from "./FeatureButton";
import { GrokIcon } from "./GrokIcon";
import { Send, Zap, ImagePlus, Search, Edit, Newspaper, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm a demo chatbot inspired by Grok! I can help you with various tasks like answering questions, creating content, and more. What would you like to explore?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleFeatureClick = (feature: string) => {
    toast({
      title: feature,
      description: `${feature} feature clicked! This is a demo interface.`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <GrokIcon className="text-grok-icon" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Sign up
          </Button>
          <Button variant="outline" size="sm">
            Sign in
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="flex items-center gap-3 mb-8">
              <GrokIcon className="text-grok-icon w-12 h-12" />
              <h1 className="text-4xl font-light text-foreground">Grok</h1>
            </div>

            <div className="w-full max-w-2xl">
              <div className="relative mb-6">
                <Input
                  placeholder="What do you want to know?"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-12 py-6 text-lg border-border bg-input rounded-xl"
                />
                <Button
                  variant="grokSend"
                  size="send"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Feature Buttons */}
              <div className="flex flex-wrap gap-2 justify-center">
                <FeatureButton
                  icon={Zap}
                  label="Fast"
                  onClick={() => handleFeatureClick("Fast")}
                />
                <FeatureButton
                  icon={ImagePlus}
                  label="Create Images"
                  onClick={() => handleFeatureClick("Create Images")}
                />
                <FeatureButton
                  icon={Search}
                  label="Research"
                  onClick={() => handleFeatureClick("Research")}
                />
                <FeatureButton
                  icon={Edit}
                  label="Edit Image"
                  onClick={() => handleFeatureClick("Edit Image")}
                />
                <FeatureButton
                  icon={Newspaper}
                  label="Latest News"
                  onClick={() => handleFeatureClick("Latest News")}
                />
                <FeatureButton
                  icon={Users}
                  label="Personas"
                  onClick={() => handleFeatureClick("Personas")}
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-8 text-center max-w-md">
              By messaging Grok, you agree to our{" "}
              <span className="text-foreground cursor-pointer hover:underline">Terms</span> and{" "}
              <span className="text-foreground cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </div>
        ) : (
          /* Chat Messages */
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <div className="flex gap-3 p-4">
                  <GrokIcon className="text-grok-icon animate-pulse" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">Thinking...</div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border">
              <div className="relative max-w-4xl mx-auto">
                <Input
                  placeholder="Ask Grok anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-12 py-3 border-border bg-input rounded-xl"
                />
                <Button
                  variant="grokSend"
                  size="send"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};