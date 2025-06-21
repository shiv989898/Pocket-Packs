export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare';
export type CardType = 'Fire' | 'Water' | 'Grass' | 'Electric' | 'Psychic' | 'Fighting' | 'Colorless' | 'Dragon' | 'Darkness' | 'Metal' | 'Fairy';

export interface PokemonCard {
  id: string;
  name: string;
  type: CardType;
  rarity: Rarity;
  imageUrl: string;
}

const CURRENT_SET_ID = 'sv2';
const CURRENT_SET_NAME = 'Paldea Evolved';

export const currentSet = {
  id: CURRENT_SET_ID,
  name: CURRENT_SET_NAME,
  packImageUrl: `https://assets.tcgdex.net/en/sv/sv2/logo.png`,
};

const rarityMapping: { [key: string]: Rarity | undefined } = {
  'Common': 'Common',
  'Uncommon': 'Uncommon',
  'Rare': 'Rare',
  'Promo': 'Rare',
  'Double Rare': 'Ultra Rare',
  'Ultra Rare': 'Ultra Rare',
  'Illustration Rare': 'Ultra Rare',
  'Special Illustration Rare': 'Ultra Rare',
  'Hyper Rare': 'Ultra Rare',
  'Secret Rare': 'Ultra Rare',
};

const typeMapping: { [key in string]: CardType | undefined } = {
    'Fire': 'Fire',
    'Water': 'Water',
    'Grass': 'Grass',
    'Lightning': 'Electric',
    'Psychic': 'Psychic',
    'Fighting': 'Fighting',
    'Colorless': 'Colorless',
    'Dragon': 'Dragon',
    'Darkness': 'Darkness',
    'Metal': 'Metal',
    'Fairy': 'Fairy'
};


let allCards: PokemonCard[] = [];
let cardsByRarity: { [key in Rarity]?: PokemonCard[] } = {};

async function initializeCardData() {
  if (allCards.length > 0) return;

  try {
    const response = await fetch(`/api/cards/${currentSet.id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch cards: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    
    const processedCards: PokemonCard[] = data.cards
      .map((apiCard: any): PokemonCard | null => {
        const rarity = apiCard.rarity ? rarityMapping[apiCard.rarity] : undefined;
        const type = (apiCard.types && apiCard.types.length > 0) ? typeMapping[apiCard.types[0]] : undefined;

        if (!rarity || !type || !apiCard.image || apiCard.category !== 'Pokémon') {
          return null;
        }

        return {
          id: apiCard.id,
          name: apiCard.name,
          type: type,
          rarity: rarity,
          imageUrl: `${apiCard.image}/high.webp`,
        };
      })
      .filter((card: PokemonCard | null): card is PokemonCard => card !== null);
      
    allCards = processedCards;
    
    cardsByRarity = { 'Common': [], 'Uncommon': [], 'Rare': [], 'Ultra Rare': [] };
    allCards.forEach(card => {
        if (cardsByRarity[card.rarity]) {
            cardsByRarity[card.rarity]?.push(card);
        }
    });
  } catch (error) {
    console.error("Error initializing card data from TCGdex API:", error);
  }
}

const getRandomCard = (rarity: Rarity): PokemonCard | null => {
  const rarityPool = cardsByRarity[rarity];
  if (!rarityPool || rarityPool.length === 0) {
      const fallbackOrder: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Ultra Rare'];
      for (const fallbackRarity of fallbackOrder) {
          const fallbackPool = cardsByRarity[fallbackRarity];
          if (fallbackPool && fallbackPool.length > 0) {
              return fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
          }
      }
      return null;
  }
  return rarityPool[Math.floor(Math.random() * rarityPool.length)];
};

export const getBoosterPack = async (size: number = 10): Promise<PokemonCard[]> => {
  await initializeCardData();

  if (allCards.length === 0) return [];

  const pack: PokemonCard[] = [];
  
  // 6 Commons
  for (let i = 0; i < 6; i++) {
    const card = getRandomCard('Common');
    if (card) pack.push(card);
  }

  // 3 Uncommons
  for (let i = 0; i < 3; i++) {
    const card = getRandomCard('Uncommon');
    if (card) pack.push(card);
  }

  // 1 Rare or Ultra Rare
  const rareRoll = Math.random();
  if (rareRoll < 0.2) { 
    const card = getRandomCard('Ultra Rare');
    if (card) pack.push(card);
  } else {
    const card = getRandomCard('Rare');
    if (card) pack.push(card);
  }
  
  return pack.filter(Boolean).slice(0, size);
};

export const getInitialCards = async (count: number = 8): Promise<PokemonCard[]> => {
    await initializeCardData();
    if (allCards.length === 0) return [];
    
    const initialCards: PokemonCard[] = [];
    const usedIndices = new Set<number>();
    
    const numToGet = Math.min(count, allCards.length);
    
    while (initialCards.length < numToGet) {
        const randomIndex = Math.floor(Math.random() * allCards.length);
        if (!usedIndices.has(randomIndex)) {
            initialCards.push(allCards[randomIndex]);
            usedIndices.add(randomIndex);
        }
    }
    return initialCards;
};
