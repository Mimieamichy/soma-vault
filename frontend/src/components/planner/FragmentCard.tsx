import { CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FragmentCardProps {
  id: string;
  title: string;
  summary: string;
  content: string;
  questions: string[];
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  onViewNote: (id: string) => void;
  onViewQuestions: (id: string) => void;
}

export function FragmentCard({ 
  id, 
  title, 
  summary, 
  content,
  questions, 
  isCompleted,
  onToggleComplete,
  onViewNote,
  onViewQuestions,
}: FragmentCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-xl p-5 border shadow-card transition-all duration-200 animate-fade-in",
      isCompleted ? "border-green-300 bg-green-50/50" : "border-border"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onToggleComplete(id)}
            className="transition-colors"
          >
            {isCompleted ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <Circle className="h-6 w-6 text-muted-foreground hover:text-accent" />
            )}
          </button>
          <h4 className={cn(
            "font-semibold",
            isCompleted && "line-through text-muted-foreground"
          )}>
            {title}
          </h4>
        </div>
      </div>

      <div className="mb-4">
        <h5 className="text-sm font-medium text-muted-foreground mb-2">Summary</h5>
        <p className="text-sm text-foreground">{summary}</p>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={() => onViewQuestions(id)}>
          Questions
        </Button>
        <Button variant="outline" size="sm" onClick={() => onViewNote(id)}>
          View Note
        </Button>
      </div>
    </div>
  );
}
