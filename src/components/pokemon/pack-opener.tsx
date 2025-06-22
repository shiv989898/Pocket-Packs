
"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/user-provider';
import type { PokemonCard } from '@/lib/pokemon-data';
import { swordAndShieldEraSets } from '@/lib/pokemon-data';
import { Button } from '@/components/ui/button';
import { PokemonCardComponent } from './pokemon-card';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, Layers, RefreshCw, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const CardBack = () => (
    <div className="w-full h-full rounded-xl overflow-hidden border-4 border-primary/50 bg-secondary flex items-center justify-center cursor-pointer shadow-lg hover:shadow-primary/50 transition-shadow">
        <Image src="https://upload.wikimedia.org/wikipedia/en/3/3b/Pokemon_Trading_Card_Game_cardback.jpg" data-ai-hint="pokemon card back" alt="Card Back" width={245} height={342} className="object-cover" />
    </div>
);

const FlippableCard = ({ card, isFlipped, onFlip }: { card: PokemonCard; isFlipped: boolean; onFlip: () => void; }) => {
  return (
    <div
      className="w-full h-full cursor-pointer"
      style={{ perspective: 1000 }}
      onClick={onFlip}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Card Front (visible after flip) */}
        <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <PokemonCardComponent card={card} />
        </div>
        {/* Card Back (visible initially) */}
        <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
          <CardBack />
        </div>
      </motion.div>
    </div>
  );
};


export function PackOpener() {
  const { packs, openPack } = useUser();
  const [packState, setPackState] = useState<'idle' | 'opening' | 'revealing' | 'finished'>('idle');
  const [packContents, setPackContents] = useState<PokemonCard[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [isClient, setIsClient] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedSetId, setSelectedSetId] = useState<string>(swordAndShieldEraSets[0].id);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOpenPack = async () => {
    if (packs > 0 && packState === 'idle') {
      setPackState('opening');
      const newCards = await openPack(selectedSetId);
      
      setTimeout(() => {
        if (newCards && newCards.length > 0) {
          const rarityOrder: Record<PokemonCard['rarity'], number> = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Ultra Rare': 4 };
          // Sort so commons are first, then uncommons, with the rare/ultra rare last.
          const sortedCards = newCards.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
          setPackContents(sortedCards);
          setPackState('revealing');
        } else {
           console.error("Error opening pack: Could not retrieve cards. Your pack may not have been used.");
           setPackState('idle');
        }
      }, 1500);
    }
  };

  const handleFlip = () => {
    if (packState !== 'revealing' || isFlipped) return;
    setIsFlipped(true);
  };

  const handleNextCard = () => {
    if (revealedCount < packContents.length - 1) {
        setRevealedCount(prev => prev + 1);
        setIsFlipped(false);
    } else {
        setPackState('finished');
    }
  };

  const handleReset = () => {
    setPackState('idle');
    setPackContents([]);
    setRevealedCount(0);
    setIsFlipped(false);
  };
  
  const selectedSet = swordAndShieldEraSets.find(s => s.id === selectedSetId) || swordAndShieldEraSets[0];

  const packVariants = {
    initial: { scale: 1, rotate: 0 },
    shaking: { 
      rotate: [0, -2, 2, -2, 2, 0],
      transition: { duration: 0.4 }
    },
    opening: { 
      scale: [1, 1.2, 0], 
      rotate: [0, 0, 180],
      opacity: [1, 1, 0],
      transition: { duration: 1, ease: "circOut", delay: 0.5 }
    },
  };

  const cardToShow = packContents[revealedCount];

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <AnimatePresence>
        {packState === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 flex flex-col sm:flex-row items-center gap-4 z-10"
          >
            <Select value={selectedSetId} onValueChange={(value) => { setSelectedSetId(value); setImageError(false); }}>
                <SelectTrigger className="w-full sm:w-[240px]">
                    <SelectValue placeholder="Select a Set" />
                </SelectTrigger>
                <SelectContent>
                    {swordAndShieldEraSets.map(set => (
                        <SelectItem key={set.id} value={set.id}>{set.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button onClick={handleOpenPack} disabled={!isClient || packs <= 0} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform w-full sm:w-auto">
              <Gem className="mr-2 h-5 w-5" />
              {`Open Pack (${isClient ? packs : '...'} left)`}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full flex-grow min-h-[60vh] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {packState === 'idle' && (
            <motion.div
              key="pack"
              whileHover="shaking"
              variants={packVariants}
              onClick={handleOpenPack}
              className="cursor-pointer"
              transition={{ duration: 0.5 }}
            >
              <Image 
                src={imageError ? 'https://placehold.co/250x453.png' : selectedSet.packImageUrl} 
                width={250} 
                height={453}
                alt={`${selectedSet.name} Booster Pack`} 
                data-ai-hint="pokemon booster"
                className="object-contain drop-shadow-2xl"
                onError={() => setImageError(true)}
                unoptimized
              />
            </motion.div>
          )}

          {packState === 'opening' && (
             <motion.div
              key="openingPack"
              variants={packVariants}
              initial="initial"
              animate="opening"
              className="z-20"
            >
              <Image 
                src={imageError ? 'https://placehold.co/250x453.png' : selectedSet.packImageUrl} 
                width={250} 
                height={453} 
                alt={`${selectedSet.name} Booster Pack`} 
                data-ai-hint="pokemon booster"
                className="object-contain drop-shadow-2xl"
                onError={() => setImageError(true)}
                unoptimized
              />
            </motion.div>
          )}

          {packState === 'revealing' && cardToShow && (
            <motion.div
              key="card-reveal-area"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center"
            >
              <p className={cn(
                  "text-lg font-semibold text-muted-foreground mb-4 transition-colors duration-300",
                  isFlipped && cardToShow.rarity === 'Ultra Rare' && 'text-primary',
                  isFlipped && cardToShow.rarity === 'Rare' && 'text-accent'
              )}>
                  {revealedCount + 1} / {packContents.length}
              </p>

              <div className="w-[240px] h-[335px] sm:w-[260px] sm:h-[363px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={revealedCount}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                    >
                        <FlippableCard
                            card={cardToShow}
                            isFlipped={isFlipped}
                            onFlip={handleFlip}
                        />
                    </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-6 h-11">
                <AnimatePresence>
                    {isFlipped && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Button onClick={handleNextCard} size="lg">
                                {revealedCount < packContents.length - 1 ? (
                                    <>Next Card <ArrowRight className="ml-2" /></>
                                ) : 'Finish'}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {packState === 'finished' && (
            <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <h2 className="text-2xl font-bold mb-2">Collection Updated!</h2>
                <p className="text-muted-foreground mb-6">You've added 5 new cards to your collection.</p>
                <Button onClick={handleReset} size="lg">
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Open Another
                </Button>
            </motion.div>
          )}

          {(packState === 'idle' && packs === 0 && isClient) && (
              <div className="text-center text-muted-foreground">
                  <Layers className="mx-auto h-24 w-24 mb-4" />
                  <h2 className="text-2xl font-semibold">No Packs Left!</h2>
                  <p>Visit the store to get more booster packs.</p>
              </div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
