import { PackOpener } from "@/components/pokemon/pack-opener";

export default function OpenPacksPage() {
  return (
    <div className="container mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Pack Opening Chamber</h1>
        <p className="text-lg text-muted-foreground">
          Ready to see what you've got? Open a booster pack!
        </p>
      </div>
      <PackOpener />
    </div>
  );
}
