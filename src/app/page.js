'use client';

import { useEffect } from 'react';
import CinematicSequence from '@/components/story/CinematicSequence';
import HeroTransformation from '@/components/home/HeroTransformation';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import BestSellers from '@/components/home/BestSellers';
import styles from './page.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  
  // Transition background from dark to light
  useEffect(() => {
    // This is a subtle global transition as you leave the cinematic sequence
    ScrollTrigger.create({
      trigger: '#transition-trigger',
      start: 'top center',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        // As you scroll past the dark sequence, fade in the warm ivory body background
        document.body.style.backgroundColor = `rgba(255, 255, 242, ${self.progress})`;
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if(t.vars.trigger === '#transition-trigger') t.kill();
      });
    };
  }, []);

  return (
    <main className={styles.main}>
      <CinematicSequence />
      
      <div id="transition-trigger" className={styles.transitionZone}></div>

      <HeroTransformation />
      
      <FeaturedCollections />
      
      <BestSellers />
    </main>
  );
}
