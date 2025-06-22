
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/contexts/user-provider';
import { PokemonCardComponent } from '@/components/pokemon/pokemon-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { swordAndShieldEraSets, type PokemonCard } from '@/lib/pokemon-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const CardPlaceholder = () => (
  <Card className="border-muted/30 border-2 border-dashed h-full">
    <CardContent className="p-0 h-full flex flex-col bg-muted/20">
      <div className="aspect-[3/4] relative flex items-center justify-center">
        <HelpCircle className="h-16 w-16 text-muted-foreground/50" />
      </div>
      {/* Invisible spacer to match the footer of the real card component */}
      <div className="p-2 space-y-1 mt-auto invisible" aria-hidden="true">
        <h3 className="font-bold truncate text-sm leading-tight">placeholder</h3>
        <div className="flex items-center justify-between text-xs">
          <span>&nbsp;</span>
          <span>&nbsp;</span>
        </div>
      </div>
    </CardContent>
  </Card>
);


export default function BinderPage() {
  const { collection } = useUser();
  const [selectedSetId, setSelectedSetId] = useState<string>(swordAndShieldEraSets[0].id);
  const [allSetCards, setAllSetCards] = useState<PokemonCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSetCards = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/cards/${selectedSetId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch set data');
        }
        const data = await response.json();
        
        // The API can sometimes return duplicates or unsorted data. Let's clean it up.
        const uniqueCards = Array.from(new Map(data.map((card: PokemonCard) => [card.id, card])).values());

        uniqueCards.sort((a: PokemonCard, b: PokemonCard) => {
            const getCardNumber = (id: string) => parseInt(id.split('-')[1] || '0');
            return getCardNumber(a.id) - getCardNumber(b.id);
        });

        setAllSetCards(uniqueCards);
      } catch (error) {
        console.error("Failed to load binder data:", error);
        setAllSetCards([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedSetId) {
      fetchSetCards();
    }
  }, [selectedSetId]);

  const { collectedCount, collectedCardsMap } = useMemo(() => {
    const collected = new Set(Object.keys(collection));
    let count = 0;
    allSetCards.forEach(card => {
      if (collected.has(card.id)) {
        count++;
      }
    });
    return { collectedCount: count, collectedCardsMap: collected };
  }, [allSetCards, collection]);
  
  const selectedSet = swordAndShieldEraSets.find(s => s.id === selectedSetId);
  const completionPercentage = allSetCards.length > 0 ? (collectedCount / allSetCards.length) * 100 : 0;

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold tracking-tight">Collection Binder</h1>
        <p className="text-lg text-muted-foreground">
          Track your progress and see which cards you're missing from each set.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-muted/50 rounded-lg items-center sticky top-0 z-10 backdrop-blur-sm">
        <Select value={selectedSetId} onValueChange={setSelectedSetId}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Select a Set" />
          </SelectTrigger>
          <SelectContent>
            {swordAndShieldEraSets.map(set => (
              <SelectItem key={set.id} value={set.id}>{set.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex-grow w-full">
            <div className="flex justify-between items-center mb-1 text-sm">
                <h3 className="font-semibold">{selectedSet?.name} Completion</h3>
                <p className="font-bold">{collectedCount} / {allSetCards.length} Cards</p>
            </div>
            <Progress value={completionPercentage} className="w-full h-2" />
        </div>
      </div>

      {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, index) => (
              <Skeleton key={index} className="aspect-[3/4] w-full" />
            ))}
          </div>
      ) : allSetCards.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {allSetCards.map((card) => {
            const isCollected = collectedCardsMap.has(card.id);
            if (isCollected) {
              return <PokemonCardComponent key={card.id} card={collection[card.id].card} quantity={collection[card.id].quantity} />;
            } else {
              return <CardPlaceholder key={card.id} />;
            }
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <h2 className="text-2xl font-semibold">Could not load cards for this set.</h2>
          <p>Please try selecting another set or check back later.</p>
        </div>
      )}
    </div>
  );
}
