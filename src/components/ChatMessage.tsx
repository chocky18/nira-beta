import { cn } from "@/lib/utils";
import { GrokIcon } from "./GrokIcon";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
}

export const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg",
      isUser ? "ml-12 bg-grok-feature-bg" : "mr-12"
    )}>
      {!isUser && (
        <div className="flex-shrink-0">
          <GrokIcon className="text-grok-icon" />
        </div>
      )}
      
      <div className="flex-1">
        <div className="text-sm text-foreground leading-relaxed">
          {message}
        </div>
        {timestamp && (
          <div className="text-xs text-muted-foreground mt-2">
            {timestamp.toLocaleTimeString()}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
            U
          </div>
        </div>
      )}
    </div>
  );
};