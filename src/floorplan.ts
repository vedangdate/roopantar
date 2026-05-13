// Floor plan — flat 804, Erandwane Central.
//
// Layout per photo (full image):
//   - South: Lobby + Common Toilet + Master Bedroom (with Master Deck on east)
//   - West-center: NW Toilet + NW Bedroom (N-S=4m, touches Big Deck on north)
//   - Center: Dining (south) + Living (center) — Living L-shape wraps around Kitchen
//   - North-center: Kitchen + Utility, north of Living main body
//   - North-east: Inner Lobby passage + Middle Bedroom + NE Toilet + NE Bedroom + NE Deck
//   - North-west: Big Deck (L-shape: north strip + west extension covering NW Bedroom + Living west strip)
//
// 4 sliders: NW Bedroom→Deck, Living→Deck, NE Bedroom→NE Deck, Master→Master Deck.
// Kitchen north wall has plain windows (no slider).
//
// Coordinates: metres. Origin SW corner. X = east, Z = north.

export const FLAT_WIDTH = 16.06;
export const FLAT_DEPTH = 16.21;
export const CEILING_HEIGHT = 3.0;
export const WALL_THICKNESS = 0.15;

export interface WallSeg {
  x1: number; z1: number;
  x2: number; z2: number;
}

export const WALLS: WallSeg[] = [
  // ====== Exterior perimeter ======
  // South wall
  { x1: 0, z1: 0, x2: FLAT_WIDTH, z2: 0 },
  // East wall — irregular (Master Deck, then NE Deck, etc.)
  { x1: FLAT_WIDTH, z1: 0, x2: FLAT_WIDTH, z2: 4.34 },
  { x1: 14.61, z1: 4.34, x2: FLAT_WIDTH, z2: 4.34 },
  { x1: 14.61, z1: 4.34, x2: 14.61, z2: 13.49 },
  { x1: 10.47, z1: 13.49, x2: 14.61, z2: 13.49 },
  { x1: 10.47, z1: 13.49, x2: 10.47, z2: 16.21 },           // step from NE Deck north to Big Deck north
  // Big Deck north wall
  { x1: 0, z1: 16.21, x2: 10.47, z2: 16.21 },
  // West wall
  { x1: 0, z1: 0, x2: 0, z2: 16.21 },

  // ====== Internal walls ======

  // ---- Lobby (x=4.83..7.27, z=0..1.42) ----
  // West wall = FRONT DOOR (gap z=0.4..1.1)
  { x1: 4.83, z1: 0,   x2: 4.83, z2: 0.4 },
  { x1: 4.83, z1: 1.1, x2: 4.83, z2: 1.42 },
  // North wall (door to Dining x=5.6..6.4)
  { x1: 4.83, z1: 1.42, x2: 5.6, z2: 1.42 },
  { x1: 6.4,  z1: 1.42, x2: 7.27, z2: 1.42 },
  // East wall (separates from Common Toilet)
  { x1: 7.27, z1: 0, x2: 7.27, z2: 1.42 },

  // ---- Common Toilet (x=7.27..9.56, z=0..1.40) ----
  { x1: 9.56, z1: 0, x2: 9.56, z2: 1.40 },
  // North wall (door to Dining x=7.8..8.5)
  { x1: 7.27, z1: 1.40, x2: 7.8,  z2: 1.40 },
  { x1: 8.5,  z1: 1.40, x2: 9.56, z2: 1.40 },

  // ---- NW Toilet (x=0..1.55, z=1.42..3.81) ----
  { x1: 0,    z1: 1.42, x2: 1.55, z2: 1.42 },
  { x1: 0,    z1: 3.81, x2: 1.55, z2: 3.81 },
  { x1: 1.55, z1: 1.42, x2: 1.55, z2: 2.4 },
  { x1: 1.55, z1: 3.1,  x2: 1.55, z2: 3.81 },

  // ---- NW Bedroom (x=1.55..4.83, z=1.42..5.41) ----
  { x1: 1.55, z1: 1.42, x2: 4.83, z2: 1.42 },               // south wall
  // East wall (Dining/Living): door gap z=2.5..3.3 (Dining) and z=4.0..4.8 (Living)
  { x1: 4.83, z1: 1.42, x2: 4.83, z2: 2.5 },
  { x1: 4.83, z1: 3.3,  x2: 4.83, z2: 4.0 },
  { x1: 4.83, z1: 4.8,  x2: 4.83, z2: 5.41 },
  // North wall = Big Deck south (slider gap x=2.0..3.0)
  { x1: 0,    z1: 5.41, x2: 2.0,  z2: 5.41 },
  { x1: 3.0,  z1: 5.41, x2: 4.83, z2: 5.41 },

  // ---- Dining (x=4.83..8.77, z=1.42..4.75) ----
  // East wall (door to Inner Lobby z=2.5..3.3)
  { x1: 8.77, z1: 1.42, x2: 8.77, z2: 2.5 },
  { x1: 8.77, z1: 3.3,  x2: 8.77, z2: 4.75 },
  // No wall between Dining north and Living south — open

  // ---- Living main body (x=4.83..8.77, z=4.75..10.39) ----
  // East wall continued
  { x1: 8.77, z1: 4.75, x2: 8.77, z2: 7.77 },
  // North wall — kitchen on west portion, opens to Living west strip on east
  // Wait, Kitchen is at x=6.08..8.77 (east half), Living strip x=4.83..6.08 (west)
  // Wall between Living main body and Kitchen at z=10.39: door gap x=7.0..8.0
  { x1: 6.08, z1: 10.39, x2: 7.0,  z2: 10.39 },             // Living↔Kitchen wall (east of strip)
  { x1: 8.0,  z1: 10.39, x2: 8.77, z2: 10.39 },             // east of kitchen door
  // No wall between Living main body and Living west strip (open)

  // ---- Living west strip (x=4.83..6.08, z=10.39..13.82) ----
  // East wall = Kitchen west wall
  { x1: 6.08, z1: 10.39, x2: 6.08, z2: 13.82 },
  // North wall = Big Deck (slider gap x=5.0..5.9)
  { x1: 4.83, z1: 13.82, x2: 5.0,  z2: 13.82 },
  { x1: 5.9,  z1: 13.82, x2: 6.08, z2: 13.82 },

  // ---- Kitchen (x=6.08..8.77, z=10.39..13.82) ----
  // North wall = Big Deck south (no door — kitchen has plain windows)
  { x1: 6.08, z1: 13.82, x2: 8.77, z2: 13.82 },
  // East wall — separates kitchen from Utility area
  { x1: 8.77, z1: 10.39, x2: 8.77, z2: 13.82 },

  // ---- Utility (small, east of kitchen, x=8.77..10.27, z=12.63..13.82) ----
  // Tucked in NE corner of kitchen area
  { x1: 8.77, z1: 12.63, x2: 10.27, z2: 12.63 },            // south wall
  { x1: 10.27, z1: 12.63, x2: 10.27, z2: 13.82 },           // east wall
  // North wall = Big Deck south at this x range
  { x1: 8.77, z1: 13.82, x2: 10.27, z2: 13.82 },

  // ---- Big Deck (L-shape) ----
  // East wall of west extension (separates Deck-west from Living west wall + Kitchen west)
  // From z=5.41 (NW Bedroom north) up to z=13.82 (Living west strip north): x=4.83
  // But Living west strip is at x=4.83..6.08; deck-west extension at x=0..4.83
  // West extension east wall at x=4.83, z=5.41..13.82 — but Living's west wall is at x=4.83 z=4.75..10.39 already.
  // Above z=10.39 at x=4.83: still wall, separates Living west strip (east of 4.83? No strip starts at 4.83) from deck west extension.
  // Living west strip x=4.83..6.08, so x=4.83 = Living west wall = Deck-west-ext east wall.
  // Already drawn? At z=10.39..13.82, x=4.83 wall? Not yet. Add:
  { x1: 4.83, z1: 5.41, x2: 4.83, z2: 13.82 },              // wall between Deck-west-ext and Living west strip / Living
  // North wall of Big Deck at z=16.21 already drawn (perimeter)
  // South wall of Big Deck north strip (z=13.82) — covers north of Living west strip + Kitchen + Utility — drawn above

  // ---- Inner Lobby (x=8.77..10.47, z=1.42..7.77) ----
  // South wall (closes gap between Common Toilet and Master)
  { x1: 9.56, z1: 1.40, x2: 10.47, z2: 1.40 },
  // North end blocked by Middle Bedroom south wall

  // ---- Master Bedroom (x=10.47..14.61, z=0..4.44) ----
  // West wall (door from Inner Lobby z=1.8..2.6)
  { x1: 10.47, z1: 0,   x2: 10.47, z2: 1.8 },
  { x1: 10.47, z1: 2.6, x2: 10.47, z2: 4.44 },
  // North wall (separates Master from Middle)
  { x1: 10.47, z1: 4.44, x2: 14.61, z2: 4.44 },
  // East wall — Master Deck slider gap z=2.0..3.8
  { x1: 14.61, z1: 0,   x2: 14.61, z2: 2.0 },
  { x1: 14.61, z1: 3.8, x2: 14.61, z2: 4.34 },

  // ---- Master Toilet (alcove) ----
  { x1: 10.47, z1: 1.85, x2: 12.02, z2: 1.85 },
  { x1: 12.02, z1: 1.85, x2: 12.02, z2: 3.5 },
  { x1: 12.02, z1: 4.1,  x2: 12.02, z2: 4.44 },

  // ---- Middle Bedroom (x=10.47..14.61, z=4.44..7.77) ----
  // West wall (door from Inner Lobby z=5.2..6.0)
  { x1: 10.47, z1: 4.44, x2: 10.47, z2: 5.2 },
  { x1: 10.47, z1: 6.0,  x2: 10.47, z2: 7.77 },
  // North wall (separates from NE Bedroom)
  { x1: 10.47, z1: 7.77, x2: 14.61, z2: 7.77 },

  // ---- NE Bedroom (x=10.47..14.61, z=7.77..12.14) ----
  // West wall: door from Inner Lobby z=7.77..8.69, then NE Toilet east wall
  { x1: 10.47, z1: 8.69, x2: 10.47, z2: 10.0 },
  { x1: 10.47, z1: 10.6, x2: 10.47, z2: 12.14 },
  // North wall: NE Deck slider gap x=11.5..13.3
  { x1: 10.47, z1: 12.14, x2: 11.5, z2: 12.14 },
  { x1: 13.3,  z1: 12.14, x2: 14.61, z2: 12.14 },

  // ---- NE Toilet (x=8.64..10.47, z=8.69..11.43) ----
  { x1: 8.64, z1: 8.69, x2: 8.64, z2: 11.43 },              // west wall
  { x1: 8.64, z1: 8.69, x2: 10.47, z2: 8.69 },              // south wall
  { x1: 8.64, z1: 11.43, x2: 10.47, z2: 11.43 },            // north wall
];

