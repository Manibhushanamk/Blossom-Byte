'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CinematicSequence.module.css';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 253;
const FRAME_PREFIX = '/lotus-webp/ezgif-frame-';

export default function CinematicSequence() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Preload images efficiently
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages = [];

    // Progressive loading - load all frames for perfectly smooth scroll
    const preloadAll = () => {
      let groupLoaded = 0;
      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        const frameNum = i.toString().padStart(3, '0');
        img.src = `${FRAME_PREFIX}${frameNum}.webp`;
        img.onload = () => {
          loadedImages[i - 1] = img;
          groupLoaded++;
          loadedCount++;
          setProgress(Math.floor((loadedCount / FRAME_COUNT) * 100));
          if (groupLoaded === FRAME_COUNT) {
            setImages([...loadedImages]);
            setIsLoaded(true);
          }
        };
        img.onerror = () => {
          // If a frame fails to load, still count it so we don't hang forever
          groupLoaded++;
          loadedCount++;
          setProgress(Math.floor((loadedCount / FRAME_COUNT) * 100));
          if (groupLoaded === FRAME_COUNT) {
            setImages([...loadedImages]);
            setIsLoaded(true);
          }
        };
      }
    };

    preloadAll();

  }, []);

  // Set up Canvas and ScrollTrigger
  useEffect(() => {
    if (!isLoaded || images.length === 0 || !images[0]) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set initial size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const render = (index) => {
      if (images[index]) {
        // Clear and draw with maintain aspect ratio
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const img = images[index];
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio); // Cover
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;  
        
        ctx.drawImage(img, 0, 0, img.width, img.height,
                      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
      }
    };

    // Draw initial frame
    render(0);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=4000', // 4000px scroll duration for the sequence
        scrub: 1, // Smooth scrubbing
        pin: true,
        onUpdate: (self) => {
          // Calculate frame index
          const frameIndex = Math.min(
            FRAME_COUNT - 1,
            Math.ceil(self.progress * (FRAME_COUNT - 1))
          );
          requestAnimationFrame(() => render(frameIndex));
        },
      }
    });

    // Story Text Animations synchronized with timeline
    const textBlocks = gsap.utils.toArray('.' + styles.storyBlock);
    
    // Block 1: "Life awakens..."
    timeline.to(textBlocks[0], { opacity: 1, y: 0, duration: 0.1 }, 0.1);
    timeline.to(textBlocks[0], { opacity: 0, y: -20, duration: 0.1 }, 0.25);
    
    // Block 2: "Nature grows..."
    timeline.to(textBlocks[1], { opacity: 1, y: 0, duration: 0.1 }, 0.4);
    timeline.to(textBlocks[1], { opacity: 0, y: -20, duration: 0.1 }, 0.6);
    
    // Block 3: "Beauty takes its time..."
    timeline.to(textBlocks[2], { opacity: 1, y: 0, duration: 0.1 }, 0.75);
    timeline.to(textBlocks[2], { opacity: 0, y: -20, duration: 0.1 }, 0.95);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-render current frame based on scroll progress
      const progress = timeline.scrollTrigger ? timeline.scrollTrigger.progress : 0;
      const frameIndex = Math.min(FRAME_COUNT - 1, Math.ceil(progress * (FRAME_COUNT - 1)));
      render(frameIndex);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      timeline.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isLoaded, images]);

  return (
    <div ref={containerRef} className={styles.sequenceContainer}>
      {!isLoaded && (
        <div className={styles.loader}>
          <div className={styles.loaderText}>Awakening Nature {progress}%</div>
        </div>
      )}
      <canvas ref={canvasRef} className={styles.canvas}></canvas>
      
      {/* Story Text Overlays connected to scroll progress */}
      <div className={styles.storyLayer}>
        <div className={`${styles.storyBlock} ${styles.scene1}`}>
          <h2 className={styles.storyHeadline}>Life awakens beneath the surface.</h2>
        </div>
        <div className={`${styles.storyBlock} ${styles.scene2}`}>
          <h2 className={styles.storyHeadline}>Nature grows with patience.</h2>
        </div>
        <div className={`${styles.storyBlock} ${styles.scene3}`}>
          <h2 className={styles.storyHeadline}>Beauty takes its time.</h2>
          <p className={styles.storySub}>And every bloom tells a story.</p>
        </div>
      </div>
    </div>
  );
}
