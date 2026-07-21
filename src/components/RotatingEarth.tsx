import React, { useEffect, useRef, useState } from "react";

export default function RotatingEarth() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || 500;
    let height = canvas.height = canvas.parentElement?.clientHeight || 500;

    // Create Earth texture procedurally in offscreen canvas
    const textureW = 1000;
    const textureH = 500;
    
    // 1. Earth Map Texture
    const earthTexture = document.createElement("canvas");
    earthTexture.width = textureW;
    earthTexture.height = textureH;
    const tCtx = earthTexture.getContext("2d")!;

    // Background ocean
    const oceanGrad = tCtx.createLinearGradient(0, 0, 0, textureH);
    oceanGrad.addColorStop(0, "#0b1d3a");
    oceanGrad.addColorStop(0.5, "#102f61");
    oceanGrad.addColorStop(1, "#07152c");
    tCtx.fillStyle = oceanGrad;
    tCtx.fillRect(0, 0, textureW, textureH);

    // Oceans details / grids
    tCtx.strokeStyle = "rgba(16, 47, 97, 0.2)";
    tCtx.lineWidth = 1;
    for (let i = 0; i < textureW; i += 50) {
      tCtx.beginPath();
      tCtx.moveTo(i, 0);
      tCtx.lineTo(i, textureH);
      tCtx.stroke();
    }
    for (let i = 0; i < textureH; i += 50) {
      tCtx.beginPath();
      tCtx.moveTo(0, i);
      tCtx.lineTo(textureW, i);
      tCtx.stroke();
    }

    // Draw procedural continents (Americas, Eurasia, Africa, Australia, Antarctica)
    tCtx.fillStyle = "#1e3f20"; // Land base
    
    const drawLandMass = (points: [number, number][], color = "#1e4d2b", secondaryColor = "#2a5c37") => {
      tCtx.beginPath();
      tCtx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        tCtx.lineTo(points[i][0], points[i][1]);
      }
      tCtx.closePath();
      
      const grad = tCtx.createLinearGradient(points[0][0], 0, points[points.length-1][0], 0);
      grad.addColorStop(0, color);
      grad.addColorStop(0.5, secondaryColor);
      grad.addColorStop(1, color);
      tCtx.fillStyle = grad;
      tCtx.fill();

      // Land outline
      tCtx.strokeStyle = "rgba(40, 95, 52, 0.4)";
      tCtx.lineWidth = 1.5;
      tCtx.stroke();
    };

    // Americas
    drawLandMass([
      [100, 100], [150, 80], [200, 120], [230, 140], [250, 160], [240, 200], [210, 210], 
      [240, 250], [260, 270], [280, 300], [300, 330], [320, 370], [310, 420], [280, 450],
      [270, 430], [280, 390], [260, 350], [240, 310], [210, 280], [180, 260], [170, 230],
      [130, 210], [110, 180], [80, 150], [90, 120]
    ], "#2a5235", "#386b45");

    // Greenland & Islands
    drawLandMass([
      [220, 50], [260, 40], [280, 60], [250, 80], [210, 70]
    ], "#f0f4f1", "#dbe3dd");

    // Eurasia & Africa
    drawLandMass([
      [450, 120], [480, 90], [530, 80], [600, 70], [680, 80], [750, 90], [820, 110], 
      [850, 140], [820, 170], [780, 180], [750, 210], [720, 240], [680, 250], [650, 230],
      [610, 220], [580, 240], [560, 210], [520, 190], [480, 180], [450, 150]
    ], "#2c4c38", "#406950");

    // Africa details
    drawLandMass([
      [460, 210], [520, 200], [550, 230], [580, 260], [590, 300], [570, 350], [540, 400],
      [510, 430], [500, 410], [490, 360], [470, 320], [440, 280], [430, 240], [445, 220]
    ], "#3b5828", "#5c7d3d");

    // Australia
    drawLandMass([
      [750, 330], [810, 320], [840, 350], [830, 390], [780, 410], [740, 380]
    ], "#5e503f", "#7f6d55");

    // Antarctica
    drawLandMass([
      [50, 470], [200, 480], [400, 475], [600, 480], [800, 470], [950, 475],
      [950, 500], [50, 500]
    ], "#ffffff", "#eceff1");

    // 2. Cloud Texture
    const cloudTexture = document.createElement("canvas");
    cloudTexture.width = textureW;
    cloudTexture.height = textureH;
    const cCtx = cloudTexture.getContext("2d")!;
    cCtx.fillStyle = "rgba(0,0,0,0)";
    cCtx.fillRect(0, 0, textureW, textureH);

    // Draw procedural realistic whispy clouds
    cCtx.fillStyle = "rgba(255, 255, 255, 0.55)";
    const drawCloud = (cx: number, cy: number, r: number) => {
      const grad = cCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.6)");
      grad.addColorStop(0.5, "rgba(255, 255, 255, 0.35)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      cCtx.fillStyle = grad;
      cCtx.beginPath();
      cCtx.arc(cx, cy, r, 0, Math.PI * 2);
      cCtx.fill();
    };

    // Cluster clouds in bands
    for (let i = 0; i < 40; i++) {
      const cx = Math.random() * textureW;
      const cy = 100 + Math.random() * 300; // Cloud belt
      const r = 30 + Math.random() * 50;
      drawCloud(cx, cy, r);
      drawCloud(cx + (Math.random() - 0.5) * 40, cy + (Math.random() - 0.5) * 20, r * 0.7);
    }

    // Star background definitions
    const starCount = 180;
    const stars: { x: number; y: number; r: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * 1000,
        y: Math.random() * 1000,
        r: Math.random() * 1.3 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.01 + 0.002,
      });
    }

    // Ambient space nebula colors
    const nebulaGrad = ctx.createRadialGradient(
      width * 0.7, height * 0.3, 0,
      width * 0.7, height * 0.3, Math.max(width, height) * 0.6
    );
    nebulaGrad.addColorStop(0, "rgba(20, 10, 45, 0.35)");
    nebulaGrad.addColorStop(0.5, "rgba(10, 25, 45, 0.15)");
    nebulaGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

    let earthRotation = 3.2; // Start position
    let cloudRotation = 1.1;
    
    const resizeHandler = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 500;
      height = canvas.height = canvas.parentElement?.clientHeight || 500;
    };
    
    window.addEventListener("resize", resizeHandler);

    // Animation Loop
    const render = () => {
      ctx.fillStyle = "#02040a";
      ctx.fillRect(0, 0, width, height);

      // Render Nebula Gas
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Twinkling Stars
      stars.forEach((star) => {
        star.alpha += star.speed;
        if (star.alpha > 1.0 || star.alpha < 0.1) {
          star.speed = -star.speed;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, star.alpha))})`;
        ctx.beginPath();
        // Project to canvas width/height
        const sx = (star.x * (width / 1000)) % width;
        const sy = (star.y * (height / 1000)) % height;
        ctx.arc(sx, sy, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Earth properties
      const radius = Math.min(width, height) * 0.34;
      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Draw outer space atmospheric corona glow
      const coronaGrad = ctx.createRadialGradient(
        centerX, centerY, radius * 0.95,
        centerX, centerY, radius * 1.12
      );
      coronaGrad.addColorStop(0, "rgba(80, 150, 255, 0.45)");
      coronaGrad.addColorStop(0.3, "rgba(60, 120, 230, 0.25)");
      coronaGrad.addColorStop(0.7, "rgba(30, 70, 180, 0.08)");
      coronaGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw 3D Sphere wrapping
      // Draw Earth by rendering columns and squeezing horizontally
      for (let x = -radius; x < radius; x++) {
        const halfH = Math.sqrt(radius * radius - x * x);
        const angle = Math.asin(x / radius); // longitude on sphere (-PI/2 to PI/2)
        
        // Map longitude to texture coordinates
        // Normalized angle is from 0 to 1 representing the visible hemisphere
        const normAngle = angle / Math.PI + 0.5;
        
        // Earth layer sampling
        const eOffset = (earthRotation / (Math.PI * 2)) * textureW;
        const eX = Math.round((eOffset + normAngle * (textureW / 2)) % textureW);

        // Cloud layer sampling (different speed)
        const cOffset = (cloudRotation / (Math.PI * 2)) * textureW;
        const cX = Math.round((cOffset + normAngle * (textureW / 2)) % textureW);

        // Draw Earth Column Slice
        ctx.drawImage(
          earthTexture,
          eX, 0, 1, textureH, // Source slice
          centerX + x, centerY - halfH, 1, 2 * halfH // Spherical projection slice
        );

        // Draw Cloud Column Slice on top
        ctx.drawImage(
          cloudTexture,
          cX, 0, 1, textureH,
          centerX + x, centerY - halfH, 1, 2 * halfH
        );
      }

      // 3. Volumetric Shading & Day-Night Crescent Terminating shadow
      // Sourced light from top-right (+X, -Y, +Z)
      const shadowGrad = ctx.createRadialGradient(
        centerX + radius * 0.35, centerY - radius * 0.25, radius * 0.2,
        centerX - radius * 0.1, centerY + radius * 0.1, radius * 1.05
      );
      shadowGrad.addColorStop(0, "rgba(255, 255, 255, 0.08)"); // Soft Sunlight specular reflection
      shadowGrad.addColorStop(0.4, "rgba(0, 0, 0, 0)"); // High noon clear
      shadowGrad.addColorStop(0.75, "rgba(0, 0, 0, 0.65)"); // Dusk boundary
      shadowGrad.addColorStop(0.95, "rgba(0, 5, 12, 0.94)"); // Solid night side
      shadowGrad.addColorStop(1, "rgba(0, 0, 0, 1)");

      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 1, 0, Math.PI * 2);
      ctx.fill();

      // 4. Atmosphere edge glow highlight
      // High-altitude ozone scattering at day horizon
      const horizonGrad = ctx.createRadialGradient(
        centerX, centerY, radius * 0.92,
        centerX, centerY, radius
      );
      horizonGrad.addColorStop(0, "rgba(100, 180, 255, 0)");
      horizonGrad.addColorStop(0.5, "rgba(110, 190, 255, 0.25)");
      horizonGrad.addColorStop(1, "rgba(120, 200, 255, 0.55)");

      ctx.fillStyle = horizonGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Rotation increments
      // If user hovers, speed increases or changes interactive orbit
      const deltaRotation = isHovered ? 0.0028 : 0.0012;
      earthRotation = (earthRotation + deltaRotation) % (Math.PI * 2);
      cloudRotation = (cloudRotation + deltaRotation * 1.35) % (Math.PI * 2);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isHovered]);

  return (
    <div 
      className="w-full h-full flex items-center justify-center relative cursor-grab active:cursor-grabbing select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas ref={canvasRef} className="block w-full h-full object-contain max-w-[460px] max-h-[460px]" />
    </div>
  );
}
