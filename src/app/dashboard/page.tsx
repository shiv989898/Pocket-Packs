'use client';

import Link from 'next/link';
import { useUser } from '@/contexts/user-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, PackageOpen, Layers3, Wallet, Gem, Clock, Star, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { PokemonCard, Rarity } from '@/lib/pokemon-data';
import { PokemonCardComponent } from '@/components/pokemon/pokemon-card';

const rarityOrder: Rarity[] = ['Ultra Rare', 'Rare', 'Uncommon', 'Common'];

export default function DashboardPage() {
  const { collection, currency, packs, claimDailyReward, lastClaimed } = useUser();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { totalCards, uniqueCards, featuredCard } = useMemo(() => {
    const allCards = Object.values(collection);
    const total = allCards.reduce((sum, item) => sum + item.quantity, 0);
    const unique = allCards.length;

    let feature: PokemonCard | null = null;
    if (unique > 0) {
      const cardList = allCards.map(item => item.card);
      for (const rarity of rarityOrder) {
        const card = cardList.find(c => c.rarity === rarity);
        if (card) {
          feature = card;
          break;
        }
      }
      if (!feature) feature = cardList[0];
    }

    return { totalCards: total, uniqueCards: unique, featuredCard: feature };
  }, [collection]);

  const today = new Date().setHours(0, 0, 0, 0);
  const canClaim = isClient && (!lastClaimed || lastClaimed < today);

  const handleClaimReward = () => {
    if (canClaim) {
      claimDailyReward();
      toast({
        title: 'Daily Reward Claimed!',
        description: 'You received 100 currency.',
        action: <Gift className="h-5 w-5 text-primary" />,
      });
    } else {
      toast({
        title: 'Already Claimed',
        description: 'You can claim your next daily reward tomorrow.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-headline tracking-tight">Player Dashboard</h1>
        <p className="text-lg text-muted-foreground">Welcome back! Here's the latest on your collection.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
                <Layers3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isClient ? (
                  <>
                    <div className="text-2xl font-bold">{totalCards}</div>
                    <p className="text-xs text-muted-foreground">{uniqueCards} unique</p>
                  </>
                ) : (
                  <>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Currency</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isClient ? currency.toLocaleString() : <Skeleton className="h-8 w-24" />}</div>
                <p className="text-xs text-muted-foreground">Spend in the Mart</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Booster Packs</CardTitle>
                <Gem className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isClient ? packs : <Skeleton className="h-8 w-12" />}</div>
                <p className="text-xs text-muted-foreground">Ready to open</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-primary/10 border-primary/40">
              <CardHeader>
                <CardTitle>Daily Reward</CardTitle>
                <CardDescription>Log in daily for free currency!</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleClaimReward} disabled={!canClaim} className="w-full">
                  {canClaim ? <><Gift className="mr-2 h-4 w-4" /> Claim 100 Currency</> : <><Clock className="mr-2 h-4 w-4" /> Claimed Today</>}
                </Button>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                 <CardDescription>Jump right into the action.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                 <Button asChild size="lg" variant="secondary">
                   <Link href="/dashboard/open-packs"><PackageOpen className="mr-2 h-4 w-4" /> Open Packs</Link>
                 </Button>
                 <Button asChild size="lg" variant="outline">
                   <Link href="/dashboard/store"><Store className="mr-2 h-4 w-4" /> Go to Mart</Link>
                 </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column (Featured Card) */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col bg-card/80 backdrop-blur-sm sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Star className="text-accent"/> Featured Card</CardTitle>
              <CardDescription>Your rarest or most recent addition.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
              {isClient ? (
                featuredCard ? (
                  <div className="w-full max-w-[250px] mx-auto">
                    <PokemonCardComponent card={featuredCard} />
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground p-8">
                    <h3 className="text-lg font-semibold">Your collection is empty!</h3>
                    <p className="text-sm mb-4">Open some packs to get your first cards.</p>
                    <Button asChild>
                      <Link href="/dashboard/open-packs">Open a Pack</Link>
                    </Button>
                  </div>
                )
              ) : (
                <div className="w-full max-w-[250px] mx-auto">
                  <Skeleton className="aspect-[3/4] w-full" />
                   <Skeleton className="h-6 w-3/4 mt-2" />
                   <Skeleton className="h-4 w-1/2 mt-1" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
