import { useState } from 'react';
import { Search, Send, FileText, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  source?: {
    title: string;
    link: string;
  };
}

const mockMessages: Message[] = [
  {
    id: '1',
    type: 'user',
    content: 'What is the difference between ionic and covalent bonds?',
  },
  {
    id: '2',
    type: 'ai',
    content: 'Ionic bonds form when one atom transfers electrons to another, creating oppositely charged ions that attract each other. Covalent bonds form when atoms share electrons. Ionic bonds typically occur between metals and non-metals, while covalent bonds occur between non-metals.',
    source: {
      title: 'Chemistry Notes - Bonding',
      link: '/archive',
    },
  },
];

export function PQHub({ materialName }: { materialName?: string }) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
    };
    
    const newAiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: 'Based on your materials, this topic relates to the fundamental concepts covered in your Chemistry course. The key points are outlined in your uploaded notes from Chapter 4.',
      source: {
        title: 'Organic Chemistry - Chapter 4',
        link: '/archive',
      },
    };
    
    setMessages([...messages, newUserMessage, newAiMessage]);
    setInput('');
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Search className="h-5 w-5 text-accent" />
          PQ Hub - Ask Your Materials
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {materialName ? `Chatting about ${materialName}` : 'Get instant answers from your uploaded study materials'}
        </p>
      </div>
      
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl p-4 ${
                message.type === 'user'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.source && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <a
                    href={message.source.link}
                    className="flex items-center gap-2 text-xs hover:underline"
                  >
                    <FileText className="h-3 w-3" />
                    <span>{message.source.title}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your materials..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="bg-accent hover:bg-accent/90">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
