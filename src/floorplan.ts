// Floor plan — flat 804, Erandwane Central.
// Generated from user-provided spec 2026-05-12.
//
// Coordinate system: origin SW corner of suite. x = east, z = north.
// User spec had x range -7.83 to 7.44. Shifted +7.83 so all x positive.
// z range: 0 to 16.16 (no shift).
//
// Walls generated programmatically from rooms + doors.

const X_SHIFT = 7.83;

export const FLAT_WIDTH = 15.27;  // -7.83..7.44 → 0..15.27
export const FLAT_DEPTH = 16.16;
export const CEILING_HEIGHT = 3.0;
export const WALL_THICKNESS = 0.15;

export interface WallSeg {
  x1: number; z1: number;
  x2: number; z2: number;
  railing?: boolean;
}

// ============================================================
//   USER SPEC
// ============================================================

type Side = 'north' | 'south' | 'east' | 'west';
type DoorType = 'regular' | 'slider' | 'french-window' | 'open';
type Purpose = 'bedroom' | 'toilet' | 'deck' | 'living' | 'dining' | 'kitchen' | 'utility' | 'lobby';

interface RoomDef { name: string; x1: number; z1: number; x2: number; z2: number; purpose: Purpose }
interface DoorDef { room_a: string; room_b: string; wall: Side; gap: [number, number]; type: DoorType }

// Rooms (in user's original coord system — shift applied below)
const ROOMS_RAW: RoomDef[] = [
  { name: 'Master Toilet',  x1: 0,     z1: 0,     x2: 1.55,  z2: 2.59,  purpose: 'toilet' },
  { name: 'Master Bedroom', x1: 1.55,  z1: 0,     x2: 5.99,  z2: 4.14,  purpose: 'bedroom' },
  { name: 'Master Deck',    x1: 5.99,  z1: 0,     x2: 7.44,  z2: 4.34,  purpose: 'deck' },
  { name: 'Bedroom 3',      x1: 1.55,  z1: 4.14,  x2: 7.09,  z2: 7.47,  purpose: 'bedroom' },
  { name: 'Dining',         x1: -2.34, z1: 4.14,  x2: 1.55,  z2: 7.47,  purpose: 'dining' },
  { name: 'Living',         x1: -6.28, z1: 4.14,  x2: -2.34, z2: 9.78,  purpose: 'living' },
  { name: 'Lobby',          x1: -7.80, z1: 4.14,  x2: -6.28, z2: 5.56,  purpose: 'lobby' },
  { name: 'Bedroom 1',      x1: -6.28, z1: 9.78,  x2: -3.00, z2: 13.77, purpose: 'bedroom' },
  { name: 'Main Deck',      x1: -6.28, z1: 13.77, x2: 1.01,  z2: 16.16, purpose: 'deck' },
  { name: 'Toilet West',    x1: -7.83, z1: 11.38, x2: -6.28, z2: 13.77, purpose: 'toilet' },
  { name: 'Kitchen',        x1: -2.34, z1: 7.47,  x2: 0.35,  z2: 10.90, purpose: 'kitchen' },
  { name: 'Utility',        x1: -2.34, z1: 10.90, x2: 0.15,  z2: 12.09, purpose: 'utility' },
  { name: 'Bedroom 2',      x1: 2.18,  z1: 7.47,  x2: 6.32,  z2: 11.84, purpose: 'bedroom' },
  { name: 'Toilet North',   x1: 0.35,  z1: 7.47,  x2: 2.18,  z2: 8.99,  purpose: 'toilet' },
  { name: 'Deck Top Right', x1: 2.18,  z1: 11.84, x2: 6.32,  z2: 13.19, purpose: 'deck' },
  { name: 'Toilet Central', x1: 0,     z1: 2.59,  x2: 2.29,  z2: 3.99,  purpose: 'toilet' },
];

const DOORS_RAW: DoorDef[] = [
  { room_a: 'Master Bedroom', room_b: 'Master Toilet',  wall: 'west',  gap: [1.6, 2.4], type: 'regular' },
  { room_a: 'Master Bedroom', room_b: 'Master Deck',    wall: 'east',  gap: [1.5, 3.5], type: 'slider' },
  { room_a: 'Living',         room_b: 'Lobby',          wall: 'west',  gap: [0, 1.42],  type: 'open' },
  { room_a: 'Living',         room_b: 'Dining',         wall: 'east',  gap: [0, 3.33],  type: 'open' },
  { room_a: 'Bedroom 1',      room_b: 'Main Deck',      wall: 'north', gap: [0.5, 2.5], type: 'slider' },
  { room_a: 'Bedroom 2',      room_b: 'Deck Top Right', wall: 'north', gap: [1.0, 3.0], type: 'slider' },
  { room_a: 'Kitchen',        room_b: 'Utility',        wall: 'north', gap: [0.5, 1.5], type: 'regular' },
  // Front door
  { room_a: 'Lobby',          room_b: 'outside',        wall: 'west',  gap: [0.2, 1.2], type: 'open' },
];

const RAILING_DECKS: Record<string, Side[]> = {
  'Master Deck':    ['south', 'east', 'north'],
  'Main Deck':      ['west',  'north','east'],
  'Deck Top Right': ['west',  'north','east'],
};

// ============================================================
//   GENERATE WALLS FROM SPEC
// ============================================================

// Shift x so all coords positive.
const ROOMS_SHIFTED = ROOMS_RAW.map(r => ({
  ...r,
  x1: r.x1 + X_SHIFT,
  x2: r.x2 + X_SHIFT,
}));

// Lookup room by name.
const roomByName = new Map(ROOMS_SHIFTED.map(r => [r.name, r]));

