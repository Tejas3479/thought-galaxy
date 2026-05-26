'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useThoughtStore } from '@/store/thoughtStore';
import * as THREE from 'three';

// Hash function to generate pseudo-random number from string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Generate 3D position based on keyword using spherical coordinates
function generatePosition(keyword: string, radius: number = 10): [number, number, number] {
  const hash = hashString(keyword);
  
  // Use hash to generate theta and phi for spherical coordinates
  const theta = ((hash % 10000) / 10000) * Math.PI * 2;
  const phi = ((Math.floor(hash / 10000) % 10000) / 10000) * Math.PI;
  
  // Convert spherical to Cartesian
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);
  
  return [x, y, z];
}

// Get color based on sentiment
function getSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case 'happy':
      return '#ffd700'; // Gold
    case 'neutral':
      return '#4a90d9'; // Blue
    case 'sad':
      return '#8e44ad'; // Purple
    default:
      return '#ffffff'; // White for auto
  }
}

interface ThoughtStarProps {
  id: string;
  text: string;
  sentiment: string;
  keywords: string[];
  index: number;
}

function ThoughtStar({ id, text, sentiment, keywords, index }: ThoughtStarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const position = useMemo(
    () => generatePosition(keywords[0] || 'void'),
    [keywords]
  );
  const color = getSentimentColor(sentiment);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      const offset = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.5;
      groupRef.current.position.y = position[1] + offset;
    }
  });

  const truncatedText = text.substring(0, 15) + (text.length > 15 ? '...' : '');

  return (
    <group ref={groupRef} position={position}>
      {/* Glowing sphere */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Point light for illumination */}
      <pointLight intensity={0.3} distance={2} color={color} />

      {/* Text label */}
      <Html position={[0, 0.5, 0]} center>
        <div
          style={{
            color: 'white',
            opacity: 0.7,
            fontSize: '10px',
            fontFamily: 'monospace',
            textAlign: 'center',
            pointerEvents: 'none',
            textShadow: '0 0 8px rgba(0, 0, 0, 0.8)',
            whiteSpace: 'nowrap',
            maxWidth: '80px',
          }}
        >
          {truncatedText}
        </div>
      </Html>
    </group>
  );
}

export default function ThoughtStars() {
  const thoughts = useThoughtStore((state) => state.thoughts);

  return (
    <>
      {thoughts.map((thought, index) => (
        <ThoughtStar
          key={thought.id}
          id={thought.id}
          text={thought.text}
          sentiment={thought.sentiment}
          keywords={thought.keywords}
          index={index}
        />
      ))}
    </>
  );
}
