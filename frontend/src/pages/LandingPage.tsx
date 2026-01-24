
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeroVisual } from '@/components/landing/HeroVisual';
import logo from '@/assets/logo.png';
import logoDark from '@/assets/logo-darkmode.png';
import { ArrowRight, BookOpen, Brain, Zap, Check, Power } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ModeToggle } from '@/components/mode-toggle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden selection:bg-red-100 selection:text-red-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-transparent supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="inline-block h-8">
              <img src={logo} alt="Soma Vault" className="h-8 w-auto dark:hidden" />
              <img src={logoDark} alt="Soma Vault" className="h-8 w-auto hidden dark:inline" />
            </span>
            <span className="font-bold text-xl tracking-tight text-foreground hidden sm:inline-block">Soma Vault</span>
          </div>
          <nav className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 mr-4">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact Us</a>
            </div>
            
           
              <div className="flex items-center gap-3">
                <Link to="/login" className="hidden sm:inline-block">
                  <span className="text-sm font-medium hover:text-red-600 transition-colors">
                    Log In</span>
                </Link>
                <Link to="/signup">
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full px-6 shadow-lg shadow-red-500/20 transition-all hover:scale-105">
                    Get Started
                  </Button>
                </Link>
              </div>
            
            <ModeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 overflow-hidden">
          {/* Background Decor - Red Gradient to the Left */}
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[80%] bg-red-600/30 blur-[100px] rounded-full  dark:bg-red-900/30 animate-glow" />
          <div className="absolute top-[10%] left-[-5%] w-[40%] h-[50%] bg-red-800/10 blur-[100px] rounded-full  dark:bg-red-950/20 animate-glow [animation-delay:2s]" />
          
          <div className="container px-4 sm:px-8 max-w-screen-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
              
              {/* Text Content */}
              <div className="flex flex-col gap-6 z-10 animate-fade-in text-center md:text-left">
                <div className="inline-flex items-center rounded-full border border-red-100 bg-red-50 px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider text-red-600 w-fit mx-auto md:mx-0 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400">
                  <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  New: AI-Powered Question Answering
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                  Your Academic <br className="hidden lg:block" />
                  <span className="text-red-600 italic">Superpower</span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto md:mx-0 leading-relaxed">
                 Instantly convert notes into personalized daily study plans with quizzes and summaries, while building a self-sustaining community archive for shared academic success.
                </p>
                
                <div className="mt-6">
                  {isAuthenticated ? (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <Link to="/study-planner">
                        <Button size="lg" className="h-14 px-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-lg shadow-xl shadow-red-500/20 w-full sm:w-auto">
                          Go to Study Planner <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      {/* Mobile Combined Auth Button */}
                      <div className="flex sm:hidden items-center justify-center">
                        <div className="relative flex items-center bg-white border-2 border-foreground rounded-full h-14 w-full max-w-[320px] overflow-hidden shadow-lg">
                          {/* Sign In Half */}
                          <Link 
                            to="/login" 
                            className="flex-1 flex items-center justify-center h-full text-black font-black uppercase tracking-widest text-xs pr-4"
                          >
                            Sign In
                          </Link>
                          
                          {/* Power Icon Divider */}
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            <div className="h-10 w-10 rounded-full bg-background border-2 border-foreground flex items-center justify-center shadow-md">
                              <div className="h-7 w-7 rounded-full bg-red-600 flex items-center justify-center">
                                <Power className="h-4 w-4 text-white" strokeWidth={3} />
                              </div>
                            </div>
                          </div>
                          
                          {/* Sign Up Half */}
                          <Link 
                            to="/signup" 
                            className="flex-1 flex items-center justify-center h-full bg-red-600 text-white font-black uppercase tracking-widest text-xs pl-4"
                          >
                            Sign Up
                          </Link>
                        </div>
                      </div>

                      {/* Desktop Separate Auth Buttons */}
                      <div className="hidden sm:flex flex-row gap-4 justify-center md:justify-start">
                        <Link to="/signup">
                          <Button size="lg" className="h-14 px-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-lg shadow-xl shadow-red-500/20 w-full sm:w-auto transition-transform hover:-translate-y-1">
                            Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                        <Link to="/login">
                          <Button variant="outline" size="lg" className="h-14 px-8 rounded-full bg-background border-2 border-muted hover:border-red-200 text-foreground font-semibold text-lg w-full sm:w-auto transition-colors">
                            Log In
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Visual Illustration Container */}
              <div className="relative w-full max-w-[600px] mx-auto">
                 <HeroVisual />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-secondary/30 dark:bg-secondary/10">
          <div className="container px-4 sm:px-8 max-w-screen-2xl">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
                Everything you need to excel
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Soma Vault brings together all your study needs into one cohesive platform designed for high performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<BookOpen className="h-6 w-6 text-red-600" />}
                title="Smart Archive"
                description="Upload and organize your handouts, past questions, and notes in a secure, encrypted digital vault."
              />
              <FeatureCard 
                icon={<Brain className="h-6 w-6 text-red-600" />}
                title="AI Assistance"
                description="Get instant insights from your documents. Our specialized AI understands complex academic materials deeply."
              />
              <FeatureCard 
                icon={<Zap className="h-6 w-6 text-red-600" />}
                title="Study Planner"
                description="Dynamic schedules that adapt to your exam timetable, focus levels, and personal learning goals."
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-background">
          <div className="container px-4 sm:px-8 max-w-screen-2xl">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
                Simple, Transparent Pricing
              </h2>
              <p className="text-muted-foreground text-lg">
                Choose the plan that fits your academic journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <PricingCard
                title="Free"
                price="₦0"
                period="mo"
                features={[
                  "500MB Secure Storage",
                  "Basic AI Content Search",
                  "Standard Planner Tool",
                  "Advanced PDF Q&A",
                ]}
              />
              <PricingCard
                title="Quarterly"
                price="₦1,800"
                period="3mo"
                features={[
                  "5GB High-Speed Storage",
                  "Pro AI Study Assistant",
                  "Full PDF Document Analysis",
                  "Offline Sync Mode",
                ]}
              />
              <PricingCard
                title="Yearly"
                price="₦7,000"
                period="yr"
                features={[
                  "Unlimited Vault Storage",
                  "Ultra-Fast AI Core Engine",
                  "Group Collaboration (Up to 10)",
                  "24/7 Priority Support",
                  "Exclusive Beta Features",
                ]}
                highlighted
              />
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="py-12 border-t border-border bg-card">
        <div className="container px-4 sm:px-8 max-w-screen-2xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="inline-block h-6">
              <img src={logo} alt="Soma Vault" className="h-6 w-auto dark:hidden" />
              <img src={logoDark} alt="Soma Vault" className="h-6 w-auto hidden dark:inline" />
            </span>
            <span className="font-bold text-foreground">Soma Vault</span>
          </div>
          
          <div className="flex gap-8 text-xs font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
                  Contact Us
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                  <DialogTitle>Contact Us</DialogTitle>
                  <DialogDescription>We’re here to help with any questions.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Email</span>
                    <a href="mailto:support@somavault.app" className="text-primary hover:underline">support@somavault.app</a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Phone</span>
                    <a href="tel:+15551234567" className="text-primary hover:underline">+1 (555) 123-4567</a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Hours</span>
                    <span className="text-muted-foreground">Mon–Fri, 9:00–18:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Address</span>
                    <span className="text-muted-foreground">Navy Yard, Lagos</span>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Soma Vault. Engineered for Excellence.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group bg-card p-8 rounded-3xl border border-border/50 hover:border-red-100 dark:hover:border-red-900/30 transition-all hover:shadow-xl hover:shadow-red-500/5 hover:-translate-y-1">
      <div className="mb-6 h-14 w-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}

