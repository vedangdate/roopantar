import {
  Engine,
  Scene,
  Vector3,
  Color3,
  HemisphericLight,
  DirectionalLight,
  MeshBuilder,
  StandardMaterial,
  UniversalCamera,
  Mesh,
  FreeCameraKeyboardMoveInput,
} from '@babylonjs/core';
import {
  WALLS,
  CEILING_HEIGHT,
  WALL_THICKNESS,
  FLAT_WIDTH,
  FLAT_DEPTH,
  FURNITURE,
  SPAWN,
  ROOMS,
} from './floorplan';

export interface SceneBundle {
  engine: Engine;
  scene: Scene;
  camera: UniversalCamera;
  canvas: HTMLCanvasElement;
  /** Take a JPEG screenshot of the current view, return base64 (no prefix). */
  screenshot: () => Promise<string>;
  /** Returns the name of the room the camera is currently in, or null. */
  currentRoomName: () => string | null;
}

// 8th floor of building → flat sits at y=0..3 (interior), exterior ground at y=-24
const GROUND_Y = -24;
const RAILING_HEIGHT = 1.0;

export function createScene(canvas: HTMLCanvasElement): SceneBundle {
  const engine = new Engine(canvas, true, { stencil: true, preserveDrawingBuffer: true }, true);
  const scene = new Scene(engine);
  // Sky-blue clearColor (will be visible past railings on decks)
  scene.clearColor = new Color3(0.62, 0.78, 0.92).toColor4(1);
  scene.collisionsEnabled = true;
  scene.gravity = new Vector3(0, -9.81 / 60, 0);

  // Materials
  const wallMat = new StandardMaterial('wallMat', scene);
  wallMat.diffuseColor = new Color3(0.93, 0.88, 0.80);
  wallMat.specularColor = new Color3(0.05, 0.05, 0.05);

  const floorMat = new StandardMaterial('floorMat', scene);
  floorMat.diffuseColor = new Color3(0.55, 0.40, 0.28);
  floorMat.specularColor = new Color3(0.1, 0.1, 0.1);

  const ceilingMat = new StandardMaterial('ceilMat', scene);
  ceilingMat.diffuseColor = new Color3(0.95, 0.93, 0.88);
  ceilingMat.specularColor = new Color3(0, 0, 0);

  // Floor
  const floor = MeshBuilder.CreateGround(
    'floor',
    { width: FLAT_WIDTH, height: FLAT_DEPTH },
    scene,
  );
  floor.position.x = FLAT_WIDTH / 2;
  floor.position.z = FLAT_DEPTH / 2;
  floor.material = floorMat;
  floor.checkCollisions = true;

  // Ceiling — render only over non-deck indoor zones (decks need sky visible).
  // Indoor zones:
  //   A. South strip (Lobby + Common Toilet + Master Bedroom): x=0..14.61, z=0..4.44
  //   B. Central+west indoor (NW Toilet/Bedroom + Dining + Living + Kitchen + Utility + Inner Lobby + Middle/NE bedrooms): x=1.55..14.61, z=1.42..15.01 minus deck zones
  // Simpler: render ceiling over a few large rectangles covering rooms, leaving deck zones open.
  function addCeiling(x1: number, z1: number, x2: number, z2: number) {
    const w = x2 - x1;
    const d = z2 - z1;
    const c = MeshBuilder.CreateGround(`ceil-${x1}-${z1}`, { width: w, height: d }, scene);
    c.position.set((x1 + x2) / 2, CEILING_HEIGHT, (z1 + z2) / 2);
    c.rotation.x = Math.PI;
    c.material = ceilingMat;
  }
  // Master suite ceilings (deck = no ceiling, open sky):
  addCeiling(0, 0,    2.59, 1.55);  // Master Toilet
  addCeiling(0, 1.55, 4.44, 5.69);  // Master Bedroom

  // Railing material (deck exterior walls — short concrete/stone color)
  const railingMat = new StandardMaterial('railingMat', scene);
  railingMat.diffuseColor = new Color3(0.78, 0.74, 0.68);
  railingMat.specularColor = new Color3(0.05, 0.05, 0.05);

  // Walls — full-height for interior, low railing height for deck exteriors
  WALLS.forEach((w, i) => {
    const dx = w.x2 - w.x1;
    const dz = w.z2 - w.z1;
    const length = Math.hypot(dx, dz);
    const cx = (w.x1 + w.x2) / 2;
    const cz = (w.z1 + w.z2) / 2;
    const angle = Math.atan2(dz, dx);

    const height = w.railing ? RAILING_HEIGHT : CEILING_HEIGHT;
    const mat = w.railing ? railingMat : wallMat;

    const mesh = MeshBuilder.CreateBox(
      `wall-${i}`,
      { width: length, height: height, depth: WALL_THICKNESS },
      scene,
    );
    mesh.position.set(cx, height / 2, cz);
    mesh.rotation.y = -angle;
    mesh.material = mat;
    mesh.checkCollisions = true;
  });

  // Furniture
  FURNITURE.forEach((f, i) => {
    const mat = new StandardMaterial(`furnMat-${i}`, scene);
    mat.diffuseColor = new Color3(...f.color);
    mat.specularColor = new Color3(0.1, 0.1, 0.1);

    const mesh = MeshBuilder.CreateBox(
      `furn-${i}-${f.name}`,
      { width: f.width, height: f.height, depth: f.depth },
      scene,
    );
    const yBase = f.y ?? 0;
    mesh.position.set(f.x, yBase + f.height / 2, f.z);
    if (f.rotY) mesh.rotation.y = f.rotY;
    mesh.material = mat;
    mesh.checkCollisions = true;
    mesh.metadata = { furniture: true, name: f.name, room: f.room };
  });

  // ============================================================
  //   OUTSIDE WORLD — Erandwane (Pune), 8th floor view
  // ============================================================
  // Approximate compass mapping in flat coords:
  //   -X (west) = Vetal Tekdi (hill) direction, greenery
  //   +X (east) = denser city / Erandwane main road
  //   -Z (south) = Deccan / Karve Road dense low-rise
  //   +Z (north) = Kothrud direction, more buildings + some hills
  //
  // The interior floor sits at y=0; exterior ground at y=-24 (8 floors below).

  // Ground plane (large, far below window level)
  const groundMat = new StandardMaterial('groundMat', scene);
  groundMat.diffuseColor = new Color3(0.45, 0.42, 0.35); // dusty Pune ground
  groundMat.specularColor = new Color3(0, 0, 0);
  const ground = MeshBuilder.CreateGround('outsideGround', { width: 600, height: 600 }, scene);
  ground.position.set(FLAT_WIDTH / 2, GROUND_Y, FLAT_DEPTH / 2);
  ground.material = groundMat;

  // Deterministic pseudo-random helper (so scene is stable across reloads)
  let seed = 1337;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

  // Scattered low+mid-rise buildings around the flat (Erandwane is mostly
  // 3-7 storey residential, with some 12-15 storey newer towers).
  const flatCx = FLAT_WIDTH / 2;
  const flatCz = FLAT_DEPTH / 2;
  for (let i = 0; i < 80; i++) {
    const angle = rand() * Math.PI * 2;
    // Push buildings further west (Vetal Tekdi side) less dense, east+south denser
    const isWest = Math.cos(angle) < -0.5;
    const distMin = isWest ? 80 : 30;
    const distMax = isWest ? 200 : 160;
    const dist = distMin + rand() * (distMax - distMin);
    const bx = flatCx + Math.cos(angle) * dist;
    const bz = flatCz + Math.sin(angle) * dist;
    const bw = 6 + rand() * 14;
    const bd = 6 + rand() * 14;
    // Most buildings shorter than flat (3-6 floors); some taller (12+)
    const isTall = rand() < 0.2;
    const bh = isTall ? 18 + rand() * 25 : 9 + rand() * 12;

    const bldg = MeshBuilder.CreateBox(`bldg-${i}`, { width: bw, height: bh, depth: bd }, scene);
    bldg.position.set(bx, GROUND_Y + bh / 2, bz);
    const m = new StandardMaterial(`bldgMat-${i}`, scene);
    // Cream/beige/dusty-pink/grey palette typical of Pune buildings
    const palette = [
      new Color3(0.82, 0.74, 0.62), // cream
      new Color3(0.75, 0.65, 0.55), // beige
      new Color3(0.68, 0.55, 0.48), // dusty pink
      new Color3(0.62, 0.62, 0.60), // grey
      new Color3(0.86, 0.78, 0.66), // light cream
    ];
    m.diffuseColor = palette[Math.floor(rand() * palette.length)];
    m.specularColor = new Color3(0.02, 0.02, 0.02);
    bldg.material = m;
  }

  // Trees (Erandwane has good tree cover — neem, gulmohar, peepal)
  for (let i = 0; i < 60; i++) {
    const angle = rand() * Math.PI * 2;
    const dist = 18 + rand() * 120;
    const tx = flatCx + Math.cos(angle) * dist;
    const tz = flatCz + Math.sin(angle) * dist;
    const th = 8 + rand() * 6;
    // Trunk
    const trunk = MeshBuilder.CreateCylinder(`trunk-${i}`, { diameter: 0.5, height: th * 0.4 }, scene);
    trunk.position.set(tx, GROUND_Y + th * 0.2, tz);
    const trunkMat = new StandardMaterial(`trunkMat-${i}`, scene);
    trunkMat.diffuseColor = new Color3(0.32, 0.22, 0.14);
    trunkMat.specularColor = new Color3(0, 0, 0);
    trunk.material = trunkMat;
    // Canopy (random green)
    const canopy = MeshBuilder.CreateSphere(`canopy-${i}`, { diameter: th * 0.75, segments: 6 }, scene);
    canopy.position.set(tx, GROUND_Y + th * 0.6, tz);
    const canopyMat = new StandardMaterial(`canopyMat-${i}`, scene);
    canopyMat.diffuseColor = new Color3(0.18 + rand() * 0.18, 0.38 + rand() * 0.2, 0.16 + rand() * 0.1);
    canopyMat.specularColor = new Color3(0, 0, 0);
    canopy.material = canopyMat;
  }

  // Vetal Tekdi (hill) — west of flat, large green silhouette
  const hill = MeshBuilder.CreateSphere('vetalTekdi', { diameter: 260, segments: 16 }, scene);
  hill.position.set(flatCx - 220, GROUND_Y + 10, flatCz - 30);
  hill.scaling.y = 0.35; // flatten into a hill
  const hillMat = new StandardMaterial('hillMat', scene);
  hillMat.diffuseColor = new Color3(0.28, 0.42, 0.25);
  hillMat.specularColor = new Color3(0, 0, 0);
  hill.material = hillMat;

  // Second smaller hill (north-west — could be Hanuman Tekdi area)
  const hill2 = MeshBuilder.CreateSphere('hanumanTekdi', { diameter: 200, segments: 12 }, scene);
  hill2.position.set(flatCx - 160, GROUND_Y + 6, flatCz + 180);
  hill2.scaling.y = 0.3;
  const hill2Mat = new StandardMaterial('hill2Mat', scene);
  hill2Mat.diffuseColor = new Color3(0.32, 0.40, 0.24);
  hill2Mat.specularColor = new Color3(0, 0, 0);
  hill2.material = hill2Mat;

  // ============================================================
  //   Lighting
  // ============================================================
  const ambient = new HemisphericLight('ambient', new Vector3(0, 1, 0), scene);
  ambient.intensity = 0.85;
  ambient.diffuse = new Color3(1.0, 0.96, 0.88);
  ambient.groundColor = new Color3(0.45, 0.40, 0.32);

  const sun = new DirectionalLight('sun', new Vector3(-0.4, -1, 0.3), scene);
  sun.intensity = 0.7;
  sun.diffuse = new Color3(1.0, 0.95, 0.80);

  // Camera = first-person UniversalCamera
  const camera = new UniversalCamera(
    'fps',
    new Vector3(SPAWN.x, SPAWN.y, SPAWN.z),
    scene,
  );
  camera.rotation.y = SPAWN.rotY;
  camera.minZ = 0.05;
  camera.fov = 1.2; // ~70°
  camera.speed = 0.18;
  camera.angularSensibility = 1500; // mouse sensitivity (higher = slower)
  camera.inertia = 0.6;
  camera.applyGravity = false; // keep eye height constant for v0
  camera.checkCollisions = true;
  camera.ellipsoid = new Vector3(0.35, 0.85, 0.35); // person-sized collision capsule

  // WASD keys for movement (Babylon defaults are arrow keys; we want WASD).
  const kb = camera.inputs.attached.keyboard as FreeCameraKeyboardMoveInput;
  kb.keysUp = [87, 38];    // W, Up
  kb.keysDown = [83, 40];  // S, Down
  kb.keysLeft = [65, 37];  // A, Left
  kb.keysRight = [68, 39]; // D, Right

  camera.attachControl(canvas, true);

  // Sprint (Shift) — boost speed while held
  const baseSpeed = camera.speed;
  window.addEventListener('keydown', (e) => {
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') camera.speed = baseSpeed * 2.2;
  });
  window.addEventListener('keyup', (e) => {
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') camera.speed = baseSpeed;
  });

  // Render loop
  engine.runRenderLoop(() => scene.render());
  window.addEventListener('resize', () => engine.resize());

  // Helpers
  async function screenshot(): Promise<string> {
    // Grab as JPEG to keep payload small for Gemini.
    return new Promise((resolve, reject) => {
      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        // strip the "data:image/jpeg;base64," prefix
        const base64 = dataUrl.split(',')[1] ?? '';
        resolve(base64);
      } catch (e) {
        reject(e);
      }
    });
  }

  function currentRoomName(): string | null {
    // Find which room rectangle the camera is inside.
    // ROOMS only has centre points, so use the WALLS to derive bounds.
    // For v0, do a coarse approximation by matching the closest room centre.
    const px = camera.position.x;
    const pz = camera.position.z;
    let best: { name: string; dist: number } | null = null;
    for (const r of ROOMS) {
      const d = Math.hypot(r.cx - px, r.cz - pz);
      if (!best || d < best.dist) best = { name: r.name, dist: d };
    }
    return best ? best.name : null;
  }

  return { engine, scene, camera, canvas, screenshot, currentRoomName };
}
