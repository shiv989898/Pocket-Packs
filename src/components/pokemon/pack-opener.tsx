"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/user-provider';
import type { PokemonCard } from '@/lib/pokemon-data';
import { swordAndShieldEraSets } from '@/lib/pokemon-data';
import { Button } from '@/components/ui/button';
import { PokemonCardComponent } from './pokemon-card';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, Package, Sparkles, ChevronRight, Check } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CardBack = () => (
    <div className="w-full h-full rounded-lg overflow-hidden border-4 border-primary/50 bg-secondary flex items-center justify-center">
        <Image src="https://placehold.co/245x342.png" data-ai-hint="pokemon card back" alt="Card Back" width={245} height={342} className="object-cover" />
    </div>
);


export function PackOpener() {
  const { packs, openPack } = useUser();
  const [isOpening, setIsOpening] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [packContents, setPackContents] = useState<PokemonCard[]>([]);
  const [revealedIndex, setRevealedIndex] = useState<number>(-1);
  const [isClient, setIsClient] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedSetId, setSelectedSetId] = useState<string>(swordAndShieldEraSets[0].id);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOpenPack = () => {
    if (packs > 0 && !isOpening) {
      setIsOpening(true);
      setPackContents([]);
      setRevealedIndex(-1);

      const openPackPromise = openPack(selectedSetId);

      setTimeout(async () => {
        const newCards = await openPackPromise;
        setIsOpening(false);
        if (newCards && newCards.length > 0) {
          setPackContents(newCards);
          setRevealedIndex(0); // Directly show the first card
          setIsRevealing(true);
        } else {
           console.error("Error opening pack: Could not retrieve cards for the selected set. Your pack has not been used.");
        }
      }, 2000); // Shorter animation time
    }
  };
  
  const handleRevealNext = () => {
      if(revealedIndex < packContents.length - 1) {
          setRevealedIndex(prev => prev + 1);
      } else {
          // All cards revealed
          setIsRevealing(false);
          setPackContents([]);
          setRevealedIndex(-1);
      }
  }

  const selectedSet = swordAndShieldEraSets.find(s => s.id === selectedSetId) || swordAndShieldEraSets[0];

  const packAnimationVariants = {
    initial: { scale: 1, rotate: 0 },
    shaking: { 
      rotate: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.5, repeat: 1 }
    },
    opening: { 
      scale: 1.5, 
      rotate: 360,
      transition: { duration: 1, ease: "circIn" }
    },
    hidden: { 
      opacity: 0, 
      scale: 0,
      transition: { duration: 0.5 }
    },
  };

  const cardRevealVariants = {
    hidden: { opacity: 0, x: 100, scale: 0.9, rotateY: -90 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      x: -100,
      scale: 0.9,
      rotateY: 90,
      transition: { duration: 0.4, ease: 'easeIn' },
    },
  };
  
  const renderInitialView = () => (
    <div className="text-center text-muted-foreground flex flex-col items-center">
        <Package className="mx-auto h-24 w-24 mb-4" />
        <p className="text-lg">Select a set and open a pack!</p>
    </div>
  );
  
  const renderRevealingView = () => (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div className="w-full max-w-[250px] aspect-[3/4] mb-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={revealedIndex}
                    variants={cardRevealVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {packContents[revealedIndex] ? (
                        <PokemonCardComponent card={packContents[revealedIndex]} />
                    ) : (
                        <CardBack />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
        <Button onClick={handleRevealNext} size="lg" className="min-w-[200px]">
            {revealedIndex < packContents.length - 1 ? 'Reveal Next' : 'Finish'}
            {revealedIndex < packContents.length - 1 ? <ChevronRight className="ml-2"/> : <Check className="ml-2"/>}
        </Button>
        <div className="text-muted-foreground mt-4 text-sm">
             {revealedIndex > -1 && revealedIndex < packContents.length ? `Card ${revealedIndex + 1} of ${packContents.length}`: 'Pack finished!'}
        </div>
    </div>
  );

  return (
    <div className="relative flex flex-col items-center justify-center p-4 min-h-[70vh] overflow-hidden">
      <Sparkles className="absolute top-10 left-20 h-24 w-24 text-primary/30 animate-pulse" />
      <Sparkles className="absolute bottom-20 right-10 h-32 w-32 text-accent/30 animate-pulse" />

       <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
        <Select value={selectedSetId} onValueChange={(value) => { setSelectedSetId(value); setImageError(false); }} disabled={isOpening || isRevealing}>
            <SelectTrigger className="w-full sm:w-[240px]">
                <SelectValue placeholder="Select a Set" />
            </SelectTrigger>
            <SelectContent>
                {swordAndShieldEraSets.map(set => (
                    <SelectItem key={set.id} value={set.id}>{set.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        <Button onClick={handleOpenPack} disabled={!isClient || isOpening || packs <= 0 || isRevealing} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform w-full sm:w-auto">
          <Gem className="mr-2 h-5 w-5" />
          {isOpening ? 'Opening...' : `Open a Pack (${isClient ? packs : '...'} left)`}
        </Button>
      </div>

      <div className="w-full min-h-[450px] flex items-center justify-center">
        <AnimatePresence>
          {isOpening && (
             <motion.div
              key="pack"
              variants={packAnimationVariants}
              initial="initial"
              animate={["shaking", "opening"]}
              exit="hidden"
            >
              <Image 
                src={imageError ? 'https://placehold.co/250x453.png' : selectedSet.packImageUrl} 
                width={250} 
                height={250} 
                alt={`${selectedSet.name} Booster Pack`} 
                data-ai-hint="pokemon booster"
                className="object-contain"
                onError={() => setImageError(true)}
                unoptimized
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isRevealing && renderRevealingView()}

        {!isOpening && !isRevealing && renderInitialView()}
      </div>
    </div>
  );
}
