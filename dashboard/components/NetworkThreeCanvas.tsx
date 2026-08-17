'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function NetworkThreeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Create 3D Nodes Matrix (Security Agent Nodes)
    const nodesGroup = new THREE.Group();
    const geometry = new THREE.IcosahedronGeometry(0.6, 1);
    
    const material = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
    });

    const nodes: THREE.Mesh[] = [];
    for (let i = 0; i < 18; i++) {
      const node = new THREE.Mesh(geometry, material);
      node.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      nodesGroup.add(node);
      nodes.push(node);
    }
    scene.add(nodesGroup);

    // Add Ambient & Point Lights for depth
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xa855f7, 4, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Mouse movement interaction variables
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 0.5;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      nodesGroup.rotation.y += 0.003;
      nodesGroup.rotation.x += 0.001;

      // Smooth parallax tilt based on cursor
      nodesGroup.rotation.y += (mouseX - nodesGroup.rotation.y) * 0.05;
      nodesGroup.rotation.x += (-mouseY - nodesGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-[450px] cursor-grab active:cursor-grabbing" />;
}