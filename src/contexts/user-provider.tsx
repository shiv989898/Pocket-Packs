"use client"

import type { PokemonCard } from '@/lib/pokemon-data';
import { getInitialCards, getBoosterPack } from '@/lib/pokemon-data';
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  openPack: () => Promise<PokemonCard[] | null>;
  claimDailyReward: () => void;
  lastClaimed: number | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [collection, setCollection] = useState<Collection>({});
  const [currency, setCurrency] = useState(500);
  const [packs, setPacks] = useState(3);
  const [lastClaimed, setLastClaimed] = useState<number | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      const initialCards = await getInitialCards(8);
      const initialCollection: Collection = initialCards.reduce((acc, card) => {
        if(card) {
          acc[card.id] = { card, quantity: Math.floor(Math.random() * 2) + 1 };
        }
        return acc;
      }, {} as Collection);
      setCollection(initialCollection);

      const savedDate = localStorage.getItem('lastClaimed');
      if (savedDate) {
        setLastClaimed(parseInt(savedDate, 10));
      }
    };
    
    initializeUser();
  }, []);


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

  const openPack = async () => {
    if (packs > 0) {
      setPacks(prev => prev - 1);
      const newCards = await getBoosterPack();
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
