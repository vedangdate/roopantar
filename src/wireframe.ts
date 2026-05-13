// Top-down wireframe overlay. Renders WALLS + ROOMS + player position
// as SVG. Toggle visibility with P key.

import { WALLS, ROOMS, FLAT_WIDTH, FLAT_DEPTH, SPAWN } from './floorplan';
import type { SceneBundle } from './scene';

const NS = 'http://www.w3.org/2000/svg';

export function setupWireframe(bundle: SceneBundle) {
  const panel = document.getElementById('wireframePanel') as HTMLDivElement;
  const svg = document.getElementById('wireframeSvg') as unknown as SVGSVGElement;
  const closeBtn = document.getElementById('closeWireframe') as HTMLButtonElement;
  if (!panel || !svg) return;

  // viewBox: pad the flat dimensions a bit
  const pad = 1;
  const vbw = FLAT_WIDTH + pad * 2;
  const vbh = FLAT_DEPTH + pad * 2;
  svg.setAttribute('viewBox', `${-pad} ${-pad} ${vbw} ${vbh}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  // SVG y-axis goes DOWN, our z-axis goes north (UP). Flip z visually
  // so user sees north at top. Transform: y' = FLAT_DEPTH - z.
  const z2y = (z: number) => FLAT_DEPTH - z;

  // Render walls
  for (const w of WALLS) {
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', String(w.x1));
    line.setAttribute('y1', String(z2y(w.z1)));
    line.setAttribute('x2', String(w.x2));
    line.setAttribute('y2', String(z2y(w.z2)));
    line.setAttribute('stroke', w.railing ? '#5ce4d9' : '#f4ede4');
    line.setAttribute('stroke-width', w.railing ? '0.08' : '0.15');
    line.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line);
  }

  // Room labels
  for (const r of ROOMS) {
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', String(r.cx));
    t.setAttribute('y', String(z2y(r.cz)));
    t.setAttribute('fill', '#d4a373');
    t.setAttribute('font-size', '0.35');
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('dominant-baseline', 'middle');
    t.textContent = r.name;
    svg.appendChild(t);
  }

  // Spawn marker (static, decorative)
  const spawn = document.createElementNS(NS, 'circle');
  spawn.setAttribute('cx', String(SPAWN.x));
  spawn.setAttribute('cy', String(z2y(SPAWN.z)));
  spawn.setAttribute('r', '0.18');
  spawn.setAttribute('fill', 'rgba(212, 163, 115, 0.4)');
  spawn.setAttribute('stroke', '#d4a373');
  spawn.setAttribute('stroke-width', '0.03');
  svg.appendChild(spawn);

  // Live player marker (updates every frame-ish via setInterval)
  const player = document.createElementNS(NS, 'circle');
  player.setAttribute('r', '0.22');
  player.setAttribute('fill', '#6ea8ff');
  player.setAttribute('stroke', '#1a1410');
  player.setAttribute('stroke-width', '0.04');
  svg.appendChild(player);

  // Player facing arrow
  const arrow = document.createElementNS(NS, 'line');
  arrow.setAttribute('stroke', '#1a1410');
  arrow.setAttribute('stroke-width', '0.08');
  arrow.setAttribute('stroke-linecap', 'round');
  svg.appendChild(arrow);

  function update() {
    const c = bundle.camera;
    const px = c.position.x;
    const pz = c.position.z;
    const py = z2y(pz);
    player.setAttribute('cx', String(px));
    player.setAttribute('cy', String(py));
    // Facing: camera.rotation.y is yaw. forward vector in XZ plane.
    const yaw = c.rotation.y;
    // Babylon forward direction: when rotation.y=0 camera looks +Z (or default).
    // For wireframe, draw an arrow pointing in the camera's forward XZ direction.
    const fx = Math.sin(yaw);
    const fz = Math.cos(yaw);
    const ax = px + fx * 0.5;
    const az = pz + fz * 0.5;
    arrow.setAttribute('x1', String(px));
    arrow.setAttribute('y1', String(py));
    arrow.setAttribute('x2', String(ax));
    arrow.setAttribute('y2', String(z2y(az)));
  }
  update();
  setInterval(update, 80);

  // Toggle visibility with P
  let visible = true;
  function setVisible(v: boolean) {
    visible = v;
    panel.classList.toggle('hidden', !v);
  }
  closeBtn?.addEventListener('click', () => setVisible(false));
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyP' && document.activeElement?.tagName !== 'INPUT') {
      setVisible(!visible);
    }
  });
}
