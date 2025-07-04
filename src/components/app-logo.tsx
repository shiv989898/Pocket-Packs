import { Gamepad2 } from 'lucide-react';

export function AppLogo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Gamepad2 className="h-8 w-8 text-primary" />
      <h1 className="text-3xl font-bold tracking-tighter text-foreground">
        Pocket Packs
      </h1>
    </div>
  );
}
