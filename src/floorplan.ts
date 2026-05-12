// Floor plan for v0 — a plausible 2BHK Indian apartment.
// All units in metres. Origin (0,0) at the SW corner of the flat.
// X = east, Z = north, Y = up.
//
// This is a placeholder layout. Vedang's actual flat (204 Woodland
// Harmony) layout can replace this once we figure out an import format
// (DXF / phone-AR scan / hand-drawn editor).

export const FLAT_WIDTH = 12; // east-west
export const FLAT_DEPTH = 9; // north-south
export const CEILING_HEIGHT = 3.0;
export const WALL_THICKNESS = 0.15;

// Wall is a line segment from (x1,z1) to (x2,z2). All wall meshes will
// be extruded vertically by CEILING_HEIGHT.
export interface WallSeg {
  x1: number; z1: number;
  x2: number; z2: number;
}

// External perimeter has a 1-metre gap on the south wall for the entrance.
// Internal walls divide the flat into rooms.
export const WALLS: WallSeg[] = [
  // === External perimeter (south wall is in two pieces, entrance gap from x=10 to x=11.5) ===
  { x1: 0, z1: 0, x2: 10, z2: 0 },
  { x1: 11.5, z1: 0, x2: FLAT_WIDTH, z2: 0 },
  { x1: FLAT_WIDTH, z1: 0, x2: FLAT_WIDTH, z2: FLAT_DEPTH }, // east
  { x1: 0, z1: FLAT_DEPTH, x2: FLAT_WIDTH, z2: FLAT_DEPTH }, // north
  { x1: 0, z1: 0, x2: 0, z2: FLAT_DEPTH }, // west

  // === Internal walls ===
  // Living room / kitchen separator (with a doorway from x=2 to x=3)
  { x1: 0, z1: 5, x2: 2, z2: 5 },
  { x1: 3, z1: 5, x2: 5, z2: 5 },

  // Hallway / bedroom separators
  { x1: 5, z1: 0, x2: 5, z2: 2 }, // partial wall south of hallway
  { x1: 5, z1: 3, x2: 5, z2: 5 }, // doorway gap between 2..3

  // Living room east wall (with door at z=3.5 to z=4.5 into master bedroom area)
  // Actually rethinking: hallway runs east-west through middle...
  // Let me simplify the layout to be more obvious:
  // SW: Living room (large)         NW: Kitchen
  // S center: Foyer/hallway          N center: Master bedroom
  // SE: Second bedroom               NE: Bathroom (separating two bedrooms)
  // Use only the walls listed above and add the master bedroom + bath partitions.

  // Master bedroom south wall (z=5 boundary, partial — already covered above)
  // Add east boundary of master bedroom:
  { x1: 9, z1: 5, x2: 9, z2: 7 },
  { x1: 9, z1: 8, x2: 9, z2: FLAT_DEPTH },

  // Bathroom partition (north-east) - between master and a small bath corner
  { x1: 9, z1: 7, x2: FLAT_WIDTH, z2: 7 }, // bath south wall
  // Bath has its own door on east wall (effectively from corridor at x=9, z=7..8 is doorway gap)

  // Master bedroom interior wall to corridor (already from south wall above)
  // Second bedroom / corridor: south of z=5 east of x=5
  { x1: 5, z1: 0, x2: 9, z2: 0 }, // already part of south perimeter — skip
  // Second bedroom east wall:
  { x1: 9, z1: 0, x2: 9, z2: 4 },
  // Second bedroom north wall (separating from master):
  { x1: 5, z1: 4, x2: 8, z2: 4 },
];

// Door openings — purely cosmetic markers for v0 (we already left gaps in WALLS above).
// In future these can render door frames or animated doors.
export interface RoomLabel {
  name: string;
  cx: number; cz: number; // centre point for label / spawn logic
}

