import { useState } from 'react';
import { Calendar, Clock, BookOpen, Plus, Upload, Sparkles, Trophy, Target } from 'lucide-react';
import { StudyPlanForm } from '@/components/planner/StudyPlanForm';
import { FragmentCard } from '@/components/planner/FragmentCard';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Fragment {
  id: string;
  title: string;
  summary: string;
  questions: string[];
  isCompleted: boolean;
  date: string;
}

interface StudyPlan {
  id: string;
  courseName: string;
  level: string;
  frequency: string;
  duration: string;
  fragments: Fragment[];
  files?: File[];
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  archived: boolean;
  subject?: string;
}

const generateMockPlan = (courseName: string): Fragment[] => [
  {
    id: '1',
    title: 'Week 1: Introduction & Fundamentals',
    summary: 'Cover the basic concepts and terminology. Understand the historical context and key principles that form the foundation of the subject.',
    questions: [
      'What are the three main principles discussed?',
      'How does this concept relate to real-world applications?',
      'Define the key terms introduced in this section.',
    ],
    isCompleted: true,
    date: 'Jan 15',
  },
  {
    id: '2',
    title: 'Week 2: Core Concepts',
    summary: 'Deep dive into the core mechanisms and processes. Analyze how different components interact and affect outcomes.',
    questions: [
      'Explain the mechanism of the primary process.',
      'What factors influence the rate of reaction?',
      'Compare and contrast the two main approaches.',
    ],
    isCompleted: true,
    date: 'Jan 22',
  },
  {
    id: '3',
    title: 'Week 3: Advanced Topics',
    summary: 'Explore advanced applications and edge cases. Study complex scenarios and their solutions.',
    questions: [
      'How do exceptions to the rule affect outcomes?',
      'Design a solution for the given problem.',
      'What are the limitations of current methods?',
    ],
    isCompleted: false,
    date: 'Jan 29',
  },
  {
    id: '4',
    title: 'Week 4: Practice & Review',
    summary: 'Consolidate learning through practice problems and review sessions. Identify weak areas and reinforce understanding.',
    questions: [
      'Solve the multi-step problem using learned concepts.',
      'Create a summary of key takeaways.',
      'What areas need further study?',
    ],
    isCompleted: false,
    date: 'Feb 5',
  },
];

