import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export type LoaderProps = {
  children: React.ReactNode;
  className?: string;
  isVisible?: boolean;
};

export const Loader = ({ children, className, isVisible }: LoaderProps) => {
  return (
    <div className={cn('w-full h-full relative', className)}>
      {isVisible && (
        <div className="flex h-full w-full  items-center justify-center absolute gap-2 bg-neutral-900/50 z-20">
          <Loader2 className="animate-spin" />
          <span>Loading...</span>
        </div>
      )}
      {children}
    </div>
  );
};
