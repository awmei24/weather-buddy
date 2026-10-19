import { useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { PixelArt } from './PixelArt.jsx';
import { SUN, MOON, CLOUD } from '../icons.js';
import { SKIES, skyGradient, skyKey } from '../sky.js';

// What each scene shows, besides its gradient
const EFFECTS = {
  clear: { clouds: 0, rain: 0, snow: 0, fog: false, flash: false },
  partly: { clouds: 2, rain: 0, snow: 0, fog: false, flash: false },
  cloudy: { clouds: 9, rain: 0, snow: 0, fog: false, flash: false },
  fog: { clouds: 0, rain: 0, snow: 0, fog: true, flash: false },
  rain: { clouds: 8, rain: 45, snow: 0, fog: false, flash: false },
  snow: { clouds: 7, rain: 0, snow: 35, fog: false, flash: false },
  storm: { clouds: 10, rain: 60, snow: 0, fog: false, flash: true },
};

// Seeded random numbers, so particles keep their places between renders
function randomGenerator(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fog uses the same pixel size as the drifting clouds, so bigger masses get more
// pixels rather than bigger ones
const FOG_PIXEL = 6;

// Draws a lumpy cloud mass on a pixel grid: a wide base plus a row of round bumps on top
function fogBlob(cols, rows, random) {
  const bumpCount = 4 + Math.floor(random() * 3);
  const bumps = Array.from({ length: bumpCount }, (_, i) => {
    const r = rows * (0.22 + random() * 0.18);
    return {
      // Spread across the middle 70%, and keep each bump inside the grid so none is cut flat
      x: cols * (0.15 + 0.7 * ((i + 0.5) / bumpCount)) + (random() - 0.5) * cols * 0.06,
      y: Math.max(r + 1, rows * (0.42 + random() * 0.1)),
      r,
    };
  });
  const inside = (x, y) =>
    ((x - cols / 2) / (cols / 2)) ** 2 + ((y - rows * 0.68) / (rows * 0.32)) ** 2 <= 1 ||
    bumps.some((b) => (x - b.x) ** 2 + (y - b.y) ** 2 <= b.r ** 2);
  return Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => (inside(x + 0.5, y + 0.5) ? '#' : '.')).join('')
  );
}

function particles(count, seed, make) {
  const random = randomGenerator(seed);
  return Array.from({ length: count }, (_, i) => make(random, i));
}

