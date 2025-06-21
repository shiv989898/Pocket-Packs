'use client';

import { useUser } from '@/contexts/user-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Gem, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

const packsForSale = [
  {
    id: 'standard_pack',
    name: 'Standard Booster Pack',
    description: 'A classic pack containing 10 cards.',
    cost: 100,
    amount: 1,
    imageUrl: 'https://placehold.co/400x420.png',
  },
  {
    id: 'collectors_bundle',
    name: "Collector's Bundle",
    description: 'Get a great deal with 5 booster packs.',
    cost: 450,
    amount: 5,
    imageUrl: 'https://placehold.co/400x420.png',
  },
  {
    id: 'treasure_chest',
    name: 'Treasure Chest',
    description: 'A massive chest of 12 booster packs.',
    cost: 1000,
    amount: 12,
    imageUrl: 'https://placehold.co/400x420.png',
  },
];

export default function StorePage() {
  const { currency, setCurrency, addPacks } = useUser();
  const { toast } = useToast();

  const handlePurchase = (cost: number, amount: number, name: string) => {
    if (currency >= cost) {
      setCurrency(currency - cost);
      addPacks(amount);
      toast({
        title: 'Purchase Successful!',
        description: `You bought ${name} and received ${amount} pack(s).`,
      });
    } else {
      toast({
        title: 'Insufficient Funds',
        description: "You don't have enough currency for this item.",
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">The Poké Mart</h1>
        <p className="text-lg text-muted-foreground">
          Spend your hard-earned currency on new booster packs!
        </p>
        <div className="inline-flex items-center justify-center gap-2 mt-4 rounded-full bg-primary/20 px-6 py-2 text-lg font-semibold text-primary-foreground">
          <Gem className="h-6 w-6 text-primary" /> Your Balance: {currency.toLocaleString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packsForSale.map(pack => (
          <Card key={pack.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">{pack.name}</CardTitle>
              <CardDescription>{pack.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center">
              <Image src={pack.imageUrl} alt={pack.name} width={400} height={420} className="rounded-lg mb-4 object-cover aspect-[1/1.2]" data-ai-hint="pokemon cards"/>
              <div className="text-3xl font-bold text-primary flex items-center gap-2">
                <Gem />
                {pack.cost.toLocaleString()}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full text-lg py-6" 
                onClick={() => handlePurchase(pack.cost, pack.amount, pack.name)}
                disabled={currency < pack.cost}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