export interface RoomLabel {
  name: string;
  cx: number; cz: number;
}

export const ROOMS: RoomLabel[] = [
  { name: 'Lobby',          cx: 6.05,  cz: 0.71 },
  { name: 'Common Toilet',  cx: 8.42,  cz: 0.70 },
  { name: 'NW Toilet',      cx: 0.78,  cz: 2.62 },
  { name: 'NW Bedroom',     cx: 3.19,  cz: 3.42 },
  { name: 'Dining',         cx: 6.80,  cz: 3.09 },
  { name: 'Living',         cx: 6.80,  cz: 7.57 },
  { name: 'Kitchen',        cx: 7.43,  cz: 12.11 },
  { name: 'Utility',        cx: 9.52,  cz: 13.22 },
  { name: 'Big Deck',       cx: 2.40,  cz: 8.50 },
  { name: 'Inner Lobby',    cx: 9.62,  cz: 4.60 },
  { name: 'NE Toilet',      cx: 9.55,  cz: 10.06 },
  { name: 'NE Bedroom',     cx: 12.54, cz: 9.96 },
  { name: 'NE Deck',        cx: 12.54, cz: 12.82 },
  { name: 'Middle Bedroom', cx: 12.54, cz: 6.11 },
  { name: 'Master Bedroom', cx: 13.32, cz: 3.15 },
  { name: 'Master Toilet',  cx: 11.25, cz: 3.15 },
  { name: 'Master Deck',    cx: 15.33, cz: 2.17 },
];

