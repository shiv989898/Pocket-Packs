export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare';
export type CardType = 'Fire' | 'Water' | 'Grass' | 'Electric' | 'Psychic' | 'Fighting' | 'Colorless' | 'Dragon';

export interface PokemonCard {
  id: string;
  name: string;
  type: CardType;
  rarity: Rarity;
  imageUrl: string;
}

export const MOCK_CARDS: PokemonCard[] = [
  // Commons
  { id: 'pika01', name: 'Pikachu', type: 'Electric', rarity: 'Common', imageUrl: 'https://placehold.co/300x420.png', },
  { id: 'cat01', name: 'Caterpie', type: 'Grass', rarity: 'Common', imageUrl: 'https://placehold.co/300x420.png', },
  { id: 'rat01', name: 'Rattata', type: 'Colorless', rarity: 'Common', imageUrl: 'https://placehold.co/300x420.png', },
  { id: 'magikarp01', name: 'Magikarp', type: 'Water', rarity: 'Common', imageUrl: 'https://placehold.co/300x420.png', },
  { id: 'zubat01', name: 'Zubat', type: 'Psychic', rarity: 'Common', imageUrl: 'https://placehold.co/300x420.png', },
  { id: 'mankey01', name: 'Mankey', type: 'Fighting', rarity: 'Common', imageUrl: 'https://placehold.co/300x420.png', },
  { id: 'weedle01', name: 'Weedle', type: 'Grass', rarity: 'Common', imageUrl: 'https://placehold.co/300x420.png', },
  { id: 'pidgey01', name: 'Pidgey', type: 'Colorless', rarity: 'Common', imageUrl: 'https://placehold.co/300x420.png', },

  // Uncommons
  { id: 'charmeleon01', name: 'Charmeleon', type: 'Fire', rarity: 'Uncommon', imageUrl: 'https://placehold.co/300x420.png', },
  { id: 'ivysaur01', name: 'Ivysaur', type: 'Grass', rarity: 'Uncommon', imageUrl: 'https://placehold.co/300x420.png', },
  { id: 'wartortle01', name: 'Wartortle', type: 'Water', rarity: 'Uncommon', imageUrl: 'https://placehold.co/300x420.png', },
  { id: 'kadabra01', name: 'Kadabra', type: 'Psychic', rarity: 'Uncommon', imageUrl: 'https://placehold.co/300x420.png', },
  { id: 'growlithe01', name: 'Growlithe', type: 'Fire', rarity: 'Uncommon', imageUrl: 'https://placehold.co/300x420.png', },
  
  // Rares
  { id: 'gyarados01', name: 'Gyarados', type: 'Water', rarity: 'Rare', imageUrl: 'https://placehold.co/300x420.png', },
  { id: 'snorlax01', name: 'Snorlax', type: 'Colorless', rarity: 'Rare', imageUrl: 'https://placehold.co/300x420.png', },
  { id: 'alakazam01', name: 'Alakazam', type: 'Psychic', rarity: 'Rare', imageUrl: 'https://placehold.co/300x420.png', },
  { id: 'arcanine01', name: 'Arcanine', type: 'Fire', rarity: 'Rare', imageUrl: 'https://placehold.co/300x420.png', },
  
  // Ultra Rares
  { id: 'charizard01', name: 'Charizard VMAX', type: 'Fire', rarity: 'Ultra Rare', imageUrl: 'https://placehold.co/300x420.png', },
  { id: 'mewtwo01', name: 'Mewtwo EX', type: 'Psychic', rarity: 'Ultra Rare', imageUrl: 'https://placehold.co/300x420.png', },
  { id: 'dragonite01', name: 'Dragonite V', type: 'Dragon', rarity: 'Ultra Rare', imageUrl: 'https://placehold.co/300x420.png', },
  { id: 'blastoise01', name: 'Blastoise GX', type: 'Water', rarity: 'Ultra Rare', imageUrl: 'https://placehold.co/300x420.png', },
];

const cardsByRarity = {
  'Common': MOCK_CARDS.filter(c => c.rarity === 'Common'),
  'Uncommon': MOCK_CARDS.filter(c => c.rarity === 'Uncommon'),
  'Rare': MOCK_CARDS.filter(c => c.rarity === 'Rare'),
  'Ultra Rare': MOCK_CARDS.filter(c => c.rarity === 'Ultra Rare'),
};

const getRandomCard = (rarity: Rarity): PokemonCard => {
  const rarityPool = cardsByRarity[rarity];
  return rarityPool[Math.floor(Math.random() * rarityPool.length)];
};

export const getBoosterPack = (size: number = 10): PokemonCard[] => {
  const pack: PokemonCard[] = [];
  
  // 6 Commons
  for (let i = 0; i < 6; i++) {
    pack.push(getRandomCard('Common'));
  }

  // 3 Uncommons
  for (let i = 0; i < 3; i++) {
    pack.push(getRandomCard('Uncommon'));
  }

  // 1 Rare or Ultra Rare
  const rareRoll = Math.random();
  if (rareRoll < 0.2) { // 20% chance for an Ultra Rare
    pack.push(getRandomCard('Ultra Rare'));
  } else {
    pack.push(getRandomCard('Rare'));
  }

  return pack;
};
