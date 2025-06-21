"use client";

import { useState } from 'react';
import { useUser } from '@/contexts/user-provider';
import type { PokemonCard } from '@/lib/pokemon-data';
import { Button } from '@/components/ui/button';
import { PokemonCardComponent } from './pokemon-card';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, Package, Sparkles } from 'lucide-react';
import Image from 'next/image';

export function PackOpener() {
  const { packs, openPack } = useUser();
  const { toast } = useToast();
  const [revealedCards, setRevealedCards] = useState<PokemonCard[]>([]);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenPack = () => {
    if (packs > 0 && !isOpening) {
      setIsOpening(true);
      setRevealedCards([]);

      setTimeout(() => {
        const newCards = openPack();
        if (newCards) {
          setRevealedCards(newCards);
          toast({
            title: "Pack Opened!",
            description: `You got ${newCards.length} new cards!`,
          });
        }
        setIsOpening(false);
      }, 2500); // Duration of the animation
    } else if (packs <= 0) {
      toast({
        title: "No packs left!",
        description: "Visit the store to get more packs.",
        variant: "destructive",
      });
    }
  };

  const packVariants = {
    initial: { scale: 1, rotate: 0 },
    shaking: { 
      rotate: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.5, repeat: 2 }
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

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4 min-h-[60vh] overflow-hidden">
      {/* Background elements for parallax effect */}
      <Sparkles className="absolute top-10 left-20 h-24 w-24 text-primary/30 animate-pulse" />
      <Sparkles className="absolute bottom-20 right-10 h-32 w-32 text-accent/30 animate-pulse" />

      <div className="mb-8">
        <Button onClick={handleOpenPack} disabled={isOpening || packs <= 0} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform">
          <Gem className="mr-2 h-5 w-5" />
          {isOpening ? 'Opening...' : `Open a Pack (${packs} left)`}
        </Button>
      </div>

      <div className="w-full min-h-[450px] flex items-center justify-center">
        <AnimatePresence>
          {isOpening && revealedCards.length === 0 && (
             <motion.div
              key="pack"
              variants={packVariants}
              initial="initial"
              animate={["shaking", "opening"]}
              exit="hidden"
            >
              <Image src="https://placehold.co/300x420.png" width={300} height={420} alt="Booster Pack" data-ai-hint="pokemon pack"/>
            </motion.div>
          )}
        </AnimatePresence>

        {revealedCards.length > 0 && (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
            initial="hidden"
            animate="visible"
            variants={{}}
          >
            {revealedCards.map((card, index) => (
              <motion.div key={`${card.id}-${index}`} custom={index} variants={cardVariants}>
                <PokemonCardComponent card={card} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isOpening && revealedCards.length === 0 && (
          <div className="text-center text-muted-foreground">
            <Package className="mx-auto h-24 w-24 mb-4" />
            <p className="text-lg">Your new cards will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
