'use client';

import Link from 'next/link';
import { useUser } from '@/contexts/user-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, PackageOpen, Layers3, Wallet, Gem, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { collection, currency, packs, claimDailyReward, lastClaimed } = useUser();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const totalCards = Object.values(collection).reduce((sum, item) => sum + item.quantity, 0);
  const uniqueCards = Object.keys(collection).length;

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
        <h1 className="text-4xl font-bold tracking-tight">Welcome to your Dashboard!</h1>
        <p className="text-lg text-muted-foreground">Here's a summary of your collection and progress.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
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
            <div className="text-2xl font-bold">{currency.toLocaleString()}</div>
             <p className="text-xs text-muted-foreground">Spend in the store</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Booster Packs</CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{packs}</div>
             <p className="text-xs text-muted-foreground">Ready to be opened</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/20 border-primary">
          <CardHeader className="pb-2">
            <CardTitle>Daily Reward</CardTitle>
            <CardDescription>Log in daily for free currency!</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleClaimReward} disabled={!canClaim} className="w-full">
              {canClaim ? <><Gift className="mr-2 h-4 w-4" /> Claim 100 Currency</> : <><Clock className="mr-2 h-4 w-4" /> Claimed Today</>}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Open More Packs</CardTitle>
            <CardDescription>Experience the thrill of discovering new cards.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center">
            <Image src="https://placehold.co/400x300.png" alt="Booster pack" width={400} height={300} className="rounded-lg mb-4" data-ai-hint="pokemon cards"/>
            <Button asChild size="lg">
              <Link href="/dashboard/open-packs"><PackageOpen className="mr-2 h-4 w-4" /> Go to Pack Opener</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Browse Your Collection</CardTitle>
            <CardDescription>View, sort, and manage all your collected cards.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center">
             <Image src="https://placehold.co/400x300.png" alt="Card collection" width={400} height={300} className="rounded-lg mb-4" data-ai-hint="card collection"/>
            <Button asChild size="lg">
              <Link href="/dashboard/collection"><Layers3 className="mr-2 h-4 w-4" /> View Collection</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
