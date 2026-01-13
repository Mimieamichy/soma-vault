import { useState } from 'react';
import { CheckCircle, Circle, Download, Archive, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FragmentCardProps {
  id: string;
  title: string;
  summary: string;
  questions: string[];
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  onSave: (id: string, summary: string, questions: string[]) => void;
}

export function FragmentCard({ 
  id, 
  title, 
  summary, 
  questions, 
  isCompleted,
  onToggleComplete,
  onSave
}: FragmentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editSummary, setEditSummary] = useState(summary);
  const [editQuestions, setEditQuestions] = useState(questions.join('\n'));

  const handleSave = () => {
    onSave(id, editSummary, editQuestions.split('\n').filter(q => q.trim()));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditSummary(summary);
    setEditQuestions(questions.join('\n'));
    setIsEditing(false);
  };

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
        
        {!isEditing && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Summary
            </label>
            <Textarea
              value={editSummary}
              onChange={(e) => setEditSummary(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Practice Questions (one per line)
            </label>
            <Textarea
              value={editQuestions}
              onChange={(e) => setEditQuestions(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="gap-1">
              <Save className="h-3 w-3" /> Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm" className="gap-1">
              <X className="h-3 w-3" /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h5 className="text-sm font-medium text-muted-foreground mb-2">Summary</h5>
            <p className="text-sm text-foreground">{summary}</p>
          </div>

          <div className="mb-4">
            <h5 className="text-sm font-medium text-muted-foreground mb-2">Practice Questions</h5>
            <ul className="space-y-1">
              {questions.map((question, index) => (
                <li key={index} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-accent font-medium">{index + 1}.</span>
                  {question}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 pt-3 border-t border-border">
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-3 w-3" /> Download
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Archive className="h-3 w-3" /> Save to Archive
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
