import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  Calendar, 
  Upload, 
  Plus,
  CheckCircle,
  FolderOpen,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import { ActivityItem } from '@/components/ui/activity-item';
import { UploadModal } from '@/components/archive/UploadModal';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const stats = [
  { 
    title: 'Active Study Plans', 
    value: 4, 
    icon: <BookOpen className="h-6 w-6" />,
    trend: { value: 12, isPositive: true }
  },
  { 
    title: 'Materials Uploaded', 
    value: 24, 
    icon: <FileText className="h-6 w-6" />,
    trend: { value: 8, isPositive: true }
  },
  { 
    title: 'Upcoming Sessions', 
    value: 7, 
    icon: <Calendar className="h-6 w-6" />,
    trend: { value: 3, isPositive: false }
  },
];

const recentActivity = [
  { 
    icon: <Upload className="h-4 w-4" />, 
    title: 'Uploaded Chemistry Notes',
    description: 'Added to Science > Chemistry > Organic', 
    time: '2h ago' 
  },
  { 
    icon: <CheckCircle className="h-4 w-4" />, 
    title: 'Completed Study Session',
    description: 'Linear Algebra - Chapter 3', 
    time: '4h ago' 
  },
  { 
    icon: <FolderOpen className="h-4 w-4" />, 
    title: 'Created New Folder',
    description: 'Mathematics > Calculus II', 
    time: '1d ago' 
  },
  { 
    icon: <Clock className="h-4 w-4" />, 
    title: 'Study Plan Generated',
    description: 'Physics Final Exam Prep', 
    time: '2d ago' 
  },
];

const progressData = [
  { name: 'Mon', sessions: 3, pages: 12 },
  { name: 'Tue', sessions: 5, pages: 18 },
  { name: 'Wed', sessions: 2, pages: 8 },
  { name: 'Thu', sessions: 4, pages: 15 },
  { name: 'Fri', sessions: 6, pages: 24 },
  { name: 'Sat', sessions: 3, pages: 10 },
  { name: 'Sun', sessions: 4, pages: 14 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [level, setLevel] = useState('');
  const [courseName, setCourseName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUploadSubmit = () => {
    if (!level || !courseName || !selectedFile) {
      toast.error('Please select level, enter course name, and choose a file.');
      return;
    }
    toast.success(`Successfully uploaded ${selectedFile.name} to My Library`);
    setUploadOpen(false);
    setLevel('');
    setCourseName('');
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome back, John!</h2>
          <p className="text-muted-foreground">Here's what's happening with your studies</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => setUploadOpen(true)}>
            <Upload className="h-4 w-4" />
            Upload Material
          </Button>
          <UploadModal
            open={uploadOpen}
            onOpenChange={setUploadOpen}
            onSubmit={handleUploadSubmit}
            level={level}
            setLevel={setLevel}
            courseName={courseName}
            setCourseName={setCourseName}
            onFileSelect={(files) => setSelectedFile(files[0] || null)}
          />
          
          <Button 
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => navigate('/study-planner')}
          >
            <Plus className="h-4 w-4" />
            Create Study Plan
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <StatCard 
            key={stat.title} 
            {...stat} 
            className={`animation-delay-${index * 100}`}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Progress Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border shadow-card animate-fade-in">
          <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                  name="Sessions"
                />
                <Line 
                  type="monotone" 
                  dataKey="pages" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))' }}
                  name="Pages Reviewed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-card animate-fade-in">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-1">
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
