import { PackOpener } from "@/components/pokemon/pack-opener";

export default function OpenPacksPage() {
  return (
    <div className="container mx-auto flex flex-col h-full">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-headline font-bold tracking-tight">The Reveal</h1>
        <p className="text-lg text-muted-foreground">
          The suspense is mounting. What treasures await inside?
        </p>
      </div>
      <div className="flex-grow flex items-center justify-center">
         <PackOpener />
      </div>
    </div>
  );
}
