import { useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerformanceMonitor, AdaptiveDpr } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';

interface ParticleFieldProps {
  count?: number;
  colors?: string[];
  speed?: number;
  density?: number;
  complexity?: 'low' | 'medium' | 'high';
  interactivity?: boolean;
  particleSize?: number;
  particleType?: 'point' | 'sphere' | 'custom';
  theme?: 'light' | 'dark' | 'colorful';
  depth?: number;
  className?: string;
  height?: string;
}

// Custom shader material for more advanced particle effects
const CustomPointMaterial = ({ color, size, opacity }) => {
  const material = useRef();
  
  const shader = useMemo(
    () => ({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(color) },
        pointSize: { value: size },
        opacity: { value: opacity }
      },
      vertexShader: `
        uniform float time;
        uniform float pointSize;
        attribute float scale;
        varying vec3 vPosition;
        
        void main() {
          vPosition = position;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = pointSize * scale * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float time;
        uniform float opacity;
        varying vec3 vPosition;
        
        void main() {
          // Create a circular particle with soft edges
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (r > 0.5) discard;
          
          // Add glow effect
          float glow = 1.0 - (r * 2.0);
          glow = pow(glow, 1.5);
          
          // Pulse effect based on time and position
          float pulse = sin(time * 0.5 + vPosition.x * 0.5 + vPosition.y * 0.5 + vPosition.z * 0.5) * 0.15 + 0.85;
          
          gl_FragColor = vec4(color, opacity * glow * pulse);
        }
      `,
    }),
    [color, size, opacity]
  );

  useFrame(({ clock }) => {
    if (material.current) {
      material.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return <shaderMaterial ref={material} attach="material" args={[shader]} transparent />
};

// Interactive particles that respond to mouse movement
function InteractiveParticles({ count, colors, speed, particleSize, particleType, depth = 10 }) {
  const mesh = useRef();
  const mouse = useRef(new THREE.Vector3());
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  
  // Generate particle data
  const [positions, scales, particleColors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const particleColors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * depth;
      positions[i3 + 1] = (Math.random() - 0.5) * depth;
      positions[i3 + 2] = (Math.random() - 0.5) * depth;
      scales[i] = Math.random() * 0.5 + 0.5;
      
      // Assign colors from the colors array
      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
      particleColors[i3] = color.r;
      particleColors[i3 + 1] = color.g;
      particleColors[i3 + 2] = color.b;
    }
    
    return [positions, scales, particleColors];
  }, [count, colors, depth]);
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Animation and interaction
  useFrame(({ clock, mouse: threeMouse }) => {
    if (mesh.current) {
      const time = clock.getElapsedTime();
      const positionArray = mesh.current.geometry.attributes.position.array;
      
      // Update particle positions based on time and mouse
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Base movement
        positionArray[i3] += Math.sin(time * speed + i * 0.1) * 0.01;
        positionArray[i3 + 1] += Math.cos(time * speed + i * 0.1) * 0.01;
        
        // Mouse interaction - particles move away from mouse
        const mouseInfluence = 0.1;
        const dx = positionArray[i3] - mouse.current.x * depth * 0.5;
        const dy = positionArray[i3 + 1] - mouse.current.y * depth * 0.5;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 2) {
          const force = (2 - dist) * 0.05;
          positionArray[i3] += dx * force;
          positionArray[i3 + 1] += dy * force;
        }
        
        // Boundary check - wrap particles around if they go too far
        const halfDepth = depth * 0.5;
        if (positionArray[i3] > halfDepth) positionArray[i3] = -halfDepth;
        if (positionArray[i3] < -halfDepth) positionArray[i3] = halfDepth;
        if (positionArray[i3 + 1] > halfDepth) positionArray[i3 + 1] = -halfDepth;
        if (positionArray[i3 + 1] < -halfDepth) positionArray[i3 + 1] = halfDepth;
        if (positionArray[i3 + 2] > halfDepth) positionArray[i3 + 2] = -halfDepth;
        if (positionArray[i3 + 2] < -halfDepth) positionArray[i3 + 2] = halfDepth;
      }
      
      mesh.current.geometry.attributes.position.needsUpdate = true;
      mesh.current.rotation.y = time * speed * 0.05;
    }
  });
  
  // Render different particle types based on prop
  if (particleType === 'sphere') {
    return (
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <sphereGeometry args={[particleSize * 0.1, 8, 8]} />
        <meshStandardMaterial vertexColors />
      </instancedMesh>
    );
  }
  
  if (particleType === 'custom') {
    return (
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            count={count} 
            array={positions} 
            itemSize={3} 
          />
          <bufferAttribute 
            attach="attributes-scale" 
            count={count} 
            array={scales} 
            itemSize={1} 
          />
          <bufferAttribute 
            attach="attributes-color" 
            count={count} 
            array={particleColors} 
            itemSize={3} 
          />
        </bufferGeometry>
        <CustomPointMaterial color={colors[0]} size={particleSize} opacity={0.8} />
      </points>
    );
  }
  
  // Default: point particles
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-scale" 
          count={count} 
          array={scales} 
          itemSize={1} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={count} 
          array={particleColors} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={particleSize} 
        vertexColors 
        transparent 
        opacity={0.8} 
        sizeAttenuation 
      />
    </points>
  );
}

