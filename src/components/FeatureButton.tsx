import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
}

export const FeatureButton = ({ icon: Icon, label, onClick, className }: FeatureButtonProps) => {
  return (
    <Button
      variant="grok"
      size="grok"
      onClick={onClick}
      className={cn("flex items-center gap-2 font-normal", className)}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Button>
  );
};