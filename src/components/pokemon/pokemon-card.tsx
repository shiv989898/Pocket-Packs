'use client';

import type { PokemonCard, Rarity } from '@/lib/pokemon-data';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Circle, Diamond, Star, Sparkles,
  Flame, Droplets, Leaf, Zap, BrainCircuit, Mountain, Wind, Skull, Moon, Shield, Sparkle as SparkleIcon
} from 'lucide-react';
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
    Fire: 'text-red-500',
    Water: 'text-blue-500',
    Grass: 'text-green-500',
    Electric: 'text-yellow-400',
    Psychic: 'text-purple-500',
    Fighting: 'text-orange-700',
    Colorless: 'text-gray-400',
    Dragon: 'text-indigo-500',
    Darkness: 'text-gray-300',
    Metal: 'text-zinc-400',
    Fairy: 'text-pink-400',
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

const TypeIcon = ({ type }: { type: CardType }) => {
  const props = { className: cn("h-5 w-5", typeColors[type]), "aria-label": type };
  switch (type) {
    case 'Fire': return <Flame {...props} />;
    case 'Water': return <Droplets {...props} />;
    case 'Grass': return <Leaf {...props} />;
    case 'Electric': return <Zap {...props} />;
    case 'Psychic': return <BrainCircuit {...props} />;
    case 'Fighting': return <Mountain {...props} />;
    case 'Colorless': return <Wind {...props} />;
    case 'Dragon': return <Skull {...props} />;
    case 'Darkness': return <Moon {...props} />;
    case 'Metal': return <Shield {...props} />;
    case 'Fairy': return <SparkleIcon {...props} />;
    default: return null;
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
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <TypeIcon type={card.type} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{card.type}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
