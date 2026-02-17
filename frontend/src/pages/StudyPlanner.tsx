import { useEffect, useState } from 'react';
import { Calendar, Clock, BookOpen, Plus, Upload, Sparkles, Trophy, Target } from 'lucide-react';
import { StudyPlanForm } from '@/components/planner/StudyPlanForm';
import { FragmentCard } from '@/components/planner/FragmentCard';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSearchParams } from 'react-router-dom';

interface FragmentQuestion {
  id: string;
  text: string;
  options: string[];
  answer: string;
}

interface Fragment {
  id: string;
  title: string;
  summary: string;
  content: string;
  questions: string[];
  isCompleted: boolean;
  date: string;
  quizQuestions?: FragmentQuestion[];
}

interface StudyPlan {
  id: string;
  group: string;
  title: string;
  level: string;
  studyFrequency: string;
  duration: string;
  startDate: Date;
  fragments: Fragment[];
  files?: File[];
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  archived: boolean;
  subject?: string;
  materialType?: 'notes' | 'pq';
  progressPercentage?: number;
}

export default function StudyPlanner() {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [searchParams] = useSearchParams();
  const materialId = searchParams.get('materialId');
  const [isLoadingCurrentPlan, setIsLoadingCurrentPlan] = useState(false);
  const [activeFragmentId, setActiveFragmentId] = useState<string | null>(null);
  const [activeQuizFragmentId, setActiveQuizFragmentId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setIsLoadingPlans(true);
        const res = await api.get('/studyplan');
        console.log('GET /studyplan response:', res);
        const raw = res.data?.data || res.data || [];
        console.log('GET /studyplan raw payload:', raw);
        if (Array.isArray(raw)) {
          const basePlans: StudyPlan[] = raw.map((p: any) => ({
            id: p.id,
            title: p.title || p.courseTitle || '',
            group: '',
            level: '',
            studyFrequency: '',
            duration: '0',
            startDate: new Date(),
            fragments: [],
            files: [],
            createdAt: new Date(),
            priority: 'medium',
            archived: false,
            subject: undefined,
            materialType: undefined,
          }));
          setStudyPlans(basePlans);
          if (basePlans.length > 0) {
            setCurrentPlanId(basePlans[0].id);
          }
          basePlans.forEach(async (plan) => {
            try {
              const pr = await api.get(`/studyplan/${plan.id}/progress`);
              const pdata = pr.data?.data || pr.data;
              const progressPercentage = Number(pdata?.progressPercentage) || 0;
              setStudyPlans(prev => prev.map(sp => sp.id === plan.id ? { ...sp, progressPercentage } : sp));
            } catch {
              setStudyPlans(prev => prev.map(sp => sp.id === plan.id ? { ...sp, progressPercentage: 0 } : sp));
            }
          });
        }
      } catch (error) {
        console.error('Failed to load study plans:', error);
        toast.error('Could not load your study plans');
      } finally {
        setIsLoadingPlans(false);
      }
    };
    loadPlans();
  }, []);

  useEffect(() => {
    if (materialId) {
      setIsDialogOpen(true);
    }
  }, [materialId]);

  useEffect(() => {
    const plan = studyPlans.find(p => p.id === currentPlanId);
    if (currentPlanId && plan && (!plan.fragments || plan.fragments.length === 0)) {
      loadPlanDetails(currentPlanId);
    }
  }, [currentPlanId, studyPlans]);

  const handleCreatePlan = async (data: { 
    group: string;
    title: string; 
    level: string;
    studyFrequency: string; 
    duration: string;
    startDate: Date;
    materialType: 'notes' | 'pq';
    files: File[];
  }) => {
    setIsGenerating(true);
    try {
      const formData = new FormData();
      if (data.files.length > 0) {
        formData.append('studyPlan', data.files[0]);
      }
      formData.append('title', data.title);
      // Assuming duration is in months, converting to approximate days
      formData.append('totalDays', String(parseInt(data.duration) * 30));
      formData.append('studyFrequency', data.studyFrequency);
      formData.append('startDate', data.startDate.toISOString());
      formData.append('group', data.group);
      formData.append('level', data.level);
      formData.append('materialType', data.materialType);

      const response = await api.post('/studyplan/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('API Response:', response.data);
      toast.success('Study plan generated successfully!');

      // Create a local representation for UI (fallback to mock if API doesn't return plan structure)
      // Ideally we would map response.data to StudyPlan
      const newPlan: StudyPlan = {
        ...data,
        id: response.data?.id || `plan-${Date.now()}`,
        fragments: Array.isArray(response.data?.fragments) ? response.data.fragments : [],
        createdAt: new Date(),
        priority: 'medium',
        archived: false
      };
      setStudyPlans(prev => [...prev, newPlan]);
      setCurrentPlanId(newPlan.id);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to generate study plan:', error);
      toast.error('Failed to generate study plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Get current active plan
  const currentPlan = studyPlans.find(plan => plan.id === currentPlanId) || null;
  const activeFragment = currentPlan?.fragments?.find(f => f.id === activeFragmentId) || null;
  const activeQuizFragment = currentPlan?.fragments?.find(f => f.id === activeQuizFragmentId) || null;

  const handleToggleComplete = (id: string) => {
    const plan = studyPlans.find(p => p.id === currentPlanId);
    const fragment = plan?.fragments?.find(f => f.id === id);
    if (!plan || !fragment) return;
    if (fragment.isCompleted) return;

    setStudyPlans(prev => prev.map(p => {
      if (p.id === currentPlanId) {
        return {
          ...p,
          fragments: p.fragments.map(f => 
            f.id === id ? { ...f, isCompleted: true } : f
          ),
        };
      }
      return p;
    }));

    api.post(`/studyPlan/fragment/${id}/complete`).catch(() => {
      setStudyPlans(prev => prev.map(p => {
        if (p.id === currentPlanId) {
          return {
            ...p,
            fragments: p.fragments.map(f => 
              f.id === id ? { ...f, isCompleted: false } : f
            ),
          };
        }
        return p;
      }));
      toast.error('Failed to update fragment status');
    });
  };

  const loadPlanDetails = async (id: string) => {
    try {
      setIsLoadingCurrentPlan(true);
      const res = await api.get(`/studyplan/${id}`);
      console.log(`GET /studyplan/${id} response:`, res);
      console.log('GET /studyplan/{id} payload:', res.data);
      const p = res.data?.data || res.data || {};
      const studyPlanData = p.studyPlan || {};
      const materialData = p.material || {};

      const fragments: Fragment[] = Array.isArray(p.fragments) ? p.fragments.map((f: any, index: number) => {
        const rawQuestions = Array.isArray(f.questions) ? f.questions : [];
        const quizQuestions: FragmentQuestion[] = rawQuestions.map((q: any) => ({
          id: q.id,
          text: q.text,
          options: Array.isArray(q.options) ? q.options : [],
          answer: q.answer,
        }));
        const qs = quizQuestions.map(q => q.text);

        return {
          id: f.id,
          title: f.title || `Fragment ${f.fragmentNumber ?? index + 1}`,
          summary: f.summary || '',
          content: f.content || '',
          questions: qs,
          isCompleted: Boolean(f.completed),
          date: f.scheduledDate ? new Date(f.scheduledDate).toLocaleDateString() : '',
          quizQuestions,
        };
      }) : [];

      const updated: Partial<StudyPlan> = {};
      if (studyPlanData.title || materialData.title) {
        updated.title = studyPlanData.title || materialData.title;
      }
      if (materialData.group) {
        updated.group = materialData.group;
      }
      if (materialData.level) {
        updated.level = materialData.level;
      }
      if (studyPlanData.studyFrequency) {
        updated.studyFrequency = studyPlanData.studyFrequency;
      }
      if (typeof studyPlanData.totalDays === 'number') {
        const months = Math.round(studyPlanData.totalDays / 30);
        updated.duration = String(months || 1);
      }
      if (studyPlanData.startDate) {
        updated.startDate = new Date(studyPlanData.startDate);
      }
      if (studyPlanData.createdAt) {
        updated.createdAt = new Date(studyPlanData.createdAt);
      }
      updated.fragments = fragments;
      if (materialData.group) {
        updated.subject = materialData.group;
      }
      if (materialData.materialType) {
        updated.materialType = materialData.materialType;
      }

      setStudyPlans(prev => prev.map(plan => plan.id === id ? { ...plan, ...updated } : plan));
    } catch (error) {
      console.error('Failed to load plan details:', error);
      toast.error('Failed to load plan details');
    } finally {
      setIsLoadingCurrentPlan(false);
    }
  };

  const completedCount = currentPlan?.fragments.filter(f => f.isCompleted).length || 0;
  const totalCount = currentPlan?.fragments.length || 0;
  const progressPercent = typeof currentPlan?.progressPercentage === 'number' ? Math.round(currentPlan.progressPercentage) : 0;

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
                <StudyPlanForm 
                  onSubmit={handleCreatePlan} 
                  isLoading={isGenerating} 
                  mode={materialId ? 'fromMaterial' : 'full'}
                />
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
              const planProgress = typeof plan.progressPercentage === 'number' ? Math.round(plan.progressPercentage) : 0;
              
              return (
                <button
                  key={plan.id}
                  onClick={() => {
                    setCurrentPlanId(plan.id);
                    if (!plan.fragments || plan.fragments.length === 0) {
                      loadPlanDetails(plan.id);
                    }
                  }}
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
                      {plan.title}
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
        {isLoadingPlans ? (
          <div className="text-muted-foreground">Loading your study plans...</div>
        ) : currentPlan ? (
          <div className="w-full space-y-6 animate-fade-in">
            {/* Plan Header */}
            <div className="bg-card rounded-xl p-5 sm:p-6 border border-border shadow-card">
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">{currentPlan.title}</h3>
                    {currentPlan.subject && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                        {currentPlan.subject}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {currentPlan.studyFrequency} sessions
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
                <div className="flex flex-wrap items-center gap-3">
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

            {/* Timeline / Note / Questions View */}
            {activeQuizFragment ? (
              <div className="bg-card rounded-xl p-5 sm:p-6 border border-border shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">
                      {activeQuizFragment.date}
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">
                      {activeQuizFragment.title}
                    </h4>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setActiveQuizFragmentId(null);
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                  >
                    Back to plan
                  </Button>
                </div>
                <div className="mt-2 text-sm text-muted-foreground mb-4">
                  Answer the questions for this fragment.
                </div>
                <div className="space-y-4">
                  {(activeQuizFragment.quizQuestions || []).map((q, index) => {
                    const selected = quizAnswers[q.id];
                    const isCorrect = quizSubmitted && selected === q.answer;
                    const isWrong = quizSubmitted && selected && selected !== q.answer;
                    return (
                      <div
                        key={q.id}
                        className="border border-border rounded-lg p-3 space-y-2"
                      >
                        <div className="font-medium text-sm text-foreground">
                          {index + 1}. {q.text}
                        </div>
                        <div className="space-y-1">
                          {q.options.map((option, optIndex) => {
                            const letter = String.fromCharCode(65 + optIndex);
                            const checked = selected === option;
                            return (
                              <label
                                key={option}
                                className="flex items-center gap-2 text-sm cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name={q.id}
                                  value={option}
                                  checked={checked}
                                  onChange={() => {
                                    setQuizAnswers(prev => ({
                                      ...prev,
                                      [q.id]: option,
                                    }));
                                  }}
                                  className="h-3 w-3"
                                />
                                <span className="font-medium">{letter}.</span>
                                <span>{option}</span>
                              </label>
                            );
                          })}
                        </div>
                        {quizSubmitted && (
                          <div className="text-xs mt-1">
                            {isCorrect && (
                              <span className="text-green-600 font-medium">
                                Correct
                              </span>
                            )}
                            {isWrong && (
                              <span className="text-red-600 font-medium">
                                Incorrect. Correct answer: {q.answer}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  {quizSubmitted && activeQuizFragment.quizQuestions && (
                    <div className="text-sm font-semibold">
                      Score:{" "}
                      {Object.values(activeQuizFragment.quizQuestions).filter(
                        q => quizAnswers[q.id] === q.answer
                      ).length}
                      /
                      {activeQuizFragment.quizQuestions.length}
                    </div>
                  )}
                  <Button
                    size="sm"
                    className="ml-auto"
                    onClick={() => setQuizSubmitted(true)}
                    disabled={quizSubmitted}
                  >
                    {quizSubmitted ? 'Submitted' : 'Submit Answers'}
                  </Button>
                </div>
              </div>
            ) : activeFragment ? (
              <div className="bg-card rounded-xl p-5 sm:p-6 border border-border shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">
                      {activeFragment.date}
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">
                      {activeFragment.title}
                    </h4>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveFragmentId(null)}
                  >
                    Back to plan
                  </Button>
                </div>
                <div className="mt-2 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {activeFragment.content || 'No content available for this fragment.'}
                </div>
              </div>
            ) : (
              <div className="relative">
                {isLoadingCurrentPlan && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                    <span className="text-muted-foreground">Loading plan details...</span>
                  </div>
                )}
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
                        onViewNote={(id) => {
                          setActiveQuizFragmentId(null);
                          setActiveFragmentId(id);
                        }}
                        onViewQuestions={(id) => {
                          setActiveFragmentId(null);
                          setActiveQuizFragmentId(id);
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                    <StudyPlanForm 
                      onSubmit={handleCreatePlan} 
                      isLoading={isGenerating} 
                      mode={materialId ? 'fromMaterial' : 'full'}
                    />
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