// For each door, calculate absolute gap coords + which wall in room_a.
interface AbsGap { side: Side; wall_axis: 'x' | 'z'; wall_fixed: number; gap_start: number; gap_end: number; type: DoorType }

function gapForDoor(d: DoorDef): AbsGap | null {
  const r = roomByName.get(d.room_a);
  if (!r) return null;
  if (d.wall === 'south' || d.wall === 'north') {
    const wall_fixed = d.wall === 'south' ? r.z1 : r.z2;
    return {
      side: d.wall, wall_axis: 'x', wall_fixed,
      gap_start: r.x1 + d.gap[0],
      gap_end:   r.x1 + d.gap[1],
      type: d.type,
    };
  } else {
    const wall_fixed = d.wall === 'west' ? r.x1 : r.x2;
    return {
      side: d.wall, wall_axis: 'z', wall_fixed,
      gap_start: r.z1 + d.gap[0],
      gap_end:   r.z1 + d.gap[1],
      type: d.type,
    };
  }
}

const DOORS_ABS = DOORS_RAW.map(d => ({ door: d, abs: gapForDoor(d) }));

// Generate walls. For each room's 4 sides, emit wall segments (split by gaps).
// Deduplicate shared walls between rooms.
const wallKey = (x1: number, z1: number, x2: number, z2: number) =>
  `${Math.min(x1, x2).toFixed(3)},${Math.min(z1, z2).toFixed(3)},${Math.max(x1, x2).toFixed(3)},${Math.max(z1, z2).toFixed(3)}`;

const seenWalls = new Set<string>();
const generatedWalls: WallSeg[] = [];

function pushWall(x1: number, z1: number, x2: number, z2: number, railing = false) {
  // Skip zero-length walls
  if (Math.abs(x1 - x2) < 0.001 && Math.abs(z1 - z2) < 0.001) return;
  const k = wallKey(x1, z1, x2, z2);
  if (seenWalls.has(k)) return;
  seenWalls.add(k);
  generatedWalls.push({ x1, z1, x2, z2, railing });
}

function isRailingSide(roomName: string, side: Side): boolean {
  const sides = RAILING_DECKS[roomName];
  return !!sides && sides.includes(side);
}

for (const r of ROOMS_SHIFTED) {
  for (const side of ['south', 'north', 'west', 'east'] as Side[]) {
    // Wall coords for this side:
    let axis: 'x' | 'z', fixed: number, start: number, end: number;
    if (side === 'south') { axis = 'x'; fixed = r.z1; start = r.x1; end = r.x2; }
    else if (side === 'north') { axis = 'x'; fixed = r.z2; start = r.x1; end = r.x2; }
    else if (side === 'west') { axis = 'z'; fixed = r.x1; start = r.z1; end = r.z2; }
    else { axis = 'z'; fixed = r.x2; start = r.z1; end = r.z2; }

    // Find doors on this wall (where room_a == r.name AND wall == side).
    // Also include doors from OTHER rooms where their wall (in their orientation) coincides with this wall.
    const onWall: AbsGap[] = [];
    for (const { door, abs } of DOORS_ABS) {
      if (!abs) continue;
      if (door.room_a === r.name && door.wall === side) {
        onWall.push(abs);
      } else {
        // Cross-wall check: door from another room whose wall happens to coincide with this room's wall.
        if (abs.wall_axis === axis && Math.abs(abs.wall_fixed - fixed) < 0.01) {
          // Overlap check: gap range overlaps with this wall's start..end.
          if (abs.gap_start >= start - 0.01 && abs.gap_end <= end + 0.01) {
            onWall.push(abs);
          }
        }
      }
    }

    // Sort gaps by start.
    onWall.sort((a, b) => a.gap_start - b.gap_start);

    // Generate wall segments between gaps.
    const railing = isRailingSide(r.name, side);
    let cursor = start;
    for (const g of onWall) {
      const gs = Math.max(cursor, g.gap_start);
      const ge = Math.min(end, g.gap_end);
      if (gs > cursor + 0.01) {
        // emit wall from cursor to gs
        if (axis === 'x') pushWall(cursor, fixed, gs, fixed, railing);
        else pushWall(fixed, cursor, fixed, gs, railing);
      }
      cursor = Math.max(cursor, ge);
    }
    if (cursor < end - 0.01) {
      if (axis === 'x') pushWall(cursor, fixed, end, fixed, railing);
      else pushWall(fixed, cursor, fixed, end, railing);
    }
  }
}

export const WALLS: WallSeg[] = generatedWalls;

// ============================================================
//   ROOMS + FURNITURE + SPAWN exports for scene.ts
// ============================================================

export interface RoomLabel { name: string; cx: number; cz: number }

export const ROOMS: RoomLabel[] = ROOMS_SHIFTED.map(r => ({
  name: r.name,
  cx: (r.x1 + r.x2) / 2,
  cz: (r.z1 + r.z2) / 2,
}));

// Export room rectangles for ceiling generation in scene.ts
export interface RoomRect { name: string; x1: number; z1: number; x2: number; z2: number; purpose: Purpose }
export const ROOM_RECTS: RoomRect[] = ROOMS_SHIFTED;

export interface FurnitureItem {
  name: string;
  room: string;
  x: number; z: number;
  width: number; depth: number; height: number;
  y?: number;
  color: [number, number, number];
  rotY?: number;
}

// Empty — user designs from scratch via AI.
export const FURNITURE: FurnitureItem[] = [];

// Spawn at Lobby (entry), facing east into the flat.
const lobby = roomByName.get('Lobby')!;
export const SPAWN = {
  x: (lobby.x1 + lobby.x2) / 2,
  z: (lobby.z1 + lobby.z2) / 2,
  y: 1.7,
  rotY: -Math.PI / 2,
};
