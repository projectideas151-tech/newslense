import { Loader2 } from 'lucide-react';

export function FullscreenLoader({ visible, title = 'Analyzing...', description = 'Please wait a moment.' }: { visible: boolean, title?: string, description?: string }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
