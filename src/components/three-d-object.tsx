"use client"

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Cylinder, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Robot Head Component
function RobotHead() {
  const headRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 4) * 0.1
    }
  })

  return (
    <group ref={headRef}>
      {/* Head */}
      <Box args={[1.2, 1, 1]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Eyes */}
      <Sphere args={[0.15, 16, 16]} position={[-0.3, 1.6, 0.4]}>
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </Sphere>
      <Sphere args={[0.15, 16, 16]} position={[0.3, 1.6, 0.4]}>
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </Sphere>
      
      {/* Antenna */}
      <Cylinder args={[0.02, 0.02, 0.5]} position={[0, 2.2, 0]}>
        <meshStandardMaterial color="#718096" />
      </Cylinder>
      <Sphere args={[0.08, 16, 16]} position={[0, 2.5, 0]}>
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
      </Sphere>
    </group>
  )
}

// Robot Body Component
function RobotBody() {
  const bodyRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(state.clock.elapsedTime * 6) * 0.05
    }
  })

  return (
    <group ref={bodyRef}>
      {/* Body */}
      <Box args={[1.5, 1.8, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.3} />
      </Box>
      
      {/* Chest Panel */}
      <Box args={[1.2, 0.8, 0.1]} position={[0, 0.2, 0.55]}>
        <meshStandardMaterial color="#1a202c" emissive="#3b82f6" emissiveIntensity={0.2} />
      </Box>
      
      {/* Arms */}
      <Cylinder args={[0.15, 0.15, 1.2]} position={[-1, 0.3, 0]} rotation={[0, 0, Math.PI / 6]}>
        <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.4} />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 1.2]} position={[1, 0.3, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.4} />
      </Cylinder>
      
      {/* Hands */}
      <Box args={[0.3, 0.3, 0.3]} position={[-1.3, -0.2, 0]}>
        <meshStandardMaterial color="#718096" />
      </Box>
      <Box args={[0.3, 0.3, 0.3]} position={[1.3, -0.2, 0]}>
        <meshStandardMaterial color="#718096" />
      </Box>
    </group>
  )
}

// Robot Legs Component
function RobotLegs() {
  return (
    <group>
      {/* Left Leg */}
      <Cylinder args={[0.2, 0.2, 1.5]} position={[-0.4, -1.5, 0]}>
        <meshStandardMaterial color="#2d3748" metalness={0.6} roughness={0.4} />
      </Cylinder>
      
      {/* Right Leg */}
      <Cylinder args={[0.2, 0.2, 1.5]} position={[0.4, -1.5, 0]}>
        <meshStandardMaterial color="#2d3748" metalness={0.6} roughness={0.4} />
      </Cylinder>
      
      {/* Feet */}
      <Box args={[0.4, 0.2, 0.6]} position={[-0.4, -2.3, 0]}>
        <meshStandardMaterial color="#1a202c" />
      </Box>
      <Box args={[0.4, 0.2, 0.6]} position={[0.4, -2.3, 0]}>
        <meshStandardMaterial color="#1a202c" />
      </Box>
    </group>
  )
}

// Working Animation - Keyboard and Screen
function WorkingStation() {
  const screenRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 8) * 0.2
    }
  })

  return (
    <group position={[3, -1, 0]}>
      {/* Laptop Screen */}
      <Box ref={screenRef} args={[2, 1.2, 0.1]} position={[0, 0.5, 0]}>
        <meshStandardMaterial 
          color="#000033" 
          emissive="#0066ff" 
          emissiveIntensity={0.3}
        />
      </Box>
      
      {/* Code Lines on Screen */}
      {Array.from({ length: 5 }, (_, i) => (
        <Box
          key={i}
          args={[1.8, 0.05, 0.01]}
          position={[0, 0.3 - i * 0.15, 0.06]}
        >
          <meshStandardMaterial 
            color={new THREE.Color().setHSL(0.3, 0.8, 0.5 + Math.random() * 0.3)}
            emissive="#00ff00"
            emissiveIntensity={0.5}
          />
        </Box>
      ))}
      
      {/* Keyboard */}
      <Box args={[2.2, 0.1, 0.8]} position={[0, -0.7, 0]}>
        <meshStandardMaterial color="#4a5568" />
      </Box>
      
      {/* Keys */}
      {Array.from({ length: 8 }, (_, i) => (
        <Box
          key={i}
          args={[0.15, 0.02, 0.15]}
          position={[-0.8 + (i % 4) * 0.5, -0.65, -0.2 + Math.floor(i / 4) * 0.4]}
        >
          <meshStandardMaterial color="#718096" />
        </Box>
      ))}
    </group>
  )
}

// Main Robot Component
function WorkingRobot() {
  const robotRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state, delta) => {
    if (robotRef.current) {
      robotRef.current.rotation.y += delta * 0.4
      robotRef.current.scale.x = robotRef.current.scale.y = robotRef.current.scale.z = 
        hovered ? 1.1 : 1
    }
  })

  return (
    <group
      ref={robotRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <RobotHead />
      <RobotBody />
      <RobotLegs />
      <WorkingStation />
    </group>
  )
}

// Main 3D Scene Component with enhanced lighting
export function ThreeDObject() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading 3D...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        className="w-full h-full"
      >
        {/* Enhanced Lighting System */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        <spotLight position={[0, 10, 5]} intensity={0.8} angle={0.3} penumbra={1} />
        
        {/* 3D Robot Working */}
        <WorkingRobot />
        
        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          maxPolarAngle={Math.PI / 2.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}