export interface FurnitureItem {
  name: string;
  room: string;
  x: number; z: number;
  width: number; depth: number; height: number;
  y?: number;
  color: [number, number, number];
  rotY?: number;
}

export const FURNITURE: FurnitureItem[] = [
  // ===== NW Toilet =====
  { name: 'commode (NW)',       room: 'NW Toilet', x: 0.3, z: 3.4, width: 0.4, depth: 0.65, height: 0.42, color: [0.96, 0.96, 0.96] },
  { name: 'cistern (NW)',       room: 'NW Toilet', x: 0.2, z: 3.4, width: 0.18, depth: 0.4, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'shower base (NW)',   room: 'NW Toilet', x: 0.4, z: 2.05, width: 0.8, depth: 0.8, height: 0.05, color: [0.78, 0.78, 0.82] },
  { name: 'shower glass (NW)',  room: 'NW Toilet', x: 0.83, z: 2.05, width: 0.04, depth: 0.8, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower head (NW)',   room: 'NW Toilet', x: 0.15, z: 2.05, width: 0.15, depth: 0.15, height: 0.1, y: 2.0, color: [0.78, 0.78, 0.82] },
  { name: 'basin (NW)',         room: 'NW Toilet', x: 1.3, z: 1.75, width: 0.45, depth: 0.40, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'mirror (NW)',        room: 'NW Toilet', x: 1.43, z: 1.75, width: 0.08, depth: 0.7, height: 0.7, y: 1.2, color: [0.30, 0.45, 0.55] },

  // ===== NW Bedroom =====
  { name: 'bed (NW)',           room: 'NW Bedroom', x: 3.0, z: 3.4, width: 1.6, depth: 2.0, height: 0.55, color: [0.78, 0.71, 0.60] },
  { name: 'nightstand (NW)',    room: 'NW Bedroom', x: 4.3, z: 2.3, width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'wardrobe (NW)',      room: 'NW Bedroom', x: 2.5, z: 4.95, width: 1.8, depth: 0.55, height: 2.4, color: [0.30, 0.18, 0.11] },

  // ===== Lobby =====
  { name: 'console',            room: 'Lobby', x: 5.05, z: 1.20, width: 1.0, depth: 0.3, height: 0.85, color: [0.42, 0.27, 0.18] },

  // ===== Common Toilet =====
  { name: 'commode (common)',   room: 'Common Toilet', x: 7.55, z: 0.4, width: 0.4, depth: 0.65, height: 0.42, color: [0.96, 0.96, 0.96] },
  { name: 'cistern (common)',   room: 'Common Toilet', x: 7.45, z: 0.25, width: 0.18, depth: 0.4, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'basin (common)',     room: 'Common Toilet', x: 8.7, z: 0.3, width: 0.45, depth: 0.40, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'mirror (common)',    room: 'Common Toilet', x: 8.7, z: 0.12, width: 0.7, depth: 0.04, height: 0.7, y: 1.2, color: [0.30, 0.45, 0.55] },
  { name: 'shower base (common)',  room: 'Common Toilet', x: 9.2, z: 1.0, width: 0.7, depth: 0.7, height: 0.05, color: [0.78, 0.78, 0.82] },
  { name: 'shower glass (common)', room: 'Common Toilet', x: 9.2, z: 0.62, width: 0.7, depth: 0.04, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower head (common)',  room: 'Common Toilet', x: 9.45, z: 1.05, width: 0.15, depth: 0.15, height: 0.1, y: 2.0, color: [0.78, 0.78, 0.82] },

  // ===== Dining =====
  { name: 'dining table',       room: 'Dining', x: 6.78, z: 3.0, width: 1.6, depth: 0.95, height: 0.75, color: [0.40, 0.26, 0.16] },
  { name: 'dining chair 1',     room: 'Dining', x: 6.1, z: 2.3, width: 0.45, depth: 0.45, height: 0.85, color: [0.35, 0.22, 0.14] },
  { name: 'dining chair 2',     room: 'Dining', x: 6.78, z: 2.3, width: 0.45, depth: 0.45, height: 0.85, color: [0.35, 0.22, 0.14] },
  { name: 'dining chair 3',     room: 'Dining', x: 7.45, z: 2.3, width: 0.45, depth: 0.45, height: 0.85, color: [0.35, 0.22, 0.14] },
  { name: 'dining chair 4',     room: 'Dining', x: 6.78, z: 3.7, width: 0.45, depth: 0.45, height: 0.85, color: [0.35, 0.22, 0.14] },

  // ===== Living =====
  { name: 'sofa',               room: 'Living', x: 6.5, z: 6.0, width: 2.5, depth: 0.95, height: 0.8, color: [0.55, 0.25, 0.18] },
  { name: 'armchair',           room: 'Living', x: 8.1, z: 8.3, width: 0.9, depth: 0.9, height: 0.85, color: [0.65, 0.45, 0.30] },
  { name: 'coffee table',       room: 'Living', x: 6.78, z: 7.5, width: 1.2, depth: 0.6, height: 0.45, color: [0.42, 0.27, 0.18] },
  { name: 'tv unit',            room: 'Living', x: 5.05, z: 7.5, width: 0.4, depth: 2.0, height: 0.55, color: [0.15, 0.12, 0.10] },
  { name: 'rug (living)',       room: 'Living', x: 6.78, z: 7.5, width: 3.0, depth: 2.4, height: 0.02, color: [0.45, 0.32, 0.22] },

  // ===== Kitchen =====
  { name: 'counter (kitchen N)',  room: 'Kitchen', x: 7.43, z: 13.55, width: 2.5, depth: 0.6, height: 0.9, color: [0.85, 0.78, 0.68] },
  { name: 'counter (kitchen W)',  room: 'Kitchen', x: 6.35, z: 12.11, width: 0.6, depth: 3.0, height: 0.9, color: [0.85, 0.78, 0.68] },
  { name: 'fridge',               room: 'Kitchen', x: 8.45, z: 13.45, width: 0.7, depth: 0.7, height: 1.8, color: [0.92, 0.92, 0.92] },
  { name: 'hob/oven',             room: 'Kitchen', x: 7.0, z: 13.55, width: 0.7, depth: 0.6, height: 0.92, color: [0.20, 0.18, 0.18] },

  // ===== Utility =====
  { name: 'washing machine',    room: 'Utility', x: 9.0, z: 13.2, width: 0.6, depth: 0.6, height: 0.85, color: [0.88, 0.88, 0.88] },
  { name: 'utility shelf',      room: 'Utility', x: 10.0, z: 13.4, width: 0.25, depth: 0.4, height: 1.6, color: [0.45, 0.32, 0.22] },

  // ===== Big Deck =====
  { name: 'plant (deck-W)',     room: 'Big Deck', x: 1.5, z: 8.0, width: 0.5, depth: 0.5, height: 1.4, color: [0.25, 0.50, 0.25] },
  { name: 'lounger (deck)',     room: 'Big Deck', x: 2.5, z: 11.0, width: 0.7, depth: 1.6, height: 0.4, color: [0.45, 0.35, 0.22] },
  { name: 'plant (deck-N)',     room: 'Big Deck', x: 8.5, z: 15.6, width: 0.5, depth: 0.5, height: 1.4, color: [0.25, 0.50, 0.25] },
  { name: 'side table (deck)',  room: 'Big Deck', x: 3.6, z: 11.0, width: 0.5, depth: 0.5, height: 0.45, color: [0.42, 0.27, 0.18] },

  // ===== NE Toilet =====
  { name: 'commode (NE)',       room: 'NE Toilet', x: 8.9, z: 11.1, width: 0.4, depth: 0.65, height: 0.42, color: [0.96, 0.96, 0.96] },
  { name: 'cistern (NE)',       room: 'NE Toilet', x: 8.75, z: 11.25, width: 0.18, depth: 0.4, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'shower base (NE)',   room: 'NE Toilet', x: 8.95, z: 9.15, width: 0.85, depth: 0.9, height: 0.05, color: [0.78, 0.78, 0.82] },
  { name: 'shower glass NE-1',  room: 'NE Toilet', x: 9.40, z: 9.15, width: 0.04, depth: 0.9, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower glass NE-2',  room: 'NE Toilet', x: 8.95, z: 9.60, width: 0.85, depth: 0.04, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower head (NE)',   room: 'NE Toilet', x: 8.7,  z: 9.15, width: 0.15, depth: 0.15, height: 0.1, y: 2.0, color: [0.78, 0.78, 0.82] },
  { name: 'basin (NE)',         room: 'NE Toilet', x: 10.2, z: 9.0, width: 0.45, depth: 0.40, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'mirror (NE)',        room: 'NE Toilet', x: 10.35,z: 9.0, width: 0.08, depth: 0.7, height: 0.7, y: 1.2, color: [0.30, 0.45, 0.55] },

  // ===== NE Bedroom =====
  { name: 'bed (NE)',           room: 'NE Bedroom', x: 12.5, z: 10.5, width: 1.8, depth: 2.0, height: 0.55, color: [0.78, 0.71, 0.60] },
  { name: 'nightstand (NE-1)',  room: 'NE Bedroom', x: 13.8, z: 9.4,  width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'wardrobe (NE)',      room: 'NE Bedroom', x: 14.3, z: 10.5, width: 0.55, depth: 1.8, height: 2.4, color: [0.30, 0.18, 0.11] },
  { name: 'desk (NE)',          room: 'NE Bedroom', x: 11.0, z: 8.3,  width: 1.2, depth: 0.5, height: 0.75, color: [0.42, 0.27, 0.18] },

  // ===== NE Deck =====
  { name: 'plant (NE)',         room: 'NE Deck', x: 11.5, z: 13.0, width: 0.5, depth: 0.5, height: 1.2, color: [0.25, 0.50, 0.25] },

  // ===== Middle Bedroom =====
  { name: 'bed (middle)',       room: 'Middle Bedroom', x: 12.5, z: 6.0, width: 1.8, depth: 2.0, height: 0.55, color: [0.68, 0.62, 0.50] },
  { name: 'wardrobe (middle)',  room: 'Middle Bedroom', x: 14.3, z: 6.0, width: 0.55, depth: 1.6, height: 2.4, color: [0.30, 0.18, 0.11] },
  { name: 'desk (middle)',      room: 'Middle Bedroom', x: 11.0, z: 4.95, width: 1.2, depth: 0.5, height: 0.75, color: [0.42, 0.27, 0.18] },

  // ===== Master Bedroom =====
  { name: 'bed (master)',       room: 'Master Bedroom', x: 13.5, z: 2.7, width: 2.0, depth: 1.7, height: 0.55, color: [0.65, 0.55, 0.45] },
  { name: 'nightstand (m1)',    room: 'Master Bedroom', x: 12.3, z: 2.2, width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'nightstand (m2)',    room: 'Master Bedroom', x: 14.5, z: 2.2, width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'wardrobe (master)',  room: 'Master Bedroom', x: 14.3, z: 4.1, width: 0.55, depth: 1.8, height: 2.4, color: [0.30, 0.18, 0.11] },

  // ===== Master Toilet =====
  { name: 'commode (master)',   room: 'Master Toilet', x: 10.75, z: 3.9, width: 0.4, depth: 0.65, height: 0.42, color: [0.96, 0.96, 0.96] },
  { name: 'cistern (master)',   room: 'Master Toilet', x: 10.6,  z: 4.05, width: 0.18, depth: 0.4, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'shower base (master)', room: 'Master Toilet', x: 10.75, z: 2.25, width: 0.7, depth: 0.7, height: 0.05, color: [0.78, 0.78, 0.82] },
  { name: 'shower glass M-1',     room: 'Master Toilet', x: 11.20, z: 2.25, width: 0.04, depth: 0.7, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower glass M-2',     room: 'Master Toilet', x: 10.75, z: 2.60, width: 0.7, depth: 0.04, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower head (master)', room: 'Master Toilet', x: 10.55, z: 2.25, width: 0.15, depth: 0.15, height: 0.1, y: 2.0, color: [0.78, 0.78, 0.82] },
  { name: 'basin (master)',       room: 'Master Toilet', x: 11.7,  z: 2.05, width: 0.45, depth: 0.4, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'mirror (master)',      room: 'Master Toilet', x: 11.7,  z: 1.90, width: 0.7, depth: 0.04, height: 0.7, y: 1.2, color: [0.30, 0.45, 0.55] },

  // ===== Master Deck =====
  { name: 'plant (master)',     room: 'Master Deck', x: 15.2, z: 1.0, width: 0.5, depth: 0.5, height: 1.2, color: [0.25, 0.50, 0.25] },
  { name: 'lounger (master)',   room: 'Master Deck', x: 15.2, z: 3.0, width: 0.7, depth: 1.6, height: 0.4, color: [0.45, 0.35, 0.22] },

  // ===== Windows (plain, on exterior walls) =====
  // Kitchen north plain windows
  { name: 'window Kitchen-1',  room: 'Kitchen', x: 6.8,  z: 13.79, width: 1.2, depth: 0.06, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  { name: 'window Kitchen-2',  room: 'Kitchen', x: 8.2,  z: 13.79, width: 1.2, depth: 0.06, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  // Bedroom east-wall windows
  { name: 'window NE-east-1',  room: 'NE Bedroom',     x: 14.50, z: 9.0,  width: 0.08, depth: 1.4, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  { name: 'window NE-east-2',  room: 'NE Bedroom',     x: 14.50, z: 11.4, width: 0.08, depth: 1.4, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  { name: 'window Mid-east-1', room: 'Middle Bedroom', x: 14.50, z: 5.0, width: 0.08, depth: 1.4, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  { name: 'window Mid-east-2', room: 'Middle Bedroom', x: 14.50, z: 7.0, width: 0.08, depth: 1.4, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  { name: 'window Mdeck-east-1', room: 'Master Deck',  x: 15.95, z: 0.7, width: 0.06, depth: 1.2, height: 2.0, y: 0.5, color: [0.62, 0.82, 0.95] },
  { name: 'window Mdeck-east-2', room: 'Master Deck',  x: 15.95, z: 3.4, width: 0.06, depth: 1.2, height: 2.0, y: 0.5, color: [0.62, 0.82, 0.95] },
  // Big Deck north exterior windows (deck-side)
  { name: 'window Deck-N-1',   room: 'Big Deck', x: 3.0, z: 16.16, width: 1.6, depth: 0.06, height: 1.4, y: 0.8, color: [0.62, 0.82, 0.95] },
  { name: 'window Deck-N-2',   room: 'Big Deck', x: 7.5, z: 16.16, width: 1.6, depth: 0.06, height: 1.4, y: 0.8, color: [0.62, 0.82, 0.95] },
  // NE Deck windows
  { name: 'window NE-deck-1',  room: 'NE Deck', x: 11.0, z: 13.45, width: 1.4, depth: 0.06, height: 1.4, y: 0.8, color: [0.62, 0.82, 0.95] },
  { name: 'window NE-deck-2',  room: 'NE Deck', x: 13.5, z: 13.45, width: 1.4, depth: 0.06, height: 1.4, y: 0.8, color: [0.62, 0.82, 0.95] },

  // ===== 4 Sliding French Doors =====
  // 1. NW Bedroom -> Big Deck (slider gap x=2.0..3.0 on z=5.41)
  { name: 'slider NW-frame', room: 'NW Bedroom', x: 2.5, z: 5.41, width: 1.0, depth: 0.08, height: 2.4, color: [0.18, 0.18, 0.20] },
  { name: 'slider NW-glass', room: 'NW Bedroom', x: 2.5, z: 5.41, width: 0.95, depth: 0.04, height: 2.1, y: 0.15, color: [0.30, 0.65, 0.75] },
  // 2. Living west strip -> Big Deck (slider gap x=5.0..5.9 on z=13.82)
  { name: 'slider Liv-frame', room: 'Living', x: 5.45, z: 13.82, width: 0.9, depth: 0.08, height: 2.4, color: [0.18, 0.18, 0.20] },
  { name: 'slider Liv-glass', room: 'Living', x: 5.45, z: 13.82, width: 0.85, depth: 0.04, height: 2.1, y: 0.15, color: [0.30, 0.65, 0.75] },
  // 3. NE Bedroom -> NE Deck (slider gap x=11.5..13.3 on z=12.14)
  { name: 'slider NE-frame', room: 'NE Bedroom', x: 12.4, z: 12.14, width: 1.8, depth: 0.08, height: 2.4, color: [0.18, 0.18, 0.20] },
  { name: 'slider NE-glass', room: 'NE Bedroom', x: 12.4, z: 12.14, width: 1.75, depth: 0.04, height: 2.1, y: 0.15, color: [0.30, 0.65, 0.75] },
  // 4. Master Bedroom -> Master Deck (slider gap z=2.0..3.8 on x=14.61)
  { name: 'slider M-frame',  room: 'Master Bedroom', x: 14.61, z: 2.9, width: 0.08, depth: 1.8, height: 2.4, color: [0.18, 0.18, 0.20] },
  { name: 'slider M-glass',  room: 'Master Bedroom', x: 14.61, z: 2.9, width: 0.04, depth: 1.75, height: 2.1, y: 0.15, color: [0.30, 0.65, 0.75] },
];

// Spawn just inside the front door (west wall of Lobby), facing east.
export const SPAWN = {
  x: 5.5,
  z: 0.7,
  y: 1.7,
  rotY: -Math.PI / 2,
};
