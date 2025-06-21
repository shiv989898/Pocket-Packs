export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare';
export type CardType = 'Fire' | 'Water' | 'Grass' | 'Electric' | 'Psychic' | 'Fighting' | 'Colorless' | 'Dragon' | 'Darkness' | 'Metal' | 'Fairy';

export interface PokemonCard {
  id: string;
  name: string;
  type: CardType;
  rarity: Rarity;
  imageUrl: string;
}

export interface SetInfo {
  id: string;
  name: string;
  series: string;
  packImageUrl: string;
}

export const swordAndShieldEraSets: SetInfo[] = [
  { id: 'swsh1', name: 'Sword & Shield', series: 'Sword & Shield', packImageUrl: 'https://images.pokemontcg.io/swsh1/logo.png' },
  { id: 'swsh2', name: 'Rebel Clash', series: 'Sword & Shield', packImageUrl: 'https://images.pokemontcg.io/swsh2/logo.png' },
  { id: 'swsh3', name: 'Darkness Ablaze', series: 'Sword & Shield', packImageUrl: 'https://images.pokemontcg.io/swsh3/logo.png' },
  { id: 'swsh4', name: 'Vivid Voltage', series: 'Sword & Shield', packImageUrl: 'https://images.pokemontcg.io/swsh4/logo.png' },
  { id: 'swsh5', name: 'Battle Styles', series: 'Sword & Shield', packImageUrl: 'https://images.pokemontcg.io/swsh5/logo.png' },
];

const rarityMapping: { [key: string]: Rarity | undefined } = {
  // Common
  'Common': 'Common',

  // Uncommon
  'Uncommon': 'Uncommon',

  // Rare
  'Rare': 'Rare',
  'Rare Holo': 'Rare',
  'Promo': 'Rare', // Promos can vary, but this is a safe bucket

  // Ultra Rare - this bucket includes various special and high-value rarities
  'Rare Holo V': 'Ultra Rare',
  'Rare Holo VMAX': 'Ultra Rare',
  'Rare Holo VSTAR': 'Ultra Rare',
  'Rare Holo GX': 'Ultra Rare',
  'Rare Holo EX': 'Ultra Rare',
  'Double Rare': 'Ultra Rare',
  'Triple Rare': 'Ultra Rare',
  'Amazing Rare': 'Ultra Rare',
  'Illustration Rare': 'Ultra Rare',
  'Special Illustration Rare': 'Ultra Rare',
  'Ultra Rare': 'Ultra Rare',
  'Secret Rare': 'Ultra Rare',
  'Rare Secret': 'Ultra Rare',
  'Hyper Rare': 'Ultra Rare',
  'Rare Rainbow': 'Ultra Rare', // Often used for Hyper Rares
  'Shiny Rare': 'Ultra Rare',
  'Shiny Holo Rare': 'Ultra Rare',
  'Radiant Rare': 'Ultra Rare',
  'Rare BREAK': 'Ultra Rare',
  'Rare Prism Star': 'Ultra Rare',
  'Rare Prime': 'Ultra Rare',
  'LEGEND': 'Ultra Rare',
  'Rare ACE': 'Ultra Rare',
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

type CardData = {
  allCards: PokemonCard[];
  cardsByRarity: { [key in Rarity]?: PokemonCard[] };
};

const cardDataCache = new Map<string, CardData>();

async function initializeCardData(setId: string): Promise<CardData | null> {
  if (cardDataCache.has(setId)) {
    return cardDataCache.get(setId)!;
  }

  try {
    const response = await fetch(`/api/cards/${setId}`);
    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Error fetching card data for set ${setId} via proxy:`, response.status, errorBody);
        throw new Error(`Failed to fetch cards: ${response.status} ${errorBody}`);
    }
    const apiResponse = await response.json();
    const rawCards = Array.isArray(apiResponse) ? apiResponse : apiResponse.data;
    
    const processedCards: PokemonCard[] = rawCards
      .map((apiCard: any): PokemonCard | null => {
        const rarity = apiCard.rarity ? rarityMapping[apiCard.rarity] : undefined;
        const isPokemon = apiCard.supertype === 'Pokémon';
        const type = (apiCard.types && apiCard.types.length > 0) ? typeMapping[apiCard.types[0]] : undefined;

        if (!rarity || !type || !apiCard.images?.large || !isPokemon) {
          return null;
        }

        return {
          id: apiCard.id,
          name: apiCard.name,
          type: type,
          rarity: rarity,
          imageUrl: apiCard.images.large,
        };
      })
      .filter((card: PokemonCard | null): card is PokemonCard => card !== null);
      
    const setData: CardData = {
        allCards: processedCards,
        cardsByRarity: { 'Common': [], 'Uncommon': [], 'Rare': [], 'Ultra Rare': [] }
    };

    processedCards.forEach(card => {
        if (setData.cardsByRarity[card.rarity]) {
            setData.cardsByRarity[card.rarity]?.push(card);
        }
    });

    cardDataCache.set(setId, setData);
    return setData;
  } catch (error) {
    console.error(`Error initializing card data for set ${setId}:`, error);
    return null;
  }
}

const getRandomCard = (cardsByRarity: { [key in Rarity]?: PokemonCard[] }, rarity: Rarity): PokemonCard | null => {
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

export const getBoosterPack = async (setId: string, size: number = 5): Promise<PokemonCard[]> => {
  const setData = await initializeCardData(setId);

  if (!setData || setData.allCards.length === 0) return [];

  const pack: PokemonCard[] = [];
  
  // 3 Common cards
  for (let i = 0; i < 3; i++) {
    const card = getRandomCard(setData.cardsByRarity, 'Common');
    if (card) pack.push(card);
  }

  // 1 Uncommon card
  const uncommonCard = getRandomCard(setData.cardsByRarity, 'Uncommon');
  if (uncommonCard) pack.push(uncommonCard);

  // 1 Rare or Ultra Rare card
  const isUltraRare = Math.random() < 0.20; // 20% chance for an Ultra Rare in the rare slot
  const rareSlotCard = getRandomCard(setData.cardsByRarity, isUltraRare ? 'Ultra Rare' : 'Rare');
  if (rareSlotCard) {
    pack.push(rareSlotCard);
  }

  // Ensure pack has 5 cards, backfilling with commons if any slot failed
  while (pack.length < size && setData.cardsByRarity['Common'] && setData.cardsByRarity['Common'].length > 0) {
    const card = getRandomCard(setData.cardsByRarity, 'Common');
    if (card) pack.push(card);
  }
  
  return pack.slice(0, size);
};

export const getInitialCards = async (count: number): Promise<PokemonCard[]> => {
    const defaultSetId = swordAndShieldEraSets[0].id;
    const setData = await initializeCardData(defaultSetId);
    if (!setData || setData.allCards.length === 0) return [];
    
    const initialCards: PokemonCard[] = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * setData.allCards.length);
        initialCards.push(setData.allCards[randomIndex]);
    }
    return initialCards;
}
