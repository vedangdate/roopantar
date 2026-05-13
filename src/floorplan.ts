// Floor plan — flat 804, Erandwane Central.
//
// Restructured 2026-05-12 per zoomed photo:
//   - NW Bedroom + Living side-by-side, both touch the big Deck on north
//   - Lobby small at SE of west cluster; NW Bedroom south touches Lobby's west extension
//   - Big Deck stretches across north of NW Bedroom + Living
//   - East column: Master / Middle / NE bedrooms stacked, with NE Deck on top + Master Deck east
//   - Inner passage (north-south) connects Dining → Master / Middle / NE bedroom doors
//
// Coordinates: metres. Origin SW corner. X = east, Z = north.

export const FLAT_WIDTH = 16.06;
export const FLAT_DEPTH = 13.49;
export const CEILING_HEIGHT = 3.0;
export const WALL_THICKNESS = 0.15;

export interface WallSeg {
  x1: number; z1: number;
  x2: number; z2: number;
}

// ===== Room rectangle reference =====
//  South strip (z=0..1.42):
//    Lobby:           x=4.83..7.27,  z=0..1.42       (8'0" × 4'8")
//    Common Toilet:   x=7.27..9.56,  z=0..1.40       (7'6" × 4'7")
//
//  West cluster (touches big deck on north):
//    NW Toilet:       x=0..1.55,     z=1.42..3.81    (5'1" × 7'10")
//    NW Bedroom:      x=1.55..4.83,  z=1.42..5.41    (10'9" × 13'1") — north wall = deck south
//
//  Central hall (Living + Dining as one open space; touches deck on north):
//    Dining:          x=4.83..8.72,  z=1.42..4.75    (12'9" × 10'11")
//    Living:          x=4.83..8.77,  z=4.75..5.41    + extends north strip x=7.52..8.77 z=5.41..??
//                     Note: Living conceptually 12'11"×18'6". Approximated for layout.
//                     For deck access, Living's north wall (z=5.41) directly meets deck.
//
//  Big North Deck:    x=0..9.50,     z=5.41..7.80    (23'11" × 7'10")
//
//  East column (Master, Middle, NE stacked):
//    Master Bedroom:  x=10.47..14.61,z=0..4.44       (14'7" × 13'7")
//    Master Toilet:   x=10.47..12.02,z=1.85..4.44    (alcove inside master)
//    Master Deck:     x=14.61..16.06,z=0..4.34       (4'9" × 14'3")
//    Middle Bedroom:  x=10.47..14.61,z=4.44..7.77    (label 16'2"×10'11", approx 4.14×3.33)
//    NE Toilet:       x=8.64..10.47,z=8.69..11.43    (6'0" × 9'0") — NE en-suite
//    NE Bedroom:      x=10.47..14.61,z=7.77..12.14   (13'7" × 14'4")
//    NE Deck:         x=10.47..14.61,z=12.14..13.49  (13'7" × 4'5")
//
//  Inner Lobby:       x=8.77..10.47, z=1.42..7.77    (passage to east bedrooms)
//
//  Kitchen + utility: omitted for v0 simplicity — central hall serves as combined
//  living/dining/kitchen. Kitchen functionality represented by counters inside the hall.