export default function StudyPlanner() {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreatePlan = (data: { 
    courseName: string; 
    level: string;
    frequency: string; 
    duration: string;
    files: File[];
  }) => {
    const newPlan: StudyPlan = {
      ...data,
      id: `plan-${Date.now()}`,
      fragments: generateMockPlan(data.courseName),
      createdAt: new Date(),
      priority: 'medium',
      archived: false
    };
    setStudyPlans(prev => [...prev, newPlan]);
    setCurrentPlanId(newPlan.id);
    setIsDialogOpen(false);
  };

  // Get current active plan
  const currentPlan = studyPlans.find(plan => plan.id === currentPlanId) || null;

  const handleToggleComplete = (id: string) => {
    setStudyPlans(prev => prev.map(plan => {
      if (plan.id === currentPlanId) {
        return {
          ...plan,
          fragments: plan.fragments.map(f => 
            f.id === id ? { ...f, isCompleted: !f.isCompleted } : f
          ),
        };
      }
      return plan;
    }));
  };

  const handleSaveFragment = (id: string, summary: string, questions: string[]) => {
    setStudyPlans(prev => prev.map(plan => {
      if (plan.id === currentPlanId) {
        return {
          ...plan,
          fragments: plan.fragments.map(f => 
            f.id === id ? { ...f, summary, questions } : f
          ),
        };
      }
      return plan;
    }));
  };

  const completedCount = currentPlan?.fragments.filter(f => f.isCompleted).length || 0;
  const totalCount = currentPlan?.fragments.length || 0;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col space-y-6">
      {/* New Study Plan Button - Only show when study plans exist */}
      {studyPlans.length > 0 && (
        <div className="flex justify-end animate-fade-in">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95">
                <Plus className="h-4 w-4 mr-2" />
                New Study Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-4 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Study Plan</DialogTitle>
                <DialogDescription>
                  Upload your course materials and set your study preferences to generate a personalized plan.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <StudyPlanForm onSubmit={handleCreatePlan} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Filtering Controls */}
      {studyPlans.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[120px]">
            <select className="w-full bg-card border border-border rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-200 hover:border-red-400">
              <option>Filter by Status</option>
              <option>All Plans</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Archived</option>
            </select>
          </div>
          <div className="flex-1 min-w-[120px]">
            <select className="w-full bg-card border border-border rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-200 hover:border-red-400">
              <option>Filter by Subject</option>
              <option>All Subjects</option>
              {Array.from(new Set(studyPlans.map(p => p.subject))).filter(Boolean).map(subject => (
                <option key={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Study Plan Navigation Tabs */}
      {studyPlans.length > 0 && (
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex space-x-2 min-w-max">
            {studyPlans.map(plan => {
              const planCompleted = plan.fragments.filter(f => f.isCompleted).length;
              const planTotal = plan.fragments.length;
              const planProgress = planTotal > 0 ? Math.round((planCompleted / planTotal) * 100) : 0;
              
              return (
                <button
                  key={plan.id}
                  onClick={() => setCurrentPlanId(plan.id)}
                  className={`flex flex-col items-start gap-2 px-5 py-4 rounded-xl border transition-all duration-200 min-w-[200px] ${
                    currentPlanId === plan.id 
                      ? 'border-red-600 bg-red-600/5 shadow-md' 
                      : 'border-border bg-card hover:border-red-400 hover:bg-red-500/5'
                  }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <h3 className={`font-semibold truncate text-base ${
                      currentPlanId === plan.id ? 'text-red-600' : 'text-foreground'
                    }`}>
                      {plan.courseName}
                    </h3>
                  </div>
                  <div className="w-full space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{planProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300"
                        style={{ width: `${planProgress}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {currentPlan ? (
          <div className="w-full space-y-6 animate-fade-in">
            {/* Plan Header */}
            <div className="bg-card rounded-xl p-5 sm:p-6 border border-border shadow-card">
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">{currentPlan.courseName}</h3>
                    {currentPlan.subject && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                        {currentPlan.subject}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {currentPlan.frequency} sessions
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {currentPlan.duration} month(s)
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Created: {currentPlan.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-500/10 text-yellow-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      +50 Points for Completion
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-red-600" />
                      <span className="font-bold">
                        {completedCount}/{totalCount}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      className="p-2 text-muted-foreground hover:text-red-600 rounded-full hover:bg-red-500/5 transition-colors"
                      title="Edit Plan"
                    >
                      ✏️
                    </button>
                    <button 
                      className="p-2 text-muted-foreground hover:text-red-600 rounded-full hover:bg-red-500/5 transition-colors"
                      title="Archive Plan"
                    >
                      📁
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-bold text-red-600">{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2 bg-muted [&>div]:bg-red-600" />
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-5">
                {currentPlan.fragments.map((fragment) => (
                  <div key={fragment.id} className="relative pl-12 sm:pl-14">
                    <div className={`absolute left-2.5 sm:left-4 top-7 w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 transition-colors duration-300 ${
                      fragment.isCompleted ? 'bg-red-600 border-red-600' : 'bg-card border-red-600'
                    }`} />
                    <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">{fragment.date}</div>
                    <FragmentCard
                      {...fragment}
                      onToggleComplete={handleToggleComplete}
                      onSave={handleSaveFragment}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* High-Impact Empty State */
          <div className="max-w-3xl w-full text-center space-y-12 py-12 animate-in fade-in zoom-in duration-700">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-600 text-sm font-bold mb-4 animate-bounce">
                <Sparkles className="h-4 w-4" />
                Boost Your Learning & Earn Rewards
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-tight">
                Turn Your Notes Into A <span className="text-red-600">Perfect Plan</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Upload your course materials and let our AI build your roadmap to academic success. Complete your sessions to earn points and climb the leaderboard!
              </p>
            </div>

            <div className="relative flex flex-col items-center gap-8">

              {/* Central CTA Button */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="group relative h-14 sm:h-20 w-full sm:w-auto px-6 sm:px-12 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-sm sm:text-xl uppercase tracking-widest shadow-2xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap">
                      Start Your Study Journey
                      <Plus className="h-4 w-4 sm:h-6 sm:w-6 transition-transform group-hover:rotate-90" strokeWidth={3} />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Study Plan</DialogTitle>
                    <DialogDescription>
                      Upload your course materials and set your study preferences to generate a personalized plan.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <StudyPlanForm onSubmit={handleCreatePlan} />
                  </div>
                </DialogContent>
              </Dialog>

              {/* Point Value Props */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <Target className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold">Stay Focused</span>
                </div>
                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold">Earn 100+ Points</span>
                </div>
                <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold">AI Optimized</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground font-medium">
                Join 1,000+ students already using Soma Vault planners
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