export function Sky({ scene, isDay }) {
  const activeKey = skyKey(scene, isDay);
  const effects = EFFECTS[scene] ?? EFFECTS.clear;
  const showSun = isDay && (scene === 'clear' || scene === 'partly');
  const showMoon = !isDay && (scene === 'clear' || scene === 'partly');
  const starCount = !isDay ? { clear: 30, partly: 14 }[scene] ?? 0 : 0;
  // Effects on light skies are white; on dark skies they are dimmer
  const lightSky = SKIES[activeKey].tone === 'dark';

  const clouds = useMemo(() => particles(effects.clouds, 1, (random, i) => ({
    top: random() * 45,
    scale: 4 + Math.round(random() * 3),
    duration: 70 + random() * 40,
    delay: -(i / Math.max(effects.clouds, 1)) * 100 - random() * 20,
  })), [effects.clouds]);

  // Fog is a few huge, slow grey cloud masses at different heights
  const fogClouds = useMemo(() => particles(effects.fog ? 5 : 0, 5, (random, i) => {
    const cols = 110 + Math.floor(random() * 50);
    return {
      rows: fogBlob(cols, 36 + Math.floor(random() * 16), random),
      cols,
      top: -10 + random() * 60,
      duration: 140 + random() * 60,
      delay: -(i / 5) * 200 - random() * 30,
    };
  }), [effects.fog]);

  const drops = useMemo(() => particles(effects.rain, 2, (random) => ({
    x: random() * 100,
    rest: random() * 100,
    duration: 0.6 + random() * 0.4,
    delay: -random() * 2,
  })), [effects.rain]);

  const flakes = useMemo(() => particles(effects.snow, 3, (random) => ({
    x: random() * 100,
    rest: random() * 100,
    size: random() < 0.3 ? 6 : 4,
    duration: 7 + random() * 5,
    delay: -random() * 12,
  })), [effects.snow]);

  const stars = useMemo(() => particles(starCount, 4, (random) => ({
    x: random() * 100,
    y: random() * 55,
    size: random() < 0.25 ? 3 : 2,
    duration: 2 + random() * 3,
    delay: -random() * 5,
  })), [starCount]);

  return (
    <SkyRoot aria-hidden='true'>
      {Object.entries(SKIES).map(([key, sky]) => (
        <SkyLayer
          key={key}
          style={{ background: skyGradient(sky.bands), opacity: key === activeKey ? 1 : 0 }}
        />
      ))}

      {/* Keyed by scene so effects fade in fresh when the weather changes */}
      <Effects key={activeKey}>
        {stars.map((s, i) => (
          <Star
            key={i}
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s` }}
          />
        ))}

        {showSun && <Orb $color='#ffd447'><PixelArt rows={SUN} size={64} /></Orb>}
        {showMoon && <Orb $color='#f3ecd2'><PixelArt rows={MOON} size={52} /></Orb>}

        {clouds.map((c, i) => (
          <Cloud
            key={i}
            $light={lightSky}
            style={{ top: `${c.top}%`, animationDuration: `${c.duration}s`, animationDelay: `${c.delay}s` }}
          >
            <PixelArt rows={CLOUD} size={16 * c.scale} />
          </Cloud>
        ))}

        {fogClouds.map((f, i) => (
          <FogCloud
            key={i}
            $light={lightSky}
            style={{ top: `${f.top}%`, animationDuration: `${f.duration}s`, animationDelay: `${f.delay}s` }}
          >
            <PixelArt rows={f.rows} size={f.cols * FOG_PIXEL} />
          </FogCloud>
        ))}

        {drops.map((d, i) => (
          <Drop
            key={i}
            style={{ left: `${d.x}%`, '--rest': `${d.rest}cqh`, animationDuration: `${d.duration}s`, animationDelay: `${d.delay}s` }}
          />
        ))}

        {flakes.map((f, i) => (
          <Flake
            key={i}
            $light={lightSky}
            style={{ left: `${f.x}%`, width: f.size, height: f.size, '--rest': `${f.rest}cqh`, animationDuration: `${f.duration}s`, animationDelay: `${f.delay}s` }}
          />
        ))}

        {effects.flash && <Flash />}
      </Effects>
    </SkyRoot>
  );
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const drift = keyframes`
  from { transform: translateX(-30cqw); }
  to { transform: translateX(110cqw); }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.9; }
  50% { opacity: 0.25; }
`;

const fall = keyframes`
  from { transform: translateY(-20px); }
  to { transform: translateY(100cqh); }
`;

const snowfall = keyframes`
  0% { transform: translate(0, -10px); }
  50% { transform: translate(8px, 50cqh); }
  100% { transform: translate(-4px, 100cqh); }
`;

// Starts fully off the left edge and ends fully off the right, however wide the cloud
const fogDrift = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(100cqw); }
`;

const lightning = keyframes`
  0%, 88%, 91%, 94%, 100% { opacity: 0; }
  89% { opacity: 0.35; }
  92.5% { opacity: 0.22; }
`;

// When the viewer asks for reduced motion, freeze effects in place
const stillWhenReduced = (rest) => css`
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    ${rest ?? ''}
  }
`;

const SkyRoot = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  container-type: size;
`;

const SkyLayer = styled.div`
  position: absolute;
  inset: 0;
  transition: opacity 1s ease;
`;

const Effects = styled.div`
  position: absolute;
  inset: 0;
  animation: ${fadeIn} 1.2s ease;
`;

const Orb = styled.div`
  position: absolute;
  top: 13%;
  right: 12%;
  color: ${({ $color }) => $color};
`;

const Star = styled.span`
  position: absolute;
  background: #fff;
  animation: ${twinkle} ease-in-out infinite;
  ${stillWhenReduced()}
`;

const Cloud = styled.div`
  position: absolute;
  left: 0;
  color: ${({ $light }) => ($light ? 'rgba(255, 255, 255, 0.85)' : 'rgba(200, 212, 226, 0.22)')};
  animation: ${drift} linear infinite;
  ${stillWhenReduced('transform: translateX(20cqw);')}
`;

const FogCloud = styled.div`
  position: absolute;
  left: 0;
  line-height: 0;
  color: ${({ $light }) => ($light ? 'rgba(138, 150, 162, 0.55)' : 'rgba(150, 162, 178, 0.22)')};
  animation: ${fogDrift} linear infinite;
  ${stillWhenReduced('transform: translateX(10cqw);')}
`;

const Drop = styled.span`
  position: absolute;
  top: 0;
  width: 2px;
  height: 14px;
  background: rgba(220, 232, 245, 0.55);
  animation: ${fall} linear infinite;
  ${stillWhenReduced('transform: translateY(var(--rest));')}
`;

const Flake = styled.span`
  position: absolute;
  top: 0;
  /* White flakes vanish against a pale sky, so use blue-grey there */
  background: ${({ $light }) => ($light ? 'rgba(96, 124, 158, 0.75)' : 'rgba(255, 255, 255, 0.9)')};
  animation: ${snowfall} linear infinite;
  ${stillWhenReduced('transform: translateY(var(--rest));')}
`;

const Flash = styled.div`
  position: absolute;
  inset: 0;
  background: #fff;
  opacity: 0;
  animation: ${lightning} 9s linear infinite;
  ${stillWhenReduced()}
`;
