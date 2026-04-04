"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

type DottedSurfaceProps = Omit<React.ComponentProps<"div">, "ref"> & {
  children?: React.ReactNode;
};

export function DottedSurface({ className, children, ...props }: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const SEPARATION = 100;
    const AMOUNTX = 50;
    const AMOUNTY = 70;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const positions: number[] = [];
    const colors: number[] = [];
    const geometry = new THREE.BufferGeometry();

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(
          ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
          0,
          iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
        );
        colors.push(220, 220, 220);
      }
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    // Use ShaderMaterial for dynamic point sizes based on wave height
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0.85, 0.85, 0.85) },
      },
      vertexShader: `
        uniform float uTime;
        attribute float baseY;
        varying float vHeight;
        varying float vDist;

        void main() {
          float ix = position.x / 100.0;
          float iy = position.z / 100.0;

          // Gentle organic wave
          float wave = sin(ix * 0.15 + uTime) * 25.0
                     + sin(iy * 0.12 + uTime * 0.8) * 20.0
                     + sin((ix + iy) * 0.08 + uTime * 0.6) * 15.0;

          vec3 pos = position;
          pos.y = wave;

          vHeight = (wave + 60.0) / 120.0; // normalize 0-1
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vDist = -mvPosition.z;

          // Points closer to camera and higher on wave = bigger
          float baseSize = 4.0 + vHeight * 8.0;
          gl_PointSize = baseSize * (800.0 / vDist);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vHeight;

        void main() {
          // Soft circle
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, dist);

          // Brighter at wave peaks, dimmer in valleys
          float brightness = 0.3 + vHeight * 0.7;
          vec3 color = uColor * brightness;

          gl_FragColor = vec4(color, alpha * brightness);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    scene.add(new THREE.Points(geometry, material));

    let count = 0;
    let running = true;

    const animate = () => {
      if (!running) return;
      animIdRef.current = requestAnimationFrame(animate);

      material.uniforms.uTime.value = count;

      // Slow gentle camera sway for depth feeling
      camera.position.x = Math.sin(count * 0.3) * 80;
      camera.position.y = 355 + Math.sin(count * 0.2) * 20;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      count += 0.02;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      running = false;
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none fixed inset-0 -z-1", className)}
      {...props}
    >
      {children}
    </div>
  );
}
