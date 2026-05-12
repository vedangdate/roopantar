// Floor plan — flat 804, Erandwane Central. Vedang's actual home.
// 4BHK:
//   - 1 bedroom attached to Living + Lobby (NW corner of the flat)
//   - 3 bedrooms in a single line along the east wall (NE → Middle → Master, north-to-south)
// + Kitchen and Utility on the north side, big deck along the north exterior,
//   smaller decks on the east side (off NE bedroom and off master).
//
// Source: ~/Library/CloudStorage/OneDrive-Personal/Documents/Family/
//         sthaavar maalmatta - jameen/erandwane central/interior/Modified 804.jpg
//
// All units in metres. Origin (0,0) is at the SW corner of the flat.
// X = east, Z = north, Y = up. Dimensions are approximate (sketched from a
// photo of the printed plan); topology is correct but exact widths can be
// fine-tuned later.

export const FLAT_WIDTH = 14;   // east-west
export const FLAT_DEPTH = 12;   // north-south
export const CEILING_HEIGHT = 3.0;
export const WALL_THICKNESS = 0.15;

export interface WallSeg {
  x1: number; z1: number;
  x2: number; z2: number;
}

// Wall segments. Each is a horizontal or vertical line on the XZ plane;
// the renderer extrudes them vertically by CEILING_HEIGHT. Doorways are
// expressed by leaving a gap in the wall.
export const WALLS: WallSeg[] = [
  // ====== Exterior perimeter ======
  // South wall (front of flat) — has a doorway gap (entrance) from x=3.0 to x=4.2
  { x1: 0,   z1: 0,   x2: 3.0, z2: 0 },
  { x1: 4.2, z1: 0,   x2: FLAT_WIDTH, z2: 0 },
  // East wall (with notched east deck at SE)
  { x1: FLAT_WIDTH, z1: 0, x2: FLAT_WIDTH, z2: FLAT_DEPTH },
  // North wall
  { x1: 0, z1: FLAT_DEPTH, x2: FLAT_WIDTH, z2: FLAT_DEPTH },
  // West wall
  { x1: 0, z1: 0, x2: 0, z2: FLAT_DEPTH },

  // ====== Internal walls ======

  // ---- Lobby (entrance foyer, just inside the front door) ----
  // Lobby occupies x=2.4..4.5, z=0..2.0. Door gap on its south face (entrance).
  // East wall of Lobby (separating Lobby from Living): door gap z=0.8..1.6
  { x1: 4.5, z1: 0,   x2: 4.5, z2: 0.8 },
  { x1: 4.5, z1: 1.6, x2: 4.5, z2: 2.0 },
  // West wall of Lobby (separating Lobby from NW Bedroom): door gap z=0.6..1.4
  { x1: 2.4, z1: 0,   x2: 2.4, z2: 0.6 },
  { x1: 2.4, z1: 1.4, x2: 2.4, z2: 2.0 },
  // North wall of Lobby (separating Lobby from Living open hall)
  { x1: 2.4, z1: 2.0, x2: 4.5, z2: 2.0 },

  // ---- NW Bedroom (the one attached to Lobby + Living) ----
  // NW Bedroom: x=0..2.4, z=0..5.8. Door from Lobby on east wall (above).
  // East wall (separating from Living open hall): door gap z=2.4..3.2
  { x1: 2.4, z1: 2.0, x2: 2.4, z2: 2.4 },
  { x1: 2.4, z1: 3.2, x2: 2.4, z2: 5.8 },
  // North wall (separating from NW en-suite toilet) — door gap x=0.8..1.6
  { x1: 0,   z1: 5.8, x2: 0.8, z2: 5.8 },
  { x1: 1.6, z1: 5.8, x2: 2.4, z2: 5.8 },

  // ---- NW Toilet (en-suite for NW bedroom, the 5'1"×7'10" one that
  // sits at the boundary with flat 803, NOT the one bordering the big
  // living-room deck — that one belongs to 803).
  // x=0..2.4 (full west width of our portion), z=5.8..7.4 (1.6m deep).
  // East wall (separates toilet from Living open hall):
  { x1: 2.4, z1: 5.8, x2: 2.4, z2: 7.4 },
  // North wall (separates toilet from what's beyond — i.e. flat 803's
  // toilet north of us, or the deck-west strip):
  { x1: 0,   z1: 7.4, x2: 2.4, z2: 7.4 },

  // ---- Kitchen west wall (separates kitchen from the strip west of
  // it that's bounded by the NW toilet on the south and the deck on
  // the north — keeps the player out of that dead zone) ----
  { x1: 2.4, z1: 7.4, x2: 2.4, z2: 10.5 },

  // ---- Living / Dining (one big open hall) ----
  // Living+Dining is a single L-shaped hall: from x=2.4..10 z=0..7,
  // plus a strip x=4.5..10 z=0..2.0 connecting Lobby. Walls below
  // separate it from kitchen (north) and east bedrooms (east).

  // Living north wall (separating from Kitchen): door gap x=6.0..7.0
  { x1: 2.4, z1: 7.0, x2: 6.0, z2: 7.0 },
  { x1: 7.0, z1: 7.0, x2: 10,  z2: 7.0 },

  // Living/Dining east wall (separating from east bedrooms, 3 doors total):
  // Master door: z=1.6..2.4
  // Middle door: z=4.0..4.8
  // NE door:     z=8.6..9.4
  { x1: 10, z1: 0,   x2: 10, z2: 1.6 },
  { x1: 10, z1: 2.4, x2: 10, z2: 4.0 },
  { x1: 10, z1: 4.8, x2: 10, z2: 8.6 },
  { x1: 10, z1: 9.4, x2: 10, z2: FLAT_DEPTH },

  // ---- Kitchen + Utility (north of Living, west portion) ----
  // Kitchen: x=2.4..6.5, z=7.0..10.5 (3.5m × 3.5m).
  // Kitchen east wall (separating from a small toilet between kitchen and NE bedroom):
  { x1: 6.5, z1: 7.0, x2: 6.5, z2: 10.5 },
  // Kitchen north wall (separating from north deck): door gap x=3.5..4.5
  { x1: 2.4, z1: 10.5, x2: 3.5, z2: 10.5 },
  { x1: 4.5, z1: 10.5, x2: 6.5, z2: 10.5 },

  // ---- Toilet between Kitchen and NE bedroom (the 6'0"x9'0" one) ----
  // x=6.5..7.6, z=7.0..10.0
  { x1: 7.6, z1: 7.0,  x2: 7.6, z2: 10.0 },
  { x1: 6.5, z1: 10.0, x2: 7.6, z2: 10.0 },

  // ---- Utility (between toilet and NE bedroom) ----
  // x=7.6..10, z=9.5..10.5 (small utility area)
  { x1: 7.6, z1: 9.5, x2: 10, z2: 9.5 },

  // ---- North Deck ----
  // x=2.4..10, z=10.5..FLAT_DEPTH (1.5m deep). No walls between deck and exterior —
  // perimeter is the building exterior on north.

  // ---- East bedrooms (3 in a line) ----
  // NE Bedroom: x=10..FLAT_WIDTH, z=8.0..FLAT_DEPTH (4m × 4m)
  //   East deck (small) on its east side via wall gap. For v0, no deck door.
  // Middle Bedroom: x=10..FLAT_WIDTH, z=4.0..8.0 (4m × 4m)
  // Master Bedroom: x=10..FLAT_WIDTH, z=0..4.0 (4m × 4m)

  // Wall between Master and Middle (z=4):
  { x1: 10, z1: 4.0, x2: FLAT_WIDTH, z2: 4.0 },
  // Wall between Middle and NE (z=8):
  { x1: 10, z1: 8.0, x2: FLAT_WIDTH, z2: 8.0 },
];

