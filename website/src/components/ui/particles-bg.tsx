"use client";

import { useEffect, useCallback, useState } from "react";

export default function ParticlesComponent() {
  const [ready, setReady] = useState(false);

  const initParticles = useCallback(() => {
    const oldCanvas = document.querySelector("#particles-js canvas");
    if (oldCanvas) oldCanvas.remove();

    // @ts-ignore
    if (window.pJSDom?.length > 0) {
      // @ts-ignore
      window.pJSDom.forEach((p: any) => p.pJS.fn.vendors.destroypJS());
      // @ts-ignore
      window.pJSDom = [];
    }

    // @ts-ignore
    window.particlesJS("particles-js", {
      particles: {
        number: { value: 100, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle", stroke: { width: 0, color: "#000" } },
        opacity: {
          value: 0.7,
          random: true,
          anim: { enable: true, speed: 0.5, opacity_min: 0.2 },
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: true, speed: 1, size_min: 1 },
        },
        line_linked: {
          enable: true,
          distance: 160,
          color: "#ffffff",
          opacity: 0.25,
          width: 1,
        },
        move: { enable: true, speed: 1.2, random: true, out_mode: "bounce" },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 200, line_linked: { opacity: 0.6 } },
          push: { particles_nb: 3 },
        },
      },
      retina_detect: true,
    });

    // Small delay so particles have time to render first frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setReady(true);
      });
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already loaded
    // @ts-ignore
    if (window.particlesJS) {
      initParticles();
      return;
    }

    // Preload hint
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "script";
    link.href = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      initParticles();
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [initParticles]);

  return (
    <div
      id="particles-js"
      className="w-full h-screen absolute top-0 left-0 bg-black transition-opacity duration-1000 ease-out"
      style={{ opacity: ready ? 1 : 0 }}
    />
  );
}
