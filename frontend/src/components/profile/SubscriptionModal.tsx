import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface SubscriptionPlan {
  name: string;
  price: string;
  features: string[];
  current: boolean;
}

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plans: SubscriptionPlan[];
}

export function SubscriptionModal({
  open,
  onOpenChange,
  plans,
}: SubscriptionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0 max-h-[80vh] overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div>
            <div>
              <DialogTitle className="text-xl font-bold uppercase tracking-tight text-foreground">Subscription</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Manage your academic plan and billing
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 overflow-y-auto max-h-[60vh]">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative flex flex-col transition-all duration-300 ${plan.current ? 'scale-105 z-10' : ''}`}
            >
              {/* Header Tag */}
              <div className={`w-[80%] py-2 px-4 ${plan.name === 'Free' ? 'bg-[#282e3b] text-white' : plan.name === 'PRO' ? 'bg-red-600 text-white' : 'bg-yellow-500 text-black'} font-black text-center uppercase tracking-widest text-xs`}>
                {plan.name}
              </div>

              {/* Main Content Box */}
              <div className="relative border-2 border-foreground dark:border-foreground/50 bg-background/50 p-5 -mt-0.5 flex flex-col">
                {plan.current && (
                  <div className="absolute -top-6 right-0 bg-foreground text-background text-[10px] font-bold px-2 py-1 uppercase">
                    Current Plan
                  </div>
                )}

                <ul className="space-y-3 mb-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="h-4 w-4 rounded-full border border-foreground/20 flex items-center justify-center flex-shrink-0">
                        <Check className="h-2.5 w-2.5 text-red-600" />
                      </div>
                      <span className="text-xs font-medium text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price Box - Overlapping at bottom right */}
                <div className="mt-4 self-end w-fit bg-background border-2 border-foreground dark:border-foreground/80 px-4 py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] sm:absolute sm:-bottom-3 sm:-right-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-foreground">{plan.price.split('/')[0]}</span>
                    {plan.price.includes('/') && (
                      <span className="text-[10px] text-muted-foreground font-bold uppercase italic">/{plan.price.split('/')[1]}</span>
                    )}
                  </div>
                </div>
              </div>

              {!plan.current && (
                <div className="mt-6 border-2 border-foreground dark:border-foreground/50 overflow-hidden">
                  <Button 
                    className="w-full rounded-none h-10 bg-white text-black hover:bg-red-50 font-black uppercase tracking-widest text-[10px]"
                  >
                    {plan.name === 'Free' ? 'Downgrade' : 'Switch Plan'}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