// Static particles with simpler animation
function StaticParticles({ count, colors, speed, particleSize, depth = 10 }) {
  const mesh = useRef();
  
  const [positions, scales, particleColors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const particleColors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * depth;
      positions[i3 + 1] = (Math.random() - 0.5) * depth;
      positions[i3 + 2] = (Math.random() - 0.5) * depth;
      scales[i] = Math.random() * 0.5 + 0.5;
      
      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
      particleColors[i3] = color.r;
      particleColors[i3 + 1] = color.g;
      particleColors[i3 + 2] = color.b;
    }
    
    return [positions, scales, particleColors];
  }, [count, colors, depth]);
  
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.y = clock.getElapsedTime() * speed * 0.05;
      mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * speed * 0.025) * 0.1;
    }
  });
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-scale" 
          count={count} 
          array={scales} 
          itemSize={1} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={count} 
          array={particleColors} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={particleSize} 
        vertexColors 
        transparent 
        opacity={0.6} 
        sizeAttenuation 
      />
    </points>
  );
}

// Main scene component
function Scene({
  count = 1000,
  colors = ['#ffffff', '#3b82f6', '#34d399', '#f97316'],
  speed = 0.2,
  complexity = 'medium',
  interactivity = true,
  particleSize = 3,
  particleType = 'point',
  theme = 'colorful',
  depth = 10
}) {
  // Adjust particle count based on complexity
  const adjustedCount = useMemo(() => {
    if (complexity === 'low') return Math.floor(count * 0.5);
    if (complexity === 'high') return Math.floor(count * 2);
    return count;
  }, [count, complexity]);
  
  // Get theme colors
  const themeColors = useMemo(() => {
    if (theme === 'light') return ['#ffffff', '#f8fafc', '#e2e8f0'];
    if (theme === 'dark') return ['#1e293b', '#334155', '#475569'];
    return colors; // 'colorful' theme uses the provided colors
  }, [theme, colors]);
  
  // Performance monitoring
  const [dpr, setDpr] = useState(1.5);
  
  return (
    <>
      <PerformanceMonitor
        onIncline={() => setDpr(Math.min(dpr + 0.5, 2))}
        onDecline={() => setDpr(Math.max(dpr - 0.5, 0.5))}
      >
        <AdaptiveDpr pixelated />  
      </PerformanceMonitor>
      
      <color attach="background" args={[theme === 'dark' ? '#0f172a' : 'transparent']} />
      <ambientLight intensity={0.5} />
      
      {/* Main particle systems */}
      {interactivity ? (
        <InteractiveParticles 
          count={adjustedCount}
          colors={themeColors}
          speed={speed}
          particleSize={particleSize}
          particleType={particleType}
          depth={depth}
        />
      ) : (
        <StaticParticles 
          count={adjustedCount}
          colors={themeColors}
          speed={speed}
          particleSize={particleSize}
          depth={depth}
        />
      )}
      
      {/* Add a subtle environment for reflections if using sphere particles */}
      {particleType === 'sphere' && (
        <Environment preset="city" />
      )}
    </>
  );
}

// Main exported component
export default function ParticleField({
  count = 1000,
  colors,
  speed = 0.2,
  density,
  complexity = 'medium',
  interactivity = true,
  particleSize = 3,
  particleType = 'point',
  theme = 'colorful',
  depth = 10,
  className = '',
  height = '400px'
}: ParticleFieldProps) {
  // Calculate density-based count if density is provided
  const finalCount = useMemo(() => {
    if (density) {
      // Calculate based on density per 1000 cubic units
      const volume = depth * depth * depth;
      return Math.floor((volume / 1000) * density * 100);
    }
    return count;
  }, [count, density, depth]);
  
  // Default colors based on theme
  const defaultColors = useMemo(() => {
    if (theme === 'light') return ['#ffffff', '#f8fafc', '#e2e8f0'];
    if (theme === 'dark') return ['#1e293b', '#334155', '#475569'];
    return ['#3b82f6', '#34d399', '#f97316', '#ffffff']; // colorful theme
  }, [theme]);
  
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Scene
          count={finalCount}
          colors={colors || defaultColors}
          speed={speed}
          complexity={complexity}
          interactivity={interactivity}
          particleSize={particleSize}
          particleType={particleType}
          theme={theme}
          depth={depth}
        />
      </Canvas>
    </div>
  );
}