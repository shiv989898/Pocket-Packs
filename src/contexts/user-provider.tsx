"use client"

import type { PokemonCard } from '@/lib/pokemon-data';
import { MOCK_CARDS, getBoosterPack } from '@/lib/pokemon-data';
import React, { createContext, useContext, useState } from 'react';

type Collection = {
  [key: string]: {
    card: PokemonCard;
    quantity: number;
  };
};

interface UserContextType {
  collection: Collection;
  currency: number;
  packs: number;
  addCardsToCollection: (cards: PokemonCard[]) => void;
  setCurrency: (amount: number) => void;
  addPacks: (amount: number) => void;
  openPack: () => PokemonCard[] | null;
  claimDailyReward: () => void;
  lastClaimed: number | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const initialCollection: Collection = MOCK_CARDS.slice(0, 8).reduce((acc, card) => {
  acc[card.id] = { card, quantity: Math.floor(Math.random() * 3) + 1 };
  return acc;
}, {} as Collection);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [collection, setCollection] = useState<Collection>(initialCollection);
  const [currency, setCurrency] = useState(500);
  const [packs, setPacks] = useState(3);
  const [lastClaimed, setLastClaimed] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const savedDate = localStorage.getItem('lastClaimed');
      return savedDate ? parseInt(savedDate, 10) : null;
    }
    return null;
  });

  const addCardsToCollection = (newCards: PokemonCard[]) => {
    setCollection(prev => {
      const updatedCollection = { ...prev };
      newCards.forEach(card => {
        if (updatedCollection[card.id]) {
          updatedCollection[card.id].quantity += 1;
        } else {
          updatedCollection[card.id] = { card, quantity: 1 };
        }
      });
      return updatedCollection;
    });
  };

  const addPacks = (amount: number) => {
    setPacks(prev => prev + amount);
  };

  const openPack = () => {
    if (packs > 0) {
      setPacks(prev => prev - 1);
      const newCards = getBoosterPack();
      addCardsToCollection(newCards);
      return newCards;
    }
    return null;
  };

  const claimDailyReward = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    if (!lastClaimed || lastClaimed < today) {
      setCurrency(prev => prev + 100);
      const now = Date.now();
      setLastClaimed(now);
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastClaimed', now.toString());
      }
    }
  };


  const value = {
    collection,
    currency,
    packs,
    addCardsToCollection,
    setCurrency,
    addPacks,
    openPack,
    claimDailyReward,
    lastClaimed
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
