'use client';

import type { PokemonCard } from '@/lib/pokemon-data';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PokemonCardProps {
  card: PokemonCard;
  quantity?: number;
}

const rarityColors = {
  'Common': 'border-transparent',
  'Uncommon': 'border-green-400',
  'Rare': 'border-blue-400',
  'Ultra Rare': 'border-purple-500 shadow-lg shadow-purple-500/50',
};

const typeColors: { [key in PokemonCard['type']]: string } = {
    Fire: 'bg-red-500',
    Water: 'bg-blue-500',
    Grass: 'bg-green-500',
    Electric: 'bg-yellow-400 text-black',
    Psychic: 'bg-purple-500',
    Fighting: 'bg-orange-700',
    Colorless: 'bg-gray-400',
    Dragon: 'bg-indigo-600',
};


export function PokemonCardComponent({ card, quantity }: PokemonCardProps) {
  return (
    <Card className={cn("overflow-hidden relative group transition-all duration-300 hover:scale-105 hover:z-10", rarityColors[card.rarity], 'border-4')}>
      <CardContent className="p-0">
        <div className="aspect-[3/4] relative">
          <Image src={card.imageUrl} alt={card.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" data-ai-hint="pokemon art"/>
          {quantity && quantity > 1 && (
            <Badge variant="secondary" className="absolute top-2 right-2 rounded-full h-8 w-8 text-base flex items-center justify-center bg-primary text-primary-foreground border-2 border-background">
              {quantity}
            </Badge>
          )}
        </div>
        <div className="p-2 bg-card/80 backdrop-blur-sm">
            <h3 className="font-bold truncate text-sm">{card.name}</h3>
            <div className="flex items-center justify-between text-xs mt-1">
                <Badge className={cn("text-white", typeColors[card.type])}>{card.type}</Badge>
                <span className="text-muted-foreground">{card.rarity}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
