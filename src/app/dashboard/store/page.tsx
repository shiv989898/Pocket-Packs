'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/user-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Gem, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { swordAndShieldEraSets } from '@/lib/pokemon-data';
import { Skeleton } from '@/components/ui/skeleton';

const packsForSale = [
  {
    id: 'booster_pack_1',
    name: 'Booster Pack',
    description: 'A pack containing 5 cards. Can be opened for any available set.',
    cost: 100,
    amount: 1,
    imageUrl: swordAndShieldEraSets[0].packImageUrl,
    aiHint: 'pokemon booster'
  },
  {
    id: 'collectors_bundle_5',
    name: "Collector's Bundle",
    description: 'A bundle of 5 booster packs at a discount.',
    cost: 450,
    amount: 5,
    imageUrl: swordAndShieldEraSets[2].packImageUrl,
    aiHint: 'pokemon booster bundle'
  },
  {
    id: 'treasure_chest_10',
    name: 'Treasure Chest',
    description: 'A massive chest of 10 booster packs.',
    cost: 900,
    amount: 10,
    imageUrl: swordAndShieldEraSets[4].packImageUrl,
    aiHint: 'pokemon treasure chest'
  },
];

const SafeImage = ({ pack }: { pack: typeof packsForSale[0] }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Image
      src={imageError ? `https://placehold.co/400x400.png` : pack.imageUrl}
      alt={pack.name}
      fill
      className="object-contain"
      data-ai-hint={pack.aiHint}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={() => setImageError(true)}
      unoptimized
    />
  );
};


export default function StorePage() {
  const { currency, setCurrency, addPacks } = useUser();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
        <h1 className="text-4xl font-headline font-bold tracking-tight">The Poké Mart</h1>
        <p className="text-lg text-muted-foreground">
          Spend your hard-earned currency on new booster packs!
        </p>
        <div className="inline-flex items-center justify-center gap-2 mt-4 rounded-full bg-primary/20 px-6 py-2 text-lg font-semibold text-primary-foreground">
          <Gem className="h-6 w-6 text-primary" /> Your Balance: {isClient ? currency.toLocaleString() : <Skeleton className="inline-block h-6 w-16" />}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packsForSale.map(pack => (
          <Card key={pack.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">{pack.name}</CardTitle>
              <CardDescription>{pack.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center p-4">
              <div className="relative w-full h-64 mb-4">
                <SafeImage pack={pack} />
              </div>
              <div className="text-3xl font-bold text-primary flex items-center gap-2">
                <Gem />
                {pack.cost.toLocaleString()}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full text-lg py-6" 
                onClick={() => handlePurchase(pack.cost, pack.amount, pack.name)}
                disabled={!isClient || currency < pack.cost}
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