function PricingCard({
  title,
  price,
  period,
  features,
  highlighted,
}: {
  title: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}) {
  const getHeaderColor = () => {
    if (title === 'Free') return 'bg-[#282e3b] text-white';
    if (title === 'Quarterly') return 'bg-red-600 text-white';
    return 'bg-yellow-500 text-black';
  };

  return (
    <div className={`relative flex flex-col w-full max-w-sm mx-auto transition-all duration-300 ${highlighted ? 'scale-105 z-10' : ''}`}>
      {/* Header Tag */}
      <div className={`w-[70%] py-3 px-6 ${getHeaderColor()} font-black text-center uppercase tracking-[0.2em] text-sm md:text-base`}>
        {title}
      </div>

      {/* Main Content Box */}
      <div className="relative border-2 border-foreground dark:border-foreground/50 bg-card p-6 md:p-8 -mt-0.5">
        <ul className="space-y-4 mb-12">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-4 text-sm md:text-base font-medium text-foreground/90">
              <div className="flex-shrink-0 h-5 w-5 rounded-full border border-foreground/30 flex items-center justify-center">
                <Check className="h-3 w-3 text-red-600" />
              </div>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* Price Box - Overlapping at bottom right */}
        <div className="absolute -bottom-4 -right-2 md:-right-4 bg-background border-2 border-foreground dark:border-foreground/80 px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-black">{price}</span>
            <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-tighter">/{period}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
