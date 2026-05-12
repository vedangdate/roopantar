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

export function createScene(canvas: HTMLCanvasElement): SceneBundle {
  const engine = new Engine(canvas, true, { stencil: true, preserveDrawingBuffer: true }, true);
  const scene = new Scene(engine);
  scene.clearColor = new Color3(0.08, 0.06, 0.05).toColor4(1);
  scene.collisionsEnabled = true;
  scene.gravity = new Vector3(0, -9.81 / 60, 0); // gentle gravity per-frame

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

  // Ceiling (so the room doesn't feel infinite)
  const ceiling = MeshBuilder.CreateGround(
    'ceiling',
    { width: FLAT_WIDTH, height: FLAT_DEPTH },
    scene,
  );
  ceiling.position.x = FLAT_WIDTH / 2;
  ceiling.position.y = CEILING_HEIGHT;
  ceiling.position.z = FLAT_DEPTH / 2;
  ceiling.rotation.x = Math.PI; // face downward
  ceiling.material = ceilingMat;

  // Walls
  WALLS.forEach((w, i) => {
    const dx = w.x2 - w.x1;
    const dz = w.z2 - w.z1;
    const length = Math.hypot(dx, dz);
    const cx = (w.x1 + w.x2) / 2;
    const cz = (w.z1 + w.z2) / 2;
    const angle = Math.atan2(dz, dx);

    const mesh = MeshBuilder.CreateBox(
      `wall-${i}`,
      { width: length, height: CEILING_HEIGHT, depth: WALL_THICKNESS },
      scene,
    );
    mesh.position.set(cx, CEILING_HEIGHT / 2, cz);
    mesh.rotation.y = -angle;
    mesh.material = wallMat;
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

  // Lighting — soft ambient + a directional from above-front for shading.
  const ambient = new HemisphericLight('ambient', new Vector3(0, 1, 0), scene);
  ambient.intensity = 0.7;
  ambient.diffuse = new Color3(1.0, 0.96, 0.88);
  ambient.groundColor = new Color3(0.3, 0.25, 0.2);

  const sun = new DirectionalLight('sun', new Vector3(-0.4, -1, 0.3), scene);
  sun.intensity = 0.5;
  sun.diffuse = new Color3(1.0, 0.95, 0.85);

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
