// src/components/GenerativeBackground.tsx
'use client';

import { motion, useMotionValue, useTransform, useSpring, MotionValue, useAnimationFrame } from 'framer-motion';
import { useEffect, useState, useMemo, useRef, FC } from 'react';

const NUM_PARTICLES_TOTAL = 50; 
const NUM_LAYERS = 20;          

interface ParticleData {
  id: string;
  layer: number;
  posX: MotionValue<number>; 
  posY: MotionValue<number>;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

interface ParticleLayerProps {
  layerIndex: number;
  particlesInLayer: ParticleData[];
  mouseX: MotionValue<number>; 
  mouseY: MotionValue<number>; 
  numLayers: number;
  containerSize: { width: number; height: number } | null;
}

const BouncingParticle: FC<{ particle: ParticleData, containerSize: { width: number; height: number } | null }> = ({ particle, containerSize }) => {
  const leftStyle = useTransform(particle.posX, value => `${value}%`);
  const topStyle = useTransform(particle.posY, value => `${value}%`);

  useAnimationFrame((_time, delta) => {
    if (!containerSize || containerSize.width === 0 || containerSize.height === 0) return;

    let currentX = particle.posX.get();
    let currentY = particle.posY.get();
    
    const dt = delta / 1000; 

    currentX += particle.vx * dt * 40; 
    currentY += particle.vy * dt * 40; 

    const particleSizePercentW = (particle.size / containerSize.width) * 100;
    const particleSizePercentH = (particle.size / containerSize.height) * 100;
    
    if (currentX <= 0) {
      particle.vx = Math.abs(particle.vx); 
      currentX = 0;
    } else if (currentX >= 100 - particleSizePercentW) {
      particle.vx = -Math.abs(particle.vx); 
      currentX = 100 - particleSizePercentW;
    }

    if (currentY <= 0) {
      particle.vy = Math.abs(particle.vy); 
      currentY = 0;
    } else if (currentY >= 100 - particleSizePercentH) {
      particle.vy = -Math.abs(particle.vy); 
      currentY = 100 - particleSizePercentH;
    }
    
    particle.posX.set(currentX);
    particle.posY.set(currentY);
  });

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: particle.size,
        height: particle.size,
        backgroundColor: particle.color,
        opacity: particle.opacity,
        filter: `drop-shadow(0 0 2px ${particle.color})`,
        left: leftStyle,
        top: topStyle,
      }}
    />
  );
};


const ParticleLayer: FC<ParticleLayerProps> = ({ layerIndex, particlesInLayer, mouseX, mouseY, numLayers, containerSize }) => {
  const parallaxStrengthFactor = (layerIndex + 1) / numLayers; 
  const maxParallaxOffset = 30; 
  const currentLayerMaxOffset = parallaxStrengthFactor * maxParallaxOffset;
  
  const springConfig = { stiffness: 120 + layerIndex * 20, damping: 20 + layerIndex * 5, mass: 0.5 + layerIndex * 0.2 };
  
  const layerTranslateX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [currentLayerMaxOffset, -currentLayerMaxOffset]), 
    springConfig
  );
  const layerTranslateY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [currentLayerMaxOffset, -currentLayerMaxOffset]), 
    springConfig
  );

  return (
    <motion.div
      className="absolute inset-0"
      style={{ 
        translateX: layerTranslateX,
        translateY: layerTranslateY,
      }}
    >
      {particlesInLayer.map((p) => (
        <BouncingParticle key={p.id} particle={p} containerSize={containerSize} />
      ))}
    </motion.div>
  );
};

const GenerativeBackground: FC = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [containerSize, setContainerSize] = useState<{width: number, height: number} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Effect to set hasMounted
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Effect for setting initial container size and ResizeObserver
  useEffect(() => {
    if (!hasMounted) return; // Only run if mounted

    const currentContainerNode = containerRef.current; // Capture ref value
    if (currentContainerNode) {
      // Set initial size once mounted and ref is available
      setContainerSize({
        width: currentContainerNode.offsetWidth,
        height: currentContainerNode.offsetHeight,
      });

      const observer = new ResizeObserver(entries => {
        for (const entry of entries) { // FIX: Changed 'let entry' to 'const entry'
          setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
        }
      });
      observer.observe(currentContainerNode);

      // Cleanup uses the captured ref value
      return () => {
        observer.unobserve(currentContainerNode);
      };
    }
  }, [hasMounted]); // Run when hasMounted changes

  // Effect for mouse listeners
  useEffect(() => {
    if (!hasMounted) return; // Only run if mounted

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) - 0.5;
      const y = (event.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hasMounted, mouseX, mouseY]); // mouseX and mouseY are stable MotionValue objects


  const particlesByLayer = useMemo<ParticleData[][]>(() => {
    if (!hasMounted || !containerSize) return Array.from({ length: NUM_LAYERS }, () => []);

    const allParticles: ParticleData[] = [];
    const particleColors = [
        "rgba(103, 232, 249, 0.7)", 
        "rgba(192, 132, 252, 0.6)", 
        "rgba(226, 232, 240, 0.5)", 
    ];

    for (let i = 0; i < NUM_PARTICLES_TOTAL; i++) {
      const layer = Math.floor(i / (NUM_PARTICLES_TOTAL / NUM_LAYERS)) % NUM_LAYERS;
      let size, opacity, speedFactor;

      switch (layer) {
        case 0: 
          size = Math.random() * 1.5 + 1.0;      
          opacity = Math.random() * 0.3 + 0.2;  
          speedFactor = 0.4; 
          break;
        case 1: 
          size = Math.random() * 2.0 + 1.5;      
          opacity = Math.random() * 0.4 + 0.3;   
          speedFactor = 0.6;
          break;
        case 2: 
        default:
          size = Math.random() * 2.5 + 2.0;      
          opacity = Math.random() * 0.5 + 0.4;  
          speedFactor = 0.8; 
          break;
      }
      
      const angle = Math.random() * 2 * Math.PI; 
      const baseSpeed = 1 + Math.random() * 1.5; 

      allParticles.push({
        id: `p-${layer}-${i}`, layer, 
        posX: new MotionValue(Math.random() * 96 + 2), 
        posY: new MotionValue(Math.random() * 96 + 2),
        vx: Math.cos(angle) * baseSpeed * speedFactor, 
        vy: Math.sin(angle) * baseSpeed * speedFactor,
        size, 
        opacity, 
        color: particleColors[layer % particleColors.length],
      });
    }
    const grouped: ParticleData[][] = Array.from({ length: NUM_LAYERS }, () => []);
    allParticles.forEach(p => {
        if (grouped[p.layer]) { 
            grouped[p.layer].push(p);
        }
    });
    return grouped;
  }, [hasMounted, containerSize]);

  if (!hasMounted || !containerSize) {
    // Render the container div so ref can be attached and size measured
    return <div ref={containerRef} className="absolute inset-0 overflow-hidden z-0 pointer-events-none"></div>;
  }
  
  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {particlesByLayer.map((layerParticles, layerIndex) => (
        <ParticleLayer
          key={`bouncing-parallax-layer-${layerIndex}`}
          layerIndex={layerIndex}
          particlesInLayer={layerParticles}
          mouseX={mouseX}
          mouseY={mouseY}
          numLayers={NUM_LAYERS}
          containerSize={containerSize}
        />
      ))}
    </div>
  );
};

export default GenerativeBackground;