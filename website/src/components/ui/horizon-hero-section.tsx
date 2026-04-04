"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

gsap.registerPlugin(ScrollTrigger);

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);
  // Track opacity per section for fade in/out
  const [sectionOpacities, setSectionOpacities] = useState([1, 0, 0]);
  const totalSections = 2;

  const threeRefs = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    composer: EffectComposer | null;
    stars: THREE.Points[];
    nebula: THREE.Mesh | null;
    mountains: THREE.Mesh[];
    animationId: number | null;
    targetCameraX?: number;
    targetCameraY?: number;
    targetCameraZ?: number;
    locations?: number[];
  }>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null,
  });

  useEffect(() => {
    const initThree = () => {
      const refs = threeRefs.current;

      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0x000000, 0.0003);

      refs.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      refs.camera.position.z = 100;
      refs.camera.position.y = 20;

      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        antialias: true,
        alpha: true,
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.NoToneMapping;

      refs.composer = new EffectComposer(refs.renderer);
      refs.composer.addPass(new RenderPass(refs.scene, refs.camera));

      createStarField();
      createMountains();
      getLocation();
      animate();
      setIsReady(true);
    };

    const createStarField = () => {
      const refs = threeRefs.current;
      const starCount = 4000;

      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          let x, y, z;
          // Avoid dense concentration along any single axis
          do {
            const radius = 200 + Math.random() * 800;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            x = radius * Math.sin(phi) * Math.cos(theta);
            y = radius * Math.sin(phi) * Math.sin(theta);
            z = radius * Math.cos(phi);
          } while (Math.abs(x) < 80 && Math.abs(z) < 600);

          positions[j * 3] = x;
          positions[j * 3 + 1] = y;
          positions[j * 3 + 2] = z;

          const color = new THREE.Color();
          const choice = Math.random();
          if (choice < 0.6) {
            color.setHSL(0.58, 0.2, 0.7 + Math.random() * 0.3);
          } else if (choice < 0.85) {
            color.setHSL(0.52, 0.4, 0.6);
          } else {
            color.setHSL(0.72, 0.3, 0.6);
          }

          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;
          sizes[j] = Math.random() * 1.5 + 0.3;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: { time: { value: 0 }, depth: { value: i } },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            void main() {
              vColor = color;
              vec3 pos = position;
              float angle = time * 0.03 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (250.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity * 0.5);
            }
          `,
          transparent: true,
          blending: THREE.NormalBlending,
          depthWrite: false,
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene!.add(stars);
        refs.stars.push(stars);
      }
    };

    const createNebula = () => {
      const refs = threeRefs.current;
      const geometry = new THREE.PlaneGeometry(6000, 3000, 80, 80);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x0a1a3a) },
          color2: { value: new THREE.Color(0x062040) },
          opacity: { value: 0.2 },  // much more subtle
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          void main() {
            vUv = uv;
            vec3 pos = position;
            float elevation = sin(pos.x * 0.008 + time) * cos(pos.y * 0.008 + time) * 15.0;
            pos.z += elevation;
            vElevation = elevation;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          void main() {
            float mixFactor = sin(vUv.x * 6.0 + time * 0.5) * cos(vUv.y * 6.0 + time * 0.3);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            // Fade edges heavily - no bright center
            float edgeFade = 1.0 - pow(length(vUv - 0.5) * 2.0, 1.5);
            edgeFade = max(edgeFade, 0.0);
            float alpha = opacity * edgeFade;
            alpha *= 0.8 + vElevation * 0.005;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -800;
      refs.scene!.add(nebula);
      refs.nebula = nebula;
    };

    const createMountains = () => {
      const refs = threeRefs.current;
      const layers = [
        { distance: -30, height: 50, color: 0x888888, opacity: 0.3 },
        { distance: -80, height: 70, color: 0xaaaaaa, opacity: 0.2 },
        { distance: -140, height: 90, color: 0x888888, opacity: 0.12 },
        { distance: -200, height: 110, color: 0x666666, opacity: 0.07 },
      ];

      layers.forEach((layer, index) => {
        const points: THREE.Vector2[] = [];
        const segments = 120; // More segments = smoother mountains

        // Use multiple sine waves for natural-looking ridgeline
        const seed = index * 137.5;
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const x = (t - 0.5) * 1200;

          // Multiple octaves of noise-like sine for organic shape
          let y = 0;
          y += Math.sin(t * 3.2 + seed) * layer.height * 0.5;
          y += Math.sin(t * 7.1 + seed * 1.3) * layer.height * 0.25;
          y += Math.sin(t * 13.7 + seed * 0.7) * layer.height * 0.12;
          y += Math.sin(t * 21.3 + seed * 2.1) * layer.height * 0.06;

          // Sharp peaks occasionally
          const peak = Math.pow(Math.max(0, Math.sin(t * 5.0 + seed * 0.5)), 3) * layer.height * 0.4;
          y += peak;

          y -= 80; // Lower baseline

          points.push(new THREE.Vector2(x, y));
        }

        // Close the shape at the bottom
        points.push(new THREE.Vector2(600, -350));
        points.push(new THREE.Vector2(-600, -350));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide,
          depthTest: true,
          depthWrite: true,
        });

        const mountain = new THREE.Mesh(geometry, material);
        mountain.renderOrder = 10 + index; // render after stars
        mountain.position.z = layer.distance;
        mountain.position.y = -30 + index * 5;
        mountain.userData = { baseZ: layer.distance, baseY: mountain.position.y, index };
        refs.scene!.add(mountain);
        refs.mountains.push(mountain);
      });
    };

    const createGlow = () => {
      const refs = threeRefs.current;
      // Subtle horizon glow — a flat plane with radial gradient, no bloom artifacts
      const geometry = new THREE.PlaneGeometry(800, 400);
      const material = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          void main() {
            vec2 center = vUv - vec2(0.5, 0.3);
            float dist = length(center);
            float glow = exp(-dist * 3.0) * 0.15;
            vec3 color = vec3(0.12, 0.25, 0.5) * glow;
            gl_FragColor = vec4(color, glow);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const plane = new THREE.Mesh(geometry, material);
      plane.position.z = -250;
      plane.position.y = 20;
      refs.scene!.add(plane);
    };

    const animate = () => {
      const refs = threeRefs.current;
      refs.animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      refs.stars.forEach((s) => {
        const mat = s.material as THREE.ShaderMaterial;
        if (mat.uniforms) mat.uniforms.time.value = time;
      });

      if (refs.camera && refs.targetCameraX !== undefined) {
        const sf = 0.04;
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * sf;
        smoothCameraPos.current.y += (refs.targetCameraY! - smoothCameraPos.current.y) * sf;
        smoothCameraPos.current.z += (refs.targetCameraZ! - smoothCameraPos.current.z) * sf;

        const fx = Math.sin(time * 0.08) * 1.5;
        const fy = Math.cos(time * 0.12) * 0.8;

        refs.camera.position.x = smoothCameraPos.current.x + fx;
        refs.camera.position.y = smoothCameraPos.current.y + fy;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 5, -200);
      }

      refs.mountains.forEach((mountain, i) => {
        const pf = 1 + i * 0.3;
        mountain.position.x = Math.sin(time * 0.06) * 1.5 * pf;
      });

      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
      }
    };

    initThree();

    const handleResize = () => {
      const refs = threeRefs.current;
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      const refs = threeRefs.current;
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener("resize", handleResize);
      refs.stars.forEach((s) => { s.geometry.dispose(); (s.material as THREE.Material).dispose(); });
      refs.mountains.forEach((m) => { m.geometry.dispose(); (m.material as THREE.Material).dispose(); });
      // nebula removed
      if (refs.renderer) refs.renderer.dispose();
    };
  }, []);

  const getLocation = () => {
    const refs = threeRefs.current;
    refs.locations = refs.mountains.map((m) => m.position.z);
  };

  // GSAP entrance animations
  useEffect(() => {
    if (!isReady) return;

    gsap.set([titleRef.current, subtitleRef.current, scrollProgressRef.current], {
      visibility: "visible",
    });

    const tl = gsap.timeline();

    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll(".title-char");
      tl.from(chars, { y: 150, opacity: 0, duration: 1.5, stagger: 0.06, ease: "power4.out" });
    }

    if (subtitleRef.current) {
      const lines = subtitleRef.current.querySelectorAll(".subtitle-line");
      tl.from(lines, { y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out" }, "-=0.8");
    }

    if (scrollProgressRef.current) {
      tl.from(scrollProgressRef.current, { opacity: 0, y: 30, duration: 1, ease: "power2.out" }, "-=0.5");
    }

    return () => { tl.kill(); };
  }, [isReady]);

  // Scroll handling with text fade in/out
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const wh = window.innerHeight;
      const dh = document.documentElement.scrollHeight;
      const maxScroll = dh - wh;
      const progress = Math.min(scrollY / maxScroll, 1);

      setScrollProgress(progress);

      // Which section are we in (0, 1, 2)
      const scrollInHero = scrollY / (wh * 3); // 3 viewports for hero
      const sectionFloat = scrollInHero * 3;
      const newSection = Math.min(Math.floor(sectionFloat), 2);
      setCurrentSection(newSection);

      // Calculate opacity for each section text
      // Each section fades in then fades out
      const newOpacities = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        const sectionStart = i / 3;
        const sectionEnd = (i + 1) / 3;
        const sectionMid = (sectionStart + sectionEnd) / 2;

        if (scrollInHero >= sectionStart && scrollInHero <= sectionEnd) {
          // Fade in during first half, fade out during second half
          if (scrollInHero < sectionMid) {
            const t = (scrollInHero - sectionStart) / (sectionMid - sectionStart);
            newOpacities[i] = Math.min(t * 2, 1);
          } else {
            const t = (scrollInHero - sectionMid) / (sectionEnd - sectionMid);
            newOpacities[i] = Math.max(1 - t * 1.5, 0);
          }
        }
      }
      // First section starts at full opacity
      if (scrollInHero < 0.05) newOpacities[0] = 1;
      setSectionOpacities(newOpacities);

      // Camera positions
      const refs = threeRefs.current;
      const cameraPositions = [
        { x: 0, y: 15, z: 200 },
        { x: 0, y: 25, z: 50 },
        { x: 0, y: 35, z: -200 },
      ];

      const currentPos = cameraPositions[newSection] || cameraPositions[0];
      const nextPos = cameraPositions[Math.min(newSection + 1, 2)] || currentPos;
      const t = sectionFloat - newSection;

      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * t;
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * t;
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * t;

      // Mountains parallax
      refs.mountains.forEach((mountain, i) => {
        if (progress > 0.75 && refs.locations) {
          mountain.position.z = -10000; // hide
        } else if (refs.locations) {
          mountain.position.z = refs.locations[i];
        }
      });

      // (nebula removed)
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalSections]);

  const splitTitle = (text: string) =>
    text.split("").map((char, i) => (
      <span key={i} className="title-char inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  const sections = [
    { title: "EXO", line1: "Nós não substituímos.", line2: "Evoluímos." },
    { title: "EVOLUÇÃO", line1: "Além dos limites da imaginação,", line2: "o universo de possibilidades." },
    { title: "INFINITO", line1: "Entre o pensamento e a criação,", line2: "a essência da inovação." },
  ];

  return (
    <div ref={containerRef} className="exo-hero-container">
      <canvas ref={canvasRef} className="exo-hero-canvas" />

      {/* Fixed content — section 0 (EXO) */}
      <div
        className="exo-hero-content"
        style={{ opacity: sectionOpacities[0], transition: "opacity 0.3s ease" }}
      >
        <h1 ref={titleRef} className="exo-hero-title" style={{ visibility: "hidden" }}>
          {splitTitle(sections[0].title)}
        </h1>
        <div ref={subtitleRef} className="exo-hero-subtitle" style={{ visibility: "hidden" }}>
          <p className="subtitle-line">{sections[0].line1}</p>
          <p className="subtitle-line">{sections[0].line2}</p>
        </div>
      </div>

      {/* Scroll progress */}
      <div ref={scrollProgressRef} className="exo-scroll-progress" style={{ visibility: "hidden" }}>
        <div className="exo-scroll-text">SCROLL</div>
        <div className="exo-progress-track">
          <div className="exo-progress-fill" style={{ width: `${scrollProgress * 100}%` }} />
        </div>
        <div className="exo-section-counter">
          {String(currentSection).padStart(2, "0")} / {String(totalSections).padStart(2, "0")}
        </div>
      </div>

      {/* Scroll sections — each fades in/out independently */}
      <div className="exo-scroll-sections">
        {sections.slice(1).map((section, i) => (
          <section
            key={i}
            className="exo-content-section"
            style={{
              opacity: sectionOpacities[i + 1],
              transition: "opacity 0.3s ease",
            }}
          >
            <h1 className="exo-hero-title">{section.title}</h1>
            <div className="exo-hero-subtitle">
              <p className="subtitle-line">{section.line1}</p>
              <p className="subtitle-line">{section.line2}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
