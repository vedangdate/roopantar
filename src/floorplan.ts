// Floor plan — flat 804, Erandwane Central.
// Rebuilt fresh 2026-05-12 after layout was wrong.
//
// Photo audit:
//   Row south→north of OUR flat (804) along central column:
//     1. Front door on WEST wall of Lobby (entry from building's lift lobby)
//     2. Lobby + Common Toilet (south strip, east of Lobby)
//     3. Dining (north of Lobby)
//     4. Living (north of Dining)
//     5. Kitchen (north of Living)
//     6. Utility (north of Kitchen)
//     7. Big Deck (north strip, north of Utility)
//   West column (west of central):
//     - NW Toilet (sandwiched between flat 803 and our NW Bedroom)
//     - NW Bedroom (east of NW Toilet, just north of Lobby vertically)
//   East column (east of central):
//     - Master Bedroom (SE), with Master Toilet alcove + Master Deck east
//     - Inner Lobby passage between Dining/Living and east bedrooms
//     - Middle Bedroom (between Master and NE)
//     - NE Toilet (between Kitchen-east and NE Bedroom)
//     - NE Bedroom (NE corner), with NE Deck on top
//   Big Deck L-shape:
//     - North arm: x=0..10.47, z=15.01..17.40 (north of Kitchen+Utility+InnerLobby+NEToilet)
//     - West arm: x=0..4.83, z=5.41..15.01 (north of NW Bedroom up to north arm)
//
// 4 sliders (deck access):
//   1. NW Bedroom -> Big Deck (north wall, z=5.41)
//   2. Living -> Big Deck (west wall, x=4.83 — above NW Bedroom)
//   3. NE Bedroom -> NE Deck (north wall, z=12.14)
//   4. Master Bedroom -> Master Deck (east wall, x=14.61)
//
// Coordinates: metres. Origin SW corner. X = east, Z = north.

export const FLAT_WIDTH = 16.06;
export const FLAT_DEPTH = 17.40;
export const CEILING_HEIGHT = 3.0;
export const WALL_THICKNESS = 0.15;

export interface WallSeg {
  x1: number; z1: number;
  x2: number; z2: number;
  /** If true, render at railing height (1.0m) instead of full ceiling height. Used for deck exterior walls so player can see outside. */
  railing?: boolean;
}

