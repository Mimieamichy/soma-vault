
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { mockArchiveMaterials, mockArchivePQs, mockLibraryMaterials, mockLibraryPQs } from '@/data/mockData';

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const allMaterials = [
    ...mockArchiveMaterials.map(m => ({ ...m, source: 'Archive', path: '/archive' })),
    ...mockLibraryMaterials.map(m => ({ ...m, source: 'Library', path: '/library' }))
  ];

  const allPQs = [
    ...mockArchivePQs.map(m => ({ ...m, source: 'Archive', path: '/archive' })),
    ...mockLibraryPQs.map(m => ({ ...m, source: 'Library', path: '/library' }))
  ];

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start overflow-hidden rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-56 lg:w-72 xl:w-96 2xl:w-[28rem]"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex whitespace-nowrap truncate">Search materials and past questions...</span>
        <span className="inline-flex lg:hidden whitespace-nowrap truncate">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search materials or past questions..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Materials">
            {allMaterials.map((item) => (
              <CommandItem 
                key={`${item.source}-${item.id}`} 
                onSelect={() => runCommand(() => navigate(item.path))}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">{item.source}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Past Questions">
            {allPQs.map((item) => (
              <CommandItem 
                key={`${item.source}-${item.id}`} 
                onSelect={() => runCommand(() => navigate(item.path))}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">{item.source}</span>
              </CommandItem>
            ))}
          </CommandGroup>

        </CommandList>
      </CommandDialog>
    </>
  );
}
