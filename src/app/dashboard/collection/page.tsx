'use client';

import { useState } from 'react';
import { useUser } from '@/contexts/user-provider';
import { PokemonCardComponent } from '@/components/pokemon/pokemon-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Info } from 'lucide-react';
import type { CardType, Rarity } from '@/lib/pokemon-data';

const cardTypes: CardType[] = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Fighting', 'Colorless', 'Dragon'];
const rarities: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Ultra Rare'];

export default function CollectionPage() {
  const { collection } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');

  const filteredCollection = Object.values(collection).filter(({ card }) => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || card.type === selectedType;
    const matchesRarity = selectedRarity === 'all' || card.rarity === selectedRarity;
    return matchesSearch && matchesType && matchesRarity;
  }).sort((a, b) => a.card.name.localeCompare(b.card.name));

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Your Card Collection</h1>
        <p className="text-lg text-muted-foreground">
          Browse, search, and admire your hard-earned cards.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8 p-4 bg-muted/50 rounded-lg">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {cardTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedRarity} onValueChange={setSelectedRarity}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Rarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rarities</SelectItem>
            {rarities.map(rarity => (
              <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredCollection.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredCollection.map(({ card, quantity }) => (
            <PokemonCardComponent key={card.id} card={card} quantity={quantity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Info className="mx-auto h-16 w-16 mb-4" />
          <h2 className="text-2xl font-semibold">No cards match your search.</h2>
          <p>Try adjusting your filters or open more packs to grow your collection!</p>
        </div>
      )}
    </div>
  );
}