export const ROOMS: RoomLabel[] = [
  { name: 'Living Room', cx: 2.5, cz: 2.5 },
  { name: 'Kitchen', cx: 2.5, cz: 7 },
  { name: 'Hallway', cx: 7, cz: 4.5 },
  { name: 'Bedroom', cx: 7, cz: 2 },
  { name: 'Master Bedroom', cx: 11, cz: 6 },
  { name: 'Bathroom', cx: 11, cz: 8 },
];

// Furniture as simple primitives for v0. Each is a box at given centre & size.
export interface FurnitureItem {
  name: string;
  room: string;
  x: number; z: number; // centre
  width: number; depth: number; height: number;
  y?: number; // height above floor (for tables etc); default 0
  color: [number, number, number]; // RGB 0..1
  rotY?: number;
}

export const FURNITURE: FurnitureItem[] = [
  // Living room
  { name: 'sofa', room: 'Living Room', x: 1, z: 1.2, width: 2.0, depth: 0.85, height: 0.8, color: [0.55, 0.25, 0.18] },
  { name: 'coffee table', room: 'Living Room', x: 1, z: 2.8, width: 1.0, depth: 0.5, height: 0.45, color: [0.42, 0.27, 0.18] },
  { name: 'tv unit', room: 'Living Room', x: 4.6, z: 2.5, width: 0.4, depth: 1.6, height: 0.5, color: [0.15, 0.12, 0.1] },
  { name: 'rug', room: 'Living Room', x: 1.5, z: 2.5, width: 2.5, depth: 1.8, height: 0.02, color: [0.45, 0.32, 0.22] },

  // Kitchen
  { name: 'counter (south)', room: 'Kitchen', x: 2.5, z: 5.4, width: 4.5, depth: 0.6, height: 0.9, color: [0.85, 0.78, 0.68] },
  { name: 'counter (west)', room: 'Kitchen', x: 0.4, z: 7.0, width: 0.6, depth: 3, height: 0.9, color: [0.85, 0.78, 0.68] },
  { name: 'fridge', room: 'Kitchen', x: 4.5, z: 8.5, width: 0.7, depth: 0.7, height: 1.8, color: [0.92, 0.92, 0.92] },
  { name: 'dining table', room: 'Kitchen', x: 2.5, z: 7.5, width: 1.5, depth: 0.9, height: 0.75, color: [0.4, 0.26, 0.16] },

  // Bedroom (second)
  { name: 'bed (second)', room: 'Bedroom', x: 7, z: 1.5, width: 1.6, depth: 2.0, height: 0.55, color: [0.78, 0.71, 0.6] },
  { name: 'nightstand', room: 'Bedroom', x: 8.4, z: 0.5, width: 0.5, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'wardrobe', room: 'Bedroom', x: 5.4, z: 2.6, width: 0.6, depth: 1.8, height: 2.4, color: [0.32, 0.2, 0.13] },

  // Master Bedroom
  { name: 'bed (master)', room: 'Master Bedroom', x: 10.5, z: 5.7, width: 2.0, depth: 1.6, height: 0.55, color: [0.65, 0.55, 0.45] },
  { name: 'nightstand (m1)', room: 'Master Bedroom', x: 9.5, z: 5.2, width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'nightstand (m2)', room: 'Master Bedroom', x: 11.5, z: 5.2, width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'wardrobe (master)', room: 'Master Bedroom', x: 9.4, z: 6.7, width: 0.6, depth: 2.0, height: 2.4, color: [0.3, 0.18, 0.11] },

  // Hallway plant
  { name: 'plant', room: 'Hallway', x: 6, z: 4.5, width: 0.5, depth: 0.5, height: 1.2, color: [0.25, 0.5, 0.25] },
];

// Spawn position for the player — just inside the entrance, facing into the flat.
export const SPAWN = {
  x: 10.75, // centred in the entrance gap (10..11.5)
  z: 0.5,   // just inside
  y: 1.7,   // eye height
  rotY: 0,  // facing north (into the flat)
};
