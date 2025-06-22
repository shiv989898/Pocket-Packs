"use client"

import type { PokemonCard } from '@/lib/pokemon-data';
import { getInitialCards, getBoosterPack } from '@/lib/pokemon-data';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore';

export type Collection = {
  [key: string]: {
    card: PokemonCard;
    quantity: number;
  };
};

interface UserData {
  collection: Collection;
  currency: number;
  packs: number;
  lastClaimed: number | null;
  username: string;
}

interface UserContextType extends UserData {
  user: User | null;
  loading: boolean;
  addCardsToCollection: (cards: PokemonCard[]) => Promise<void>;
  setCurrency: (amount: number) => Promise<void>;
  addPacks: (amount: number) => Promise<void>;
  openPack: (setId: string) => Promise<PokemonCard[] | null>;
  claimDailyReward: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      if (pathname.startsWith('/dashboard')) {
        router.push('/');
      }
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setLoading(true);
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data() as UserData);
          } else {
            console.log(`Creating new user profile for ${firebaseUser.uid}...`);
            let initialCollection: Collection = {};
            try {
              const initialCards = await getInitialCards(8);
              initialCollection = initialCards.reduce((acc, card) => {
                if (card) {
                  acc[card.id] = { card, quantity: 1 };
                }
                return acc;
              }, {} as Collection);
               if (initialCards.length === 0) {
                  console.warn("New user received an empty starter deck. The card fetching API might be down.");
              }
            } catch (error) {
              console.error("Failed to fetch initial cards for new user:", error);
            }

            const newUserData: UserData = {
              username: firebaseUser.displayName || 'New User',
              collection: initialCollection,
              currency: 500,
              packs: 3,
              lastClaimed: null,
            };
            await setDoc(userDocRef, newUserData);
            setUserData(newUserData);
            console.log("New user profile created successfully.");
          }
          setUser(firebaseUser);
          if (pathname === '/' || pathname === '/signup') {
            router.push('/dashboard');
          }
        } catch (error) {
            console.error("Error managing user data:", error);
            setUser(null);
            setUserData(null);
        } finally {
            setLoading(false);
        }
      } else {
        setUser(null);
        setUserData(null);
        if (pathname.startsWith('/dashboard')) {
            router.push('/');
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => prev ? { ...prev, ...data } : null);
  };

  const addCardsToCollection = async (newCards: PokemonCard[]) => {
    if (!user || !userData || !db) return;
    
    const collectionUpdates: { [key: string]: any } = {};
    const newCollection = { ...userData.collection };

    newCards.forEach(card => {
      const path = `collection.${card.id}`;
      if (newCollection[card.id]) {
        collectionUpdates[`${path}.quantity`] = increment(1);
        newCollection[card.id].quantity += 1;
      } else {
        collectionUpdates[path] = { card, quantity: 1 };
        newCollection[card.id] = { card, quantity: 1 };
      }
    });

    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, collectionUpdates);
    updateUserData({ collection: newCollection });
  };

  const addPacks = async (amount: number) => {
    if (!user || !db) return;
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { packs: increment(amount) });
    updateUserData({ packs: (userData?.packs ?? 0) + amount });
  };

  const setCurrency = async (amount: number) => {
      if (!user || !db) return;
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { currency: amount });
      updateUserData({ currency: amount });
  };

  const openPack = async (setId: string) => {
    if (!user || !userData || userData.packs <= 0 || !db) return null;
    
    const newCards = await getBoosterPack(setId);
    if (newCards && newCards.length > 0) {
      await addPacks(-1);
      await addCardsToCollection(newCards);
      return newCards;
    }
    return null;
  };

  const claimDailyReward = async () => {
    if (!user || !userData || !db) return;
    const today = new Date().setHours(0, 0, 0, 0);
    if (!userData.lastClaimed || userData.lastClaimed < today) {
      const now = Date.now();
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        currency: increment(100),
        lastClaimed: now,
      });
      updateUserData({
        currency: userData.currency + 100,
        lastClaimed: now,
      });
    }
  };

  const value: UserContextType = {
    user,
    loading,
    collection: userData?.collection ?? {},
    currency: userData?.currency ?? 0,
    packs: userData?.packs ?? 0,
    lastClaimed: userData?.lastClaimed ?? null,
    username: userData?.username ?? '',
    addCardsToCollection,
    setCurrency,
    addPacks,
    openPack,
    claimDailyReward,
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