export interface RoomLabel {
  name: string;
  cx: number; cz: number;
}

export const ROOMS: RoomLabel[] = [
  { name: 'Lobby',           cx: 3.4,  cz: 1.0 },
  { name: 'NW Bedroom',      cx: 1.2,  cz: 3.5 },
  { name: 'NW Toilet',       cx: 1.2,  cz: 6.6 },
  { name: 'Living',          cx: 7.0,  cz: 4.5 },
  { name: 'Dining',          cx: 7.0,  cz: 1.5 },
  { name: 'Kitchen',         cx: 4.5,  cz: 8.7 },
  { name: 'North Deck',      cx: 5.5,  cz: 11.2 },
  { name: 'Master Bedroom',  cx: 12,   cz: 2.0 },
  { name: 'Middle Bedroom',  cx: 12,   cz: 6.0 },
  { name: 'NE Bedroom',      cx: 12,   cz: 10  },
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
  // ===== NW Bedroom =====
  { name: 'bed (NW)',         room: 'NW Bedroom', x: 1.2, z: 4.0, width: 1.6, depth: 2.0, height: 0.55, color: [0.78, 0.71, 0.60] },
  { name: 'nightstand (NW)',  room: 'NW Bedroom', x: 0.4, z: 5.4, width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'wardrobe (NW)',    room: 'NW Bedroom', x: 2.05,z: 4.5, width: 0.55, depth: 1.8, height: 2.4, color: [0.30, 0.18, 0.11] },

  // ===== Lobby =====
  { name: 'console',          room: 'Lobby',      x: 3.4, z: 1.85, width: 1.0, depth: 0.3, height: 0.85, color: [0.42, 0.27, 0.18] },

  // ===== Living =====
  { name: 'sofa',             room: 'Living',     x: 5.5, z: 3.0, width: 2.6, depth: 0.95, height: 0.8, color: [0.55, 0.25, 0.18] },
  { name: 'armchair',         room: 'Living',     x: 8.5, z: 3.4, width: 0.9, depth: 0.9, height: 0.85, color: [0.65, 0.45, 0.30] },
  { name: 'coffee table',     room: 'Living',     x: 6.5, z: 4.2, width: 1.2, depth: 0.6, height: 0.45, color: [0.42, 0.27, 0.18] },
  { name: 'tv unit',          room: 'Living',     x: 9.7, z: 5.0, width: 0.4, depth: 2.0, height: 0.55, color: [0.15, 0.12, 0.10] },
  { name: 'rug',              room: 'Living',     x: 6.5, z: 3.8, width: 3.5, depth: 2.2, height: 0.02, color: [0.45, 0.32, 0.22] },

  // ===== Dining =====
  { name: 'dining table',     room: 'Dining',     x: 7.0, z: 1.2, width: 1.6, depth: 0.95, height: 0.75, color: [0.40, 0.26, 0.16] },
  { name: 'dining chair 1',   room: 'Dining',     x: 6.2, z: 0.7, width: 0.45, depth: 0.45, height: 0.85, color: [0.35, 0.22, 0.14] },
  { name: 'dining chair 2',   room: 'Dining',     x: 7.0, z: 0.7, width: 0.45, depth: 0.45, height: 0.85, color: [0.35, 0.22, 0.14] },
  { name: 'dining chair 3',   room: 'Dining',     x: 7.8, z: 0.7, width: 0.45, depth: 0.45, height: 0.85, color: [0.35, 0.22, 0.14] },

  // ===== Kitchen =====
  { name: 'counter (north)',  room: 'Kitchen',    x: 4.4, z: 10.2, width: 3.9, depth: 0.6, height: 0.9, color: [0.85, 0.78, 0.68] },
  { name: 'counter (west)',   room: 'Kitchen',    x: 2.8, z: 8.7,  width: 0.6, depth: 3.0, height: 0.9, color: [0.85, 0.78, 0.68] },
  { name: 'fridge',           room: 'Kitchen',    x: 6.1, z: 9.8,  width: 0.7, depth: 0.7, height: 1.8, color: [0.92, 0.92, 0.92] },
  { name: 'hob/oven',         room: 'Kitchen',    x: 5.0, z: 10.2, width: 0.7, depth: 0.6, height: 0.92, color: [0.20, 0.18, 0.18] },

  // ===== NE Bedroom =====
  { name: 'bed (NE)',         room: 'NE Bedroom', x: 12.5, z: 10.5, width: 1.8, depth: 2.0, height: 0.55, color: [0.78, 0.71, 0.60] },
  { name: 'nightstand (NE)',  room: 'NE Bedroom', x: 13.6, z: 9.2,  width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'wardrobe (NE)',    room: 'NE Bedroom', x: 10.3, z: 10.0, width: 0.6, depth: 1.6, height: 2.4, color: [0.30, 0.18, 0.11] },

  // ===== Middle Bedroom =====
  { name: 'bed (mid)',        room: 'Middle Bedroom', x: 12.5, z: 6.0, width: 1.8, depth: 2.0, height: 0.55, color: [0.68, 0.62, 0.50] },
  { name: 'wardrobe (mid)',   room: 'Middle Bedroom', x: 10.3, z: 5.5, width: 0.6, depth: 1.8, height: 2.4, color: [0.30, 0.18, 0.11] },
  { name: 'desk (mid)',       room: 'Middle Bedroom', x: 13.5, z: 4.5, width: 1.2, depth: 0.5, height: 0.75, color: [0.42, 0.27, 0.18] },

  // ===== Master Bedroom =====
  { name: 'bed (master)',     room: 'Master Bedroom', x: 12.5, z: 2.5, width: 2.0, depth: 1.7, height: 0.55, color: [0.65, 0.55, 0.45] },
  { name: 'nightstand (m1)',  room: 'Master Bedroom', x: 11.3, z: 2.0, width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'nightstand (m2)',  room: 'Master Bedroom', x: 13.7, z: 2.0, width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'wardrobe (master)',room: 'Master Bedroom', x: 10.3, z: 1.5, width: 0.6, depth: 2.0, height: 2.4, color: [0.30, 0.18, 0.11] },

  // ===== North Deck plant =====
  { name: 'plant',            room: 'North Deck', x: 9.0, z: 11.3, width: 0.5, depth: 0.5, height: 1.4, color: [0.25, 0.50, 0.25] },

  // ===== NW Toilet (small en-suite) =====
  { name: 'wc',               room: 'NW Toilet', x: 0.4, z: 7.0, width: 0.45, depth: 0.6, height: 0.42, color: [0.92, 0.92, 0.92] },
  { name: 'vanity',           room: 'NW Toilet', x: 1.9, z: 6.1, width: 0.4, depth: 0.6, height: 0.85, color: [0.85, 0.78, 0.68] },
];

// Spawn just inside the front door, facing north into the flat.
export const SPAWN = {
  x: 3.6,
  z: 0.5,
  y: 1.7,
  rotY: 0,
};