export const WALLS: WallSeg[] = [
  // ====== Exterior perimeter ======
  // South wall (front door = on west wall of Lobby, so south is solid)
  { x1: 0, z1: 0, x2: FLAT_WIDTH, z2: 0 },
  // East wall — steps for Master Deck + NE Deck
  { x1: FLAT_WIDTH, z1: 0,     x2: FLAT_WIDTH, z2: 4.34 },
  { x1: 14.61, z1: 4.34, x2: FLAT_WIDTH, z2: 4.34 },
  { x1: 14.61, z1: 4.34, x2: 14.61, z2: 13.49 },
  { x1: 10.47, z1: 13.49, x2: 14.61, z2: 13.49 },
  // North-east corner steps west to Big Deck north wall
  { x1: 10.47, z1: 7.80, x2: 10.47, z2: 13.49 },           // east edge between NE Deck and gap
  { x1: 9.50,  z1: 7.80, x2: 10.47, z2: 7.80 },            // step from Big Deck NE corner east to NE column
  { x1: 9.50,  z1: 5.41, x2: 9.50,  z2: 7.80 },            // east wall of Big Deck (between deck and east column south parts)
  { x1: 9.50,  z1: 5.41, x2: 14.61, z2: 5.41 },            // wait this creates a closed cell; remove (commented out below)
  // North wall of Big Deck
  { x1: 0, z1: 7.80, x2: 9.50, z2: 7.80 },
  // West wall
  { x1: 0, z1: 0, x2: 0, z2: 7.80 },

  // ====== Internal walls ======

  // ---- Lobby ----
  // West wall = FRONT DOOR (door gap z=0.4..1.1)
  { x1: 4.83, z1: 0,   x2: 4.83, z2: 0.4 },
  { x1: 4.83, z1: 1.1, x2: 4.83, z2: 1.42 },
  // North wall (door gap to Dining x=5.6..6.4)
  { x1: 4.83, z1: 1.42, x2: 5.6, z2: 1.42 },
  { x1: 6.4,  z1: 1.42, x2: 7.27, z2: 1.42 },
  // East wall (separates from Common Toilet)
  { x1: 7.27, z1: 0, x2: 7.27, z2: 1.42 },

  // ---- Common Toilet ----
  { x1: 9.56, z1: 0, x2: 9.56, z2: 1.40 },
  // North wall (door gap to Dining x=7.8..8.5)
  { x1: 7.27, z1: 1.40, x2: 7.8,  z2: 1.40 },
  { x1: 8.5,  z1: 1.40, x2: 9.56, z2: 1.40 },

  // ---- NW Toilet ----
  { x1: 0,   z1: 1.42, x2: 1.55, z2: 1.42 },               // south wall
  { x1: 0,   z1: 3.81, x2: 1.55, z2: 3.81 },               // north wall (boundary inside NW Bedroom)
  { x1: 1.55,z1: 1.42, x2: 1.55, z2: 2.4 },                // east wall (door gap z=2.4..3.1 into NW Bedroom)
  { x1: 1.55,z1: 3.1,  x2: 1.55, z2: 3.81 },

  // ---- NW Bedroom ----
  { x1: 1.55, z1: 1.42, x2: 4.83, z2: 1.42 },              // south wall
  // East wall (door gap z=2.5..3.3 into Dining; door gap z=4.0..4.8 into Living)
  { x1: 4.83, z1: 1.42, x2: 4.83, z2: 2.5 },
  { x1: 4.83, z1: 3.3,  x2: 4.83, z2: 4.0 },
  { x1: 4.83, z1: 4.8,  x2: 4.83, z2: 5.41 },
  // North wall (boundary with Big Deck — slider gap x=2.0..3.0)
  { x1: 0,    z1: 5.41, x2: 2.0,  z2: 5.41 },
  { x1: 3.0,  z1: 5.41, x2: 4.83, z2: 5.41 },

  // ---- Dining (open to Living north — no wall between them) ----
  // East wall (door gap z=2.5..3.3 into Inner Lobby)
  { x1: 8.77, z1: 1.42, x2: 8.77, z2: 2.5 },
  { x1: 8.77, z1: 3.3,  x2: 8.77, z2: 4.75 },

  // ---- Living ----
  // East wall (continuation north of Dining east wall up to deck)
  { x1: 8.77, z1: 4.75, x2: 8.77, z2: 5.41 },
  // North wall (boundary with Big Deck — slider gap x=6.0..7.5)
  { x1: 4.83, z1: 5.41, x2: 6.0,  z2: 5.41 },
  { x1: 7.5,  z1: 5.41, x2: 8.77, z2: 5.41 },

  // ---- Inner Lobby (passage, x=8.77..10.47, z=1.42..7.77) ----
  // East wall — west walls of Master + Middle + NE bedrooms (with doors)
  // West wall = Living/Dining east wall (above)
  // South end at z=1.42 closes to common toilet/master area:
  // (No wall needed at z=1.42 because Common Toilet east wall (x=9.56) + Master west wall (x=10.47) bracket; gap at x=9.56..10.47 z=0..1.42 — close it with wall:)
  { x1: 9.56, z1: 1.40, x2: 10.47, z2: 1.40 },             // close gap south of Inner Lobby
  // North end of Inner Lobby blocked by east bedroom south wall at z=7.77 (Middle/NE wall below)

  // ---- Master Bedroom ----
  // West wall (door gap z=1.8..2.6 from Inner Lobby)
  { x1: 10.47, z1: 0,   x2: 10.47, z2: 1.8 },
  { x1: 10.47, z1: 2.6, x2: 10.47, z2: 4.44 },
  // North wall (separates Master from Middle)
  { x1: 10.47, z1: 4.44, x2: 14.61, z2: 4.44 },
  // East wall (Master Deck slider gap z=2.0..3.8)
  { x1: 14.61, z1: 0,   x2: 14.61, z2: 2.0 },
  { x1: 14.61, z1: 3.8, x2: 14.61, z2: 4.34 },

  // ---- Master Toilet (alcove) ----
  { x1: 10.47, z1: 1.85, x2: 12.02, z2: 1.85 },            // south wall of alcove
  { x1: 12.02, z1: 1.85, x2: 12.02, z2: 3.5 },             // east wall (door 3.5..4.1)
  { x1: 12.02, z1: 4.1,  x2: 12.02, z2: 4.44 },

  // ---- Middle Bedroom ----
  // West wall (door gap z=5.2..6.0 from Inner Lobby)
  { x1: 10.47, z1: 4.44, x2: 10.47, z2: 5.2 },
  { x1: 10.47, z1: 6.0,  x2: 10.47, z2: 7.77 },
  // North wall (separates Middle from NE)
  { x1: 10.47, z1: 7.77, x2: 14.61, z2: 7.77 },

  // ---- NE Bedroom ----
  // West wall (separates from Inner Lobby + NE Toilet): door gap z=7.77..8.69 from Inner Lobby
  { x1: 10.47, z1: 8.69, x2: 10.47, z2: 10.0 },
  { x1: 10.47, z1: 10.6, x2: 10.47, z2: 12.14 },
  // North wall (NE Deck slider gap x=11.5..13.3)
  { x1: 10.47, z1: 12.14, x2: 11.5, z2: 12.14 },
  { x1: 13.3,  z1: 12.14, x2: 14.61, z2: 12.14 },

  // ---- NE Toilet (en-suite, x=8.64..10.47, z=8.69..11.43) ----
  { x1: 8.64, z1: 8.69, x2: 8.64, z2: 11.43 },             // west wall
  { x1: 8.64, z1: 8.69, x2: 10.47, z2: 8.69 },             // south wall
  { x1: 8.64, z1: 11.43, x2: 10.47, z2: 11.43 },           // north wall
  // East wall already added (door to NE Bedroom z=10.0..10.6)
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
  { name: 'Living',         cx: 6.80,  cz: 5.08 },
  { name: 'North Deck',     cx: 4.75,  cz: 6.60 },
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
  { name: 'sofa',               room: 'Living', x: 6.5, z: 4.95, width: 2.2, depth: 0.9, height: 0.8, color: [0.55, 0.25, 0.18] },
  { name: 'coffee table',       room: 'Living', x: 6.78, z: 5.25, width: 1.1, depth: 0.55, height: 0.42, color: [0.42, 0.27, 0.18] },
  { name: 'tv unit',            room: 'Living', x: 5.05, z: 5.0, width: 0.4, depth: 1.4, height: 0.55, color: [0.15, 0.12, 0.10] },

  // ===== North Deck =====
  { name: 'plant (north)',      room: 'North Deck', x: 8.2, z: 6.9, width: 0.5, depth: 0.5, height: 1.4, color: [0.25, 0.50, 0.25] },
  { name: 'lounger',            room: 'North Deck', x: 2.5, z: 7.0, width: 0.7, depth: 1.6, height: 0.4, color: [0.45, 0.35, 0.22] },
  { name: 'side table (deck)',  room: 'North Deck', x: 1.0, z: 7.0, width: 0.5, depth: 0.5, height: 0.45, color: [0.42, 0.27, 0.18] },

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

  // ===== Windows (east + master deck) =====
  { name: 'window NE-east-1',  room: 'NE Bedroom',     x: 14.50, z: 9.0,  width: 0.08, depth: 1.4, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  { name: 'window NE-east-2',  room: 'NE Bedroom',     x: 14.50, z: 11.4, width: 0.08, depth: 1.4, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  { name: 'window Mid-east-1', room: 'Middle Bedroom', x: 14.50, z: 5.0, width: 0.08, depth: 1.4, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  { name: 'window Mid-east-2', room: 'Middle Bedroom', x: 14.50, z: 7.0, width: 0.08, depth: 1.4, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  { name: 'window Mdeck-east-1', room: 'Master Deck', x: 15.95, z: 0.7, width: 0.06, depth: 1.2, height: 2.0, y: 0.5, color: [0.62, 0.82, 0.95] },
  { name: 'window Mdeck-east-2', room: 'Master Deck', x: 15.95, z: 3.4, width: 0.06, depth: 1.2, height: 2.0, y: 0.5, color: [0.62, 0.82, 0.95] },
  // North deck-side windows on NE bedroom + NE Deck
  { name: 'window NE-north-1', room: 'NE Deck', x: 11.0, z: 13.45, width: 1.4, depth: 0.06, height: 1.4, y: 0.8, color: [0.62, 0.82, 0.95] },
  { name: 'window NE-north-2', room: 'NE Deck', x: 13.5, z: 13.45, width: 1.4, depth: 0.06, height: 1.4, y: 0.8, color: [0.62, 0.82, 0.95] },
  // Big North Deck north exterior windows
  { name: 'window N-deck-1',  room: 'North Deck', x: 3.5, z: 7.75, width: 1.6, depth: 0.06, height: 1.4, y: 0.8, color: [0.62, 0.82, 0.95] },
  { name: 'window N-deck-2',  room: 'North Deck', x: 6.5, z: 7.75, width: 1.6, depth: 0.06, height: 1.4, y: 0.8, color: [0.62, 0.82, 0.95] },

  // ===== Sliding French Doors — 4 total, all bedrooms/rooms with own deck =====
  // NW Bedroom -> Big North Deck (slider gap x=2.0..3.0 on z=5.41)
  { name: 'slider NW-frame', room: 'NW Bedroom', x: 2.5, z: 5.41, width: 1.0, depth: 0.08, height: 2.4, color: [0.18, 0.18, 0.20] },
  { name: 'slider NW-glass', room: 'NW Bedroom', x: 2.5, z: 5.41, width: 0.95, depth: 0.04, height: 2.1, y: 0.15, color: [0.30, 0.65, 0.75] },
  // Living -> Big North Deck (slider gap x=6.0..7.5 on z=5.41)
  { name: 'slider Liv-frame', room: 'Living', x: 6.75, z: 5.41, width: 1.5, depth: 0.08, height: 2.4, color: [0.18, 0.18, 0.20] },
  { name: 'slider Liv-glass', room: 'Living', x: 6.75, z: 5.41, width: 1.45, depth: 0.04, height: 2.1, y: 0.15, color: [0.30, 0.65, 0.75] },
  // NE Bedroom -> NE Deck (slider gap x=11.5..13.3 on z=12.14)
  { name: 'slider NE-frame', room: 'NE Bedroom', x: 12.4, z: 12.14, width: 1.8, depth: 0.08, height: 2.4, color: [0.18, 0.18, 0.20] },
  { name: 'slider NE-glass', room: 'NE Bedroom', x: 12.4, z: 12.14, width: 1.75, depth: 0.04, height: 2.1, y: 0.15, color: [0.30, 0.65, 0.75] },
  // Master Bedroom -> Master Deck (slider gap z=2.0..3.8 on x=14.61)
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