export const WALLS: WallSeg[] = [
  // ====== Exterior perimeter ======
  // South wall: solid for Lobby + Master Bedroom (z=0 from x=0..14.61); railing for Master Deck south (x=14.61..FLAT_WIDTH)
  { x1: 0,     z1: 0, x2: 14.61,      z2: 0 },
  { x1: 14.61, z1: 0, x2: FLAT_WIDTH, z2: 0, railing: true },

  // East wall — varies
  { x1: FLAT_WIDTH, z1: 0,    x2: FLAT_WIDTH, z2: 4.34, railing: true },  // Master Deck east
  { x1: 14.61,      z1: 4.34, x2: FLAT_WIDTH, z2: 4.34, railing: true },  // Master Deck north
  { x1: 14.61,      z1: 4.34, x2: 14.61,      z2: 12.14 },                // east wall of Master + Middle + NE bedrooms (solid)
  { x1: 14.61,      z1: 12.14,x2: 14.61,      z2: 13.49, railing: true }, // NE Deck east (railing)
  { x1: 10.47,      z1: 13.49,x2: 14.61,      z2: 13.49, railing: true }, // NE Deck north (railing)
  { x1: 10.47,      z1: 13.49,x2: 10.47,      z2: 15.01 },                // step from NE Deck top up to Big Deck level
  { x1: 10.47,      z1: 15.01,x2: 10.47,      z2: FLAT_DEPTH, railing: true }, // east wall of Big Deck north arm (railing)

  // North wall (top of Big Deck) — railing
  { x1: 0, z1: FLAT_DEPTH, x2: 10.47, z2: FLAT_DEPTH, railing: true },

  // West wall: solid for NW Toilet + NW Bedroom (z=0..5.41); railing for Big Deck west arm (z=5.41..FLAT_DEPTH)
  { x1: 0, z1: 0,    x2: 0, z2: 5.41 },
  { x1: 0, z1: 5.41, x2: 0, z2: FLAT_DEPTH, railing: true },

  // ====== Internal walls ======

  // ---- Lobby (x=4.83..7.27, z=0..1.42) ----
  // West wall = FRONT DOOR (gap z=0.4..1.1)
  { x1: 4.83, z1: 0,    x2: 4.83, z2: 0.4 },
  { x1: 4.83, z1: 1.1,  x2: 4.83, z2: 1.42 },
  // North wall (door to Dining x=5.6..6.4)
  { x1: 4.83, z1: 1.42, x2: 5.6,  z2: 1.42 },
  { x1: 6.4,  z1: 1.42, x2: 7.27, z2: 1.42 },
  // East wall (separates from Common Toilet)
  { x1: 7.27, z1: 0,    x2: 7.27, z2: 1.42 },

  // ---- Common Toilet (x=7.27..9.56, z=0..1.40) ----
  // East wall (separates from Master Bedroom)
  { x1: 9.56, z1: 0,    x2: 9.56, z2: 1.40 },
  // North wall (door to Dining x=7.8..8.5)
  { x1: 7.27, z1: 1.40, x2: 7.8,  z2: 1.40 },
  { x1: 8.5,  z1: 1.40, x2: 9.56, z2: 1.40 },

  // ---- NW Toilet (x=0..1.55, z=1.42..3.81) ----
  // South wall
  { x1: 0, z1: 1.42, x2: 1.55, z2: 1.42 },
  // North wall (boundary inside flat — north of toilet is empty NW corner area / 803 toilet area)
  { x1: 0, z1: 3.81, x2: 1.55, z2: 3.81 },
  // East wall (door to NW Bedroom z=2.0..2.9)
  { x1: 1.55, z1: 1.42, x2: 1.55, z2: 2.0 },
  { x1: 1.55, z1: 2.9,  x2: 1.55, z2: 3.81 },

  // ---- NW Bedroom (x=1.55..4.83, z=1.42..5.41) ----
  // South wall (boundary with flat south / 803 lobby — no door here, NW Bedroom enters via Living/Dining)
  { x1: 1.55, z1: 1.42, x2: 4.83, z2: 1.42 },
  // East wall (door to Dining z=2.0..2.9, door to Living z=4.0..4.8)
  { x1: 4.83, z1: 1.42, x2: 4.83, z2: 2.0 },
  { x1: 4.83, z1: 2.9,  x2: 4.83, z2: 4.0 },
  { x1: 4.83, z1: 4.8,  x2: 4.83, z2: 5.41 },
  // North wall = Big Deck south boundary (slider gap x=2.0..3.0)
  { x1: 0,    z1: 5.41, x2: 2.0,  z2: 5.41 },
  { x1: 3.0,  z1: 5.41, x2: 4.83, z2: 5.41 },

  // ---- Dining (x=4.83..8.64, z=1.42..4.75) ----
  // East wall (door to Inner Lobby z=2.4..3.2)
  { x1: 8.64, z1: 1.42, x2: 8.64, z2: 2.4 },
  { x1: 8.64, z1: 3.2,  x2: 8.64, z2: 4.75 },
  // Dining/Living north-south boundary: open (no wall — continuous hall)

  // ---- Living (x=4.83..8.64, z=4.75..10.39) ----
  // West wall (above NW Bedroom which ends at z=5.41) opens into Big Deck west arm via slider z=7.0..8.5
  // The wall from z=5.41..7.0 and z=8.5..10.39 along x=4.83 is solid (separates Living from Big Deck west arm)
  { x1: 4.83, z1: 5.41, x2: 4.83, z2: 7.0 },
  { x1: 4.83, z1: 8.5,  x2: 4.83, z2: 10.39 },
  // East wall (continuation of Dining east at z=4.75..10.39)
  { x1: 8.64, z1: 4.75, x2: 8.64, z2: 7.77 },
  { x1: 8.64, z1: 7.77, x2: 8.64, z2: 8.69 },               // wall continues past Inner Lobby end
  // North wall = Kitchen south (door x=6.0..7.0)
  { x1: 4.83, z1: 10.39, x2: 6.0,  z2: 10.39 },
  { x1: 7.0,  z1: 10.39, x2: 8.64, z2: 10.39 },

  // ---- Inner Lobby (x=8.64..10.47, z=1.42..7.77) ----
  // South wall closes the gap between Common Toilet east and Master Bedroom west:
  { x1: 9.56, z1: 1.40, x2: 10.47, z2: 1.40 },
  // East wall = west walls of Master + Middle bedrooms (with doors)
  // North end of Inner Lobby = south wall of NE Bedroom area (z=7.77)

  // ---- Master Bedroom (x=10.47..14.61, z=0..4.44) ----
  // West wall (door from Inner Lobby z=1.8..2.6)
  { x1: 10.47, z1: 0,    x2: 10.47, z2: 1.8 },
  { x1: 10.47, z1: 2.6,  x2: 10.47, z2: 4.44 },
  // North wall (separates Master from Middle)
  { x1: 10.47, z1: 4.44, x2: 14.61, z2: 4.44 },
  // East wall = Master Deck slider (gap z=2.0..3.8)
  { x1: 14.61, z1: 0,    x2: 14.61, z2: 2.0 },
  { x1: 14.61, z1: 3.8,  x2: 14.61, z2: 4.34 },

  // ---- Master Toilet alcove (x=10.47..12.02, z=1.85..4.44) ----
  { x1: 10.47, z1: 1.85, x2: 12.02, z2: 1.85 },             // south wall
  { x1: 12.02, z1: 1.85, x2: 12.02, z2: 3.5 },              // east wall (door 3.5..4.1)
  { x1: 12.02, z1: 4.1,  x2: 12.02, z2: 4.44 },

  // ---- Middle Bedroom (x=10.47..14.61, z=4.44..7.77) ----
  // West wall (door from Inner Lobby z=5.2..6.0)
  { x1: 10.47, z1: 4.44, x2: 10.47, z2: 5.2 },
  { x1: 10.47, z1: 6.0,  x2: 10.47, z2: 7.77 },
  // North wall (separates from NE Bedroom)
  { x1: 10.47, z1: 7.77, x2: 14.61, z2: 7.77 },

  // ---- Kitchen (x=4.83..7.52, z=10.39..13.82) ----
  // East wall (separates from NE Toilet area / dead space)
  { x1: 7.52, z1: 10.39, x2: 7.52, z2: 13.82 },
  // North wall (separates from Utility — door x=5.5..6.5)
  { x1: 4.83, z1: 13.82, x2: 5.5,  z2: 13.82 },
  { x1: 6.5,  z1: 13.82, x2: 7.52, z2: 13.82 },

  // ---- Utility (x=4.83..7.32, z=13.82..15.01) ----
  // North wall (= Big Deck south at this x range) - no door, plain windows
  { x1: 4.83, z1: 15.01, x2: 7.32, z2: 15.01 },
  // East wall
  { x1: 7.32, z1: 13.82, x2: 7.32, z2: 15.01 },

  // ---- Dead space between Kitchen east (x=7.52) and Inner Lobby west (x=8.64) at z=10.39..13.82 ----
  // (and from z=13.82..15.01 between Utility east x=7.32 and ...)
  // Seal it off so player can't enter:
  { x1: 7.52, z1: 10.39, x2: 8.64, z2: 10.39 },             // already there as Living north portion, but reinforce
  { x1: 8.64, z1: 10.39, x2: 8.64, z2: 11.43 },             // (already in NE toilet west wall below — combined)

  // ---- NE Toilet (en-suite, x=8.64..10.47, z=8.69..11.43) ----
  // West wall
  { x1: 8.64, z1: 8.69,  x2: 8.64, z2: 11.43 },
  // South wall
  { x1: 8.64, z1: 8.69,  x2: 10.47, z2: 8.69 },
  // North wall
  { x1: 8.64, z1: 11.43, x2: 10.47, z2: 11.43 },
  // East wall = NE Bedroom west wall (with door to NE Bedroom z=10.0..10.6)
  { x1: 10.47, z1: 8.69, x2: 10.47, z2: 10.0 },
  { x1: 10.47, z1: 10.6, x2: 10.47, z2: 11.43 },

  // ---- NE Bedroom (x=10.47..14.61, z=7.77..12.14) ----
  // West wall continues above NE Toilet:
  { x1: 10.47, z1: 11.43, x2: 10.47, z2: 12.14 },
  // South wall = Middle Bedroom north (already at z=7.77 above)
  // North wall = NE Deck (slider gap x=11.5..13.3 on z=12.14)
  { x1: 10.47, z1: 12.14, x2: 11.5,  z2: 12.14 },
  { x1: 13.3,  z1: 12.14, x2: 14.61, z2: 12.14 },

  // ---- Big Deck walls ----
  // West arm (x=0..4.83, z=5.41..15.01) - east wall already drawn as Living west + NW Bedroom east boundary at x=4.83. South wall = NW Bedroom north (drawn). North wall connects to north arm — no separate wall.
  // North arm (x=0..10.47, z=15.01..FLAT_DEPTH)
  // South wall of north arm at z=15.01:
  //   From x=4.83 (Big Deck west arm east) east to x=7.32 (Utility east) — but Utility north is at z=15.01 too. Wall from x=7.32..10.47 at z=15.01:
  { x1: 7.32, z1: 15.01, x2: 10.47, z2: 15.01 },
  // East wall of north arm (at x=10.47) goes from z=15.01..17.40 — already drawn in perimeter
  // The area east of x=10.47 between z=13.49 (NE Deck top) and z=15.01 (Big Deck N arm south) is outside flat — exterior. Already bounded.
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
  { name: 'Dining',         cx: 6.74,  cz: 3.09 },
  { name: 'Living',         cx: 6.74,  cz: 7.57 },
  { name: 'Kitchen',        cx: 6.18,  cz: 12.11 },
  { name: 'Utility',        cx: 6.08,  cz: 14.42 },
  { name: 'Big Deck',       cx: 2.40,  cz: 10.20 },
  { name: 'Inner Lobby',    cx: 9.56,  cz: 4.60 },
  { name: 'NE Toilet',      cx: 9.56,  cz: 10.06 },
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

// All interior furniture stripped per user request — empty shell for now.
// Will repopulate after layout is locked in.
export const FURNITURE: FurnitureItem[] = [];

// (preserved below — disabled by being unreachable)
const _DISABLED_FURNITURE: FurnitureItem[] = [
  // ===== NW Toilet =====
  { name: 'commode (NW)',         room: 'NW Toilet', x: 0.3, z: 3.4, width: 0.4, depth: 0.65, height: 0.42, color: [0.96, 0.96, 0.96] },
  { name: 'cistern (NW)',         room: 'NW Toilet', x: 0.2, z: 3.4, width: 0.18, depth: 0.4, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'shower base (NW)',     room: 'NW Toilet', x: 0.4, z: 2.05, width: 0.8, depth: 0.8, height: 0.05, color: [0.78, 0.78, 0.82] },
  { name: 'shower glass (NW)',    room: 'NW Toilet', x: 0.83, z: 2.05, width: 0.04, depth: 0.8, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower head (NW)',     room: 'NW Toilet', x: 0.15, z: 2.05, width: 0.15, depth: 0.15, height: 0.1, y: 2.0, color: [0.78, 0.78, 0.82] },
  { name: 'basin (NW)',           room: 'NW Toilet', x: 1.3, z: 1.75, width: 0.45, depth: 0.40, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'mirror (NW)',          room: 'NW Toilet', x: 1.43, z: 1.75, width: 0.08, depth: 0.7, height: 0.7, y: 1.2, color: [0.30, 0.45, 0.55] },

  // ===== NW Bedroom =====
  { name: 'bed (NW)',             room: 'NW Bedroom', x: 3.0, z: 3.4, width: 1.6, depth: 2.0, height: 0.55, color: [0.78, 0.71, 0.60] },
  { name: 'nightstand (NW)',      room: 'NW Bedroom', x: 4.3, z: 2.3, width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'wardrobe (NW)',        room: 'NW Bedroom', x: 2.5, z: 4.95, width: 1.8, depth: 0.55, height: 2.4, color: [0.30, 0.18, 0.11] },

  // ===== Lobby =====
  { name: 'console',              room: 'Lobby', x: 5.5, z: 1.20, width: 1.0, depth: 0.3, height: 0.85, color: [0.42, 0.27, 0.18] },

  // ===== Common Toilet =====
  { name: 'commode (common)',     room: 'Common Toilet', x: 7.55, z: 0.4, width: 0.4, depth: 0.65, height: 0.42, color: [0.96, 0.96, 0.96] },
  { name: 'cistern (common)',     room: 'Common Toilet', x: 7.45, z: 0.25, width: 0.18, depth: 0.4, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'basin (common)',       room: 'Common Toilet', x: 8.7, z: 0.3, width: 0.45, depth: 0.40, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'mirror (common)',      room: 'Common Toilet', x: 8.7, z: 0.12, width: 0.7, depth: 0.04, height: 0.7, y: 1.2, color: [0.30, 0.45, 0.55] },
  { name: 'shower base (common)', room: 'Common Toilet', x: 9.2, z: 1.0, width: 0.7, depth: 0.7, height: 0.05, color: [0.78, 0.78, 0.82] },
  { name: 'shower glass (common)',room: 'Common Toilet', x: 9.2, z: 0.62, width: 0.7, depth: 0.04, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower head (common)', room: 'Common Toilet', x: 9.45, z: 1.05, width: 0.15, depth: 0.15, height: 0.1, y: 2.0, color: [0.78, 0.78, 0.82] },

  // ===== Dining =====
  { name: 'dining table',         room: 'Dining', x: 6.74, z: 3.0, width: 1.6, depth: 0.95, height: 0.75, color: [0.40, 0.26, 0.16] },
  { name: 'dining chair 1',       room: 'Dining', x: 6.0, z: 2.3, width: 0.45, depth: 0.45, height: 0.85, color: [0.35, 0.22, 0.14] },
  { name: 'dining chair 2',       room: 'Dining', x: 6.74,z: 2.3, width: 0.45, depth: 0.45, height: 0.85, color: [0.35, 0.22, 0.14] },
  { name: 'dining chair 3',       room: 'Dining', x: 7.45,z: 2.3, width: 0.45, depth: 0.45, height: 0.85, color: [0.35, 0.22, 0.14] },
  { name: 'dining chair 4',       room: 'Dining', x: 6.74,z: 3.7, width: 0.45, depth: 0.45, height: 0.85, color: [0.35, 0.22, 0.14] },

  // ===== Living =====
  { name: 'sofa',                 room: 'Living', x: 6.5, z: 6.0, width: 2.5, depth: 0.9, height: 0.8, color: [0.55, 0.25, 0.18] },
  { name: 'armchair',             room: 'Living', x: 7.8, z: 8.3, width: 0.9, depth: 0.9, height: 0.85, color: [0.65, 0.45, 0.30] },
  { name: 'coffee table',         room: 'Living', x: 6.74, z: 7.4, width: 1.2, depth: 0.6, height: 0.45, color: [0.42, 0.27, 0.18] },
  { name: 'tv unit',              room: 'Living', x: 5.05, z: 7.7, width: 0.4, depth: 2.0, height: 0.55, color: [0.15, 0.12, 0.10] },
  { name: 'rug',                  room: 'Living', x: 6.74, z: 7.4, width: 3.0, depth: 2.4, height: 0.02, color: [0.45, 0.32, 0.22] },

  // ===== Kitchen =====
  { name: 'counter (north)',      room: 'Kitchen', x: 6.18, z: 13.55, width: 2.5, depth: 0.6, height: 0.9, color: [0.85, 0.78, 0.68] },
  { name: 'counter (west)',       room: 'Kitchen', x: 5.13, z: 12.0, width: 0.6, depth: 3.0, height: 0.9, color: [0.85, 0.78, 0.68] },
  { name: 'fridge',               room: 'Kitchen', x: 7.15, z: 13.45, width: 0.7, depth: 0.7, height: 1.8, color: [0.92, 0.92, 0.92] },
  { name: 'hob/oven',             room: 'Kitchen', x: 5.8, z: 13.55, width: 0.7, depth: 0.6, height: 0.92, color: [0.20, 0.18, 0.18] },

  // ===== Utility =====
  { name: 'washing machine',      room: 'Utility', x: 5.5, z: 14.42, width: 0.6, depth: 0.6, height: 0.85, color: [0.88, 0.88, 0.88] },
  { name: 'utility shelf',        room: 'Utility', x: 6.8, z: 14.5, width: 0.4, depth: 0.4, height: 1.6, color: [0.45, 0.32, 0.22] },

  // ===== Big Deck =====
  { name: 'plant (deck-NW)',      room: 'Big Deck', x: 1.5, z: 8.5, width: 0.5, depth: 0.5, height: 1.4, color: [0.25, 0.50, 0.25] },
  { name: 'lounger (deck-W)',     room: 'Big Deck', x: 2.5, z: 11.5, width: 0.7, depth: 1.6, height: 0.4, color: [0.45, 0.35, 0.22] },
  { name: 'side table (deck-W)',  room: 'Big Deck', x: 3.6, z: 11.5, width: 0.5, depth: 0.5, height: 0.45, color: [0.42, 0.27, 0.18] },
  { name: 'plant (deck-N)',       room: 'Big Deck', x: 8.5, z: 16.8, width: 0.5, depth: 0.5, height: 1.4, color: [0.25, 0.50, 0.25] },
  { name: 'plant (deck-Nw2)',     room: 'Big Deck', x: 2.0, z: 16.8, width: 0.5, depth: 0.5, height: 1.4, color: [0.25, 0.50, 0.25] },

  // ===== NE Toilet =====
  { name: 'commode (NE)',         room: 'NE Toilet', x: 8.9, z: 11.1, width: 0.4, depth: 0.65, height: 0.42, color: [0.96, 0.96, 0.96] },
  { name: 'cistern (NE)',         room: 'NE Toilet', x: 8.75, z: 11.25, width: 0.18, depth: 0.4, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'shower base (NE)',     room: 'NE Toilet', x: 8.95, z: 9.15, width: 0.85, depth: 0.9, height: 0.05, color: [0.78, 0.78, 0.82] },
  { name: 'shower glass NE-1',    room: 'NE Toilet', x: 9.40, z: 9.15, width: 0.04, depth: 0.9, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower glass NE-2',    room: 'NE Toilet', x: 8.95, z: 9.60, width: 0.85, depth: 0.04, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower head (NE)',     room: 'NE Toilet', x: 8.7,  z: 9.15, width: 0.15, depth: 0.15, height: 0.1, y: 2.0, color: [0.78, 0.78, 0.82] },
  { name: 'basin (NE)',           room: 'NE Toilet', x: 10.2, z: 9.0, width: 0.45, depth: 0.40, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'mirror (NE)',          room: 'NE Toilet', x: 10.35,z: 9.0, width: 0.08, depth: 0.7, height: 0.7, y: 1.2, color: [0.30, 0.45, 0.55] },

  // ===== NE Bedroom =====
  { name: 'bed (NE)',             room: 'NE Bedroom', x: 12.5, z: 10.5, width: 1.8, depth: 2.0, height: 0.55, color: [0.78, 0.71, 0.60] },
  { name: 'nightstand (NE-1)',    room: 'NE Bedroom', x: 13.8, z: 9.4,  width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'wardrobe (NE)',        room: 'NE Bedroom', x: 14.3, z: 10.5, width: 0.55, depth: 1.8, height: 2.4, color: [0.30, 0.18, 0.11] },
  { name: 'desk (NE)',            room: 'NE Bedroom', x: 11.0, z: 8.3,  width: 1.2, depth: 0.5, height: 0.75, color: [0.42, 0.27, 0.18] },

  // ===== NE Deck =====
  { name: 'plant (NE deck)',      room: 'NE Deck', x: 11.5, z: 13.0, width: 0.5, depth: 0.5, height: 1.2, color: [0.25, 0.50, 0.25] },

  // ===== Middle Bedroom =====
  { name: 'bed (middle)',         room: 'Middle Bedroom', x: 12.5, z: 6.0, width: 1.8, depth: 2.0, height: 0.55, color: [0.68, 0.62, 0.50] },
  { name: 'wardrobe (middle)',    room: 'Middle Bedroom', x: 14.3, z: 6.0, width: 0.55, depth: 1.6, height: 2.4, color: [0.30, 0.18, 0.11] },
  { name: 'desk (middle)',        room: 'Middle Bedroom', x: 11.0, z: 4.95, width: 1.2, depth: 0.5, height: 0.75, color: [0.42, 0.27, 0.18] },

  // ===== Master Bedroom =====
  { name: 'bed (master)',         room: 'Master Bedroom', x: 13.5, z: 2.7, width: 2.0, depth: 1.7, height: 0.55, color: [0.65, 0.55, 0.45] },
  { name: 'nightstand (m1)',      room: 'Master Bedroom', x: 12.3, z: 2.2, width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'nightstand (m2)',      room: 'Master Bedroom', x: 14.5, z: 2.2, width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'wardrobe (master)',    room: 'Master Bedroom', x: 14.3, z: 4.1, width: 0.55, depth: 1.8, height: 2.4, color: [0.30, 0.18, 0.11] },

  // ===== Master Toilet =====
  { name: 'commode (master)',     room: 'Master Toilet', x: 10.75, z: 3.9, width: 0.4, depth: 0.65, height: 0.42, color: [0.96, 0.96, 0.96] },
  { name: 'cistern (master)',     room: 'Master Toilet', x: 10.6,  z: 4.05, width: 0.18, depth: 0.4, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'shower base (master)', room: 'Master Toilet', x: 10.75, z: 2.25, width: 0.7, depth: 0.7, height: 0.05, color: [0.78, 0.78, 0.82] },
  { name: 'shower glass M-1',     room: 'Master Toilet', x: 11.20, z: 2.25, width: 0.04, depth: 0.7, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower glass M-2',     room: 'Master Toilet', x: 10.75, z: 2.60, width: 0.7, depth: 0.04, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower head (master)', room: 'Master Toilet', x: 10.55, z: 2.25, width: 0.15, depth: 0.15, height: 0.1, y: 2.0, color: [0.78, 0.78, 0.82] },
  { name: 'basin (master)',       room: 'Master Toilet', x: 11.7,  z: 2.05, width: 0.45, depth: 0.4, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'mirror (master)',      room: 'Master Toilet', x: 11.7,  z: 1.90, width: 0.7, depth: 0.04, height: 0.7, y: 1.2, color: [0.30, 0.45, 0.55] },

  // ===== Master Deck =====
  { name: 'plant (master)',       room: 'Master Deck', x: 15.2, z: 1.0, width: 0.5, depth: 0.5, height: 1.2, color: [0.25, 0.50, 0.25] },
  { name: 'lounger (master)',     room: 'Master Deck', x: 15.2, z: 3.0, width: 0.7, depth: 1.6, height: 0.4, color: [0.45, 0.35, 0.22] },

  // ===== Windows (plain panes on exterior walls) =====
  // Kitchen north (between Kitchen and Utility — not exterior, skip)
  // Utility north (Utility north wall = Big Deck south at this x — between rooms, skip exterior render)
  // East walls of bedrooms (exterior)
  { name: 'window NE-east-1',  room: 'NE Bedroom',     x: 14.50, z: 9.0,  width: 0.08, depth: 1.4, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  { name: 'window NE-east-2',  room: 'NE Bedroom',     x: 14.50, z: 11.4, width: 0.08, depth: 1.4, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  { name: 'window Mid-east-1', room: 'Middle Bedroom', x: 14.50, z: 5.0, width: 0.08, depth: 1.4, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  { name: 'window Mid-east-2', room: 'Middle Bedroom', x: 14.50, z: 7.0, width: 0.08, depth: 1.4, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  { name: 'window Mdeck-east-1', room: 'Master Deck',  x: 15.95, z: 0.7, width: 0.06, depth: 1.2, height: 2.0, y: 0.5, color: [0.62, 0.82, 0.95] },
  { name: 'window Mdeck-east-2', room: 'Master Deck',  x: 15.95, z: 3.4, width: 0.06, depth: 1.2, height: 2.0, y: 0.5, color: [0.62, 0.82, 0.95] },
  // Big Deck north exterior windows
  { name: 'window Deck-N-1',   room: 'Big Deck', x: 3.0, z: 17.35, width: 1.6, depth: 0.06, height: 1.4, y: 0.8, color: [0.62, 0.82, 0.95] },
  { name: 'window Deck-N-2',   room: 'Big Deck', x: 7.5, z: 17.35, width: 1.6, depth: 0.06, height: 1.4, y: 0.8, color: [0.62, 0.82, 0.95] },
  // NE Deck north windows
  { name: 'window NE-deck-1',  room: 'NE Deck', x: 11.0, z: 13.45, width: 1.4, depth: 0.06, height: 1.4, y: 0.8, color: [0.62, 0.82, 0.95] },
  { name: 'window NE-deck-2',  room: 'NE Deck', x: 13.5, z: 13.45, width: 1.4, depth: 0.06, height: 1.4, y: 0.8, color: [0.62, 0.82, 0.95] },

  // ===== 4 Sliding French Doors =====
  // 1. NW Bedroom -> Big Deck west arm (north wall, gap x=2.0..3.0)
  { name: 'slider NW-frame', room: 'NW Bedroom', x: 2.5, z: 5.41, width: 1.0, depth: 0.08, height: 2.4, color: [0.18, 0.18, 0.20] },
  { name: 'slider NW-glass', room: 'NW Bedroom', x: 2.5, z: 5.41, width: 0.95, depth: 0.04, height: 2.1, y: 0.15, color: [0.30, 0.65, 0.75] },
  // 2. Living -> Big Deck west arm (west wall, gap z=7.0..8.5)
  { name: 'slider Liv-frame', room: 'Living', x: 4.83, z: 7.75, width: 0.08, depth: 1.5, height: 2.4, color: [0.18, 0.18, 0.20] },
  { name: 'slider Liv-glass', room: 'Living', x: 4.83, z: 7.75, width: 0.04, depth: 1.45, height: 2.1, y: 0.15, color: [0.30, 0.65, 0.75] },
  // 3. NE Bedroom -> NE Deck (north wall, gap x=11.5..13.3)
  { name: 'slider NE-frame', room: 'NE Bedroom', x: 12.4, z: 12.14, width: 1.8, depth: 0.08, height: 2.4, color: [0.18, 0.18, 0.20] },
  { name: 'slider NE-glass', room: 'NE Bedroom', x: 12.4, z: 12.14, width: 1.75, depth: 0.04, height: 2.1, y: 0.15, color: [0.30, 0.65, 0.75] },
  // 4. Master Bedroom -> Master Deck (east wall, gap z=2.0..3.8)
  { name: 'slider M-frame',  room: 'Master Bedroom', x: 14.61, z: 2.9, width: 0.08, depth: 1.8, height: 2.4, color: [0.18, 0.18, 0.20] },
  { name: 'slider M-glass',  room: 'Master Bedroom', x: 14.61, z: 2.9, width: 0.04, depth: 1.75, height: 2.1, y: 0.15, color: [0.30, 0.65, 0.75] },
];

// Spawn just inside the front door (west wall of Lobby), facing north.
// Player enters Lobby, immediately sees Dining door on north wall.
export const SPAWN = {
  x: 6.0,   // center of Lobby E-W
  z: 0.7,   // center of Lobby N-S
  y: 1.7,
  rotY: 0,  // face north (into the flat)
};
