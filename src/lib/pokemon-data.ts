export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare';
export type CardType = 'Fire' | 'Water' | 'Grass' | 'Electric' | 'Psychic' | 'Fighting' | 'Colorless' | 'Dragon' | 'Darkness' | 'Metal' | 'Fairy';

export interface PokemonCard {
  id: string;
  name: string;
  type: CardType;
  rarity: Rarity;
  imageUrl: string;
}

const CURRENT_SET_ID = 'swsh1';
const CURRENT_SET_NAME = 'Sword & Shield';

export const currentSet = {
  id: CURRENT_SET_ID,
  name: CURRENT_SET_NAME,
  packImageUrl: `https://assets.tcgdex.net/en/swsh/swsh1/logo.png`,
};

const rarityMapping: { [key: string]: Rarity | undefined } = {
  'Common': 'Common',
  'Uncommon': 'Uncommon',
  'Rare': 'Rare',
  'Promo': 'Rare',
  'Rare Holo': 'Rare',
  'Double Rare': 'Ultra Rare',
  'Ultra Rare': 'Ultra Rare',
  'Illustration Rare': 'Ultra Rare',
  'Special Illustration Rare': 'Ultra Rare',
  'Hyper Rare': 'Ultra Rare',
  'Secret Rare': 'Ultra Rare',
  'Rare Holo V': 'Ultra Rare',
  'Rare Holo VMAX': 'Ultra Rare',
  'Amazing Rare': 'Ultra Rare',
  'Rare Secret': 'Ultra Rare',
  'Shiny Rare': 'Ultra Rare',
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
        const errorBody = await response.text();
        console.error("Error fetching card data via proxy:", response.status, errorBody);
        throw new Error(`Failed to fetch cards: ${response.status}`);
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
    console.error("Error initializing card data:", error);
    // Return empty so the app doesn't crash
  }
}

const getRandomCard = (rarity: Rarity): PokemonCard | null => {
  const rarityPool = cardsByRarity[rarity];
  if (!rarityPool || rarityPool.length === 0) {
      // Fallback if a specific rarity is not available in the set
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

  // 1 Rare slot (with a chance for Ultra Rare)
  const isUltraRare = Math.random() < 0.125; // 12.5% chance
  const rareCard = getRandomCard(isUltraRare ? 'Ultra Rare' : 'Rare');
  if (rareCard) {
    pack.push(rareCard);
  }

  // Ensure pack has `size` cards, fill with commons if needed
  while (pack.length < size) {
    const card = getRandomCard('Common');
    if (card) pack.push(card);
  }

  return pack.slice(0, size);
};

export const getInitialCards = async (count: number): Promise<PokemonCard[]> => {
    await initializeCardData();
    if (allCards.length === 0) return [];
    
    const initialCards: PokemonCard[] = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * allCards.length);
        initialCards.push(allCards[randomIndex]);
    }
    return initialCards;
}
