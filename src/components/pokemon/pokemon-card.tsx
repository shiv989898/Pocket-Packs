'use client';

import type { PokemonCard, Rarity } from '@/lib/pokemon-data';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Circle, Diamond, Star, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


interface PokemonCardProps {
  card: PokemonCard;
  quantity?: number;
}

const rarityColors = {
  'Common': 'border-muted/30',
  'Uncommon': 'border-secondary',
  'Rare': 'border-accent/70',
  'Ultra Rare': 'border-primary shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-shadow',
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
    Darkness: 'bg-gray-800',
    Metal: 'bg-zinc-500',
    Fairy: 'bg-pink-400',
};

const RarityIcon = ({ rarity }: { rarity: Rarity }) => {
  switch (rarity) {
    case 'Common':
      return <Circle className="h-3 w-3 text-muted-foreground/80" fill="currentColor" />;
    case 'Uncommon':
      return <Diamond className="h-3 w-3 text-secondary-foreground/80" fill="currentColor" />;
    case 'Rare':
      return <Star className="h-4 w-4 text-accent/80" fill="currentColor" />;
    case 'Ultra Rare':
      return <Sparkles className="h-4 w-4 text-primary" fill="currentColor" />;
    default:
      return null;
  }
};


export function PokemonCardComponent({ card, quantity }: PokemonCardProps) {
  return (
    <Card className={cn("overflow-hidden relative group transition-all duration-300 hover:scale-105 hover:z-10", rarityColors[card.rarity], 'border-4')}>
      <CardContent className="p-0">
        <div className="aspect-[3/4] relative">
          <Image src={card.imageUrl} alt={card.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover"/>
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
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <RarityIcon rarity={card.rarity} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{card.rarity}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
