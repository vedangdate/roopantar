// Floor plan — scoped to flat 804's SE Master Bedroom suite.
// User uses Roopantar as a design tool for THIS room.
//
// Per photo (re-checked):
//   - Master Bedroom: 14'7" × 13'7" (4.44 × 4.14 m), E-W × N-S
//   - Master Toilet: 5'1" × 8'6" (1.55 × 2.59 m) — west of bedroom,
//     south half (SW alcove of suite). Toilet's N-S < bedroom's N-S so
//     toilet only occupies south portion of west side.
//   - Master Deck: 4'9" × 14'3" (1.45 × 4.34 m) — east of bedroom,
//     N-S slightly taller than bedroom (extends 0.20 m north).
//
// Coordinates: metres. Origin at SW corner of suite. X = east, Z = north.

export const FLAT_WIDTH = 7.44;  // toilet (1.55) + bedroom (4.44) + deck (1.45)
export const FLAT_DEPTH = 4.34;  // deck N-S
export const CEILING_HEIGHT = 3.0;
export const WALL_THICKNESS = 0.15;

export interface WallSeg {
  x1: number; z1: number;
  x2: number; z2: number;
  /** If true, render at 1.0 m railing height (deck exteriors). */
  railing?: boolean;
}

// Room layout:
//   Master Toilet:  x=0..1.55,    z=0..2.59 (SW alcove)
//   Master Bedroom: x=1.55..5.99, z=0..4.14
//   Master Deck:    x=5.99..7.44, z=0..4.34 (extends 0.20 north of bedroom)
//   Dead corner:    x=0..1.55,    z=2.59..4.14 (no room here — exterior on north + west)

export const WALLS: WallSeg[] = [
  // ====== Exterior perimeter ======

  // South wall (solid: toilet south, bedroom south, deck south is railing)
  { x1: 0,    z1: 0, x2: 5.99, z2: 0 },                       // toilet + bedroom south
  { x1: 5.99, z1: 0, x2: 7.44, z2: 0, railing: true },        // deck south (railing)

  // East wall (deck east, railing)
  { x1: 7.44, z1: 0, x2: 7.44, z2: 4.34, railing: true },

  // North wall:
  //   - Deck north (railing): x=5.99..7.44, z=4.34
  { x1: 5.99, z1: 4.34, x2: 7.44, z2: 4.34, railing: true },
  //   - Step south from deck to bedroom (deck N-S=4.34, bedroom N-S=4.14)
  { x1: 5.99, z1: 4.14, x2: 5.99, z2: 4.34, railing: true },
  //   - Bedroom north (solid)
  { x1: 1.55, z1: 4.14, x2: 5.99, z2: 4.14 },
  //   - North wall of dead corner (toilet north zone exterior)
  { x1: 0,    z1: 4.14, x2: 1.55, z2: 4.14 },

  // West wall:
  //   - Toilet west (solid exterior)
  { x1: 0, z1: 0, x2: 0, z2: 2.59 },
  //   - Dead corner west (exterior, solid)
  { x1: 0, z1: 2.59, x2: 0, z2: 4.14 },

  // ====== Internal walls ======

  // ---- Master Toilet (x=0..1.55, z=0..2.59) ----
  // North wall (separates toilet from dead corner): solid
  { x1: 0, z1: 2.59, x2: 1.55, z2: 2.59 },
  // East wall = bedroom west wall (south portion). Door gap z=1.6..2.4.
  { x1: 1.55, z1: 0,   x2: 1.55, z2: 1.6 },
  { x1: 1.55, z1: 2.4, x2: 1.55, z2: 2.59 },

  // ---- Master Bedroom west wall (north portion, x=1.55, z=2.59..4.14) ----
  // Solid wall separating bedroom from dead corner (no door).
  { x1: 1.55, z1: 2.59, x2: 1.55, z2: 4.14 },

  // ---- Master Bedroom east wall (separates from Master Deck) ----
  // Slider gap z=1.5..3.5 (french-window slider, 2 m wide)
  { x1: 5.99, z1: 0,   x2: 5.99, z2: 1.5 },
  { x1: 5.99, z1: 3.5, x2: 5.99, z2: 4.14 },
];

export interface RoomLabel {
  name: string;
  cx: number; cz: number;
}

export const ROOMS: RoomLabel[] = [
  { name: 'Master Toilet',  cx: 0.78, cz: 1.30 },
  { name: 'Master Bedroom', cx: 3.77, cz: 2.07 },
  { name: 'Master Deck',    cx: 6.72, cz: 2.17 },
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

// Empty — user designs from scratch via AI ("imagine a king bed against the north wall", etc.)
export const FURNITURE: FurnitureItem[] = [];

// Spawn center of Master Bedroom, facing east (toward deck slider).
export const SPAWN = {
  x: 3.5,
  z: 2.0,
  y: 1.7,
  rotY: -Math.PI / 2,
};
