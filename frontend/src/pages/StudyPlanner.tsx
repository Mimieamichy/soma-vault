import { useState } from 'react';
import { Calendar, Clock, BookOpen } from 'lucide-react';
import { StudyPlanForm } from '@/components/planner/StudyPlanForm';
import { FragmentCard } from '@/components/planner/FragmentCard';
import { Progress } from '@/components/ui/progress';

interface Fragment {
  id: string;
  title: string;
  summary: string;
  questions: string[];
  isCompleted: boolean;
  date: string;
}

interface StudyPlan {
  courseName: string;
  level: string;
  frequency: string;
  duration: string;
  fragments: Fragment[];
  files?: File[];
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
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);

  const handleCreatePlan = (data: { 
    courseName: string; 
    level: string;
    frequency: string; 
    duration: string;
    files: File[];
  }) => {
    setStudyPlan({
      ...data,
      fragments: generateMockPlan(data.courseName),
    });
  };

  const handleToggleComplete = (id: string) => {
    if (!studyPlan) return;
    setStudyPlan({
      ...studyPlan,
      fragments: studyPlan.fragments.map(f => 
        f.id === id ? { ...f, isCompleted: !f.isCompleted } : f
      ),
    });
  };

  const handleSaveFragment = (id: string, summary: string, questions: string[]) => {
    if (!studyPlan) return;
    setStudyPlan({
      ...studyPlan,
      fragments: studyPlan.fragments.map(f => 
        f.id === id ? { ...f, summary, questions } : f
      ),
    });
  };

  const completedCount = studyPlan?.fragments.filter(f => f.isCompleted).length || 0;
  const totalCount = studyPlan?.fragments.length || 0;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Study Planner</h2>
        <p className="text-muted-foreground">Create and manage your personalized study schedules</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <StudyPlanForm onSubmit={handleCreatePlan} />
        </div>

        {/* Plan Display Column */}
        <div className="lg:col-span-2">
          {studyPlan ? (
            <div className="space-y-6">
              {/* Plan Header */}
              <div className="bg-card rounded-xl p-6 border border-border shadow-card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{studyPlan.courseName}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {studyPlan.frequency} sessions
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {studyPlan.duration} month(s)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-accent" />
                    <span className="font-medium">
                      {completedCount}/{totalCount} completed
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-accent">{Math.round(progressPercent)}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-4">
                  {studyPlan.fragments.map((fragment) => (
                    <div key={fragment.id} className="relative pl-14">
                      <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-card border-2 border-accent" />
                      <div className="text-xs text-muted-foreground mb-2">{fragment.date}</div>
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
            <div className="bg-card rounded-xl p-12 border border-border shadow-card text-center">
              <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Study Plan Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Fill out the form to generate a personalized study plan based on your materials and schedule preferences.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
