// Floor plan — scoped to flat 804's SE Master Bedroom suite.
// User uses Roopantar as a design tool for THIS room.
//
// 3 spaces (matching photo):
//   - Master Bedroom: 14'7" × 13'7" (4.44 × 4.14 m)
//   - Master Toilet (south of bedroom, en-suite): 5'1" × 8'6" laid as 8'6" E-W × 5'1" N-S
//     (2.59 × 1.55 m). Sits at SW of the suite, south of bedroom's west half.
//   - Master Deck (east of bedroom, private): 4'9" × 14'3" (1.45 × 4.34 m).
//     Tall narrow strip — extends slightly north + south past bedroom N-S.
//
// Coordinates: metres. Origin SW corner. X = east, Z = north.

// Total suite footprint:
//   Bedroom + deck E-W = 4.44 + 1.45 = 5.89 m
//   Bedroom N-S = 4.14, but deck N-S = 4.34 (extends 0.10 north + 0.10 south)
//   Toilet south of bedroom adds 1.55 N-S
// Total: 5.89 E-W × (1.55 + 4.14 + 0.10) = 5.89 × 5.79 m
// Round up for margin.
export const FLAT_WIDTH = 6.0;
export const FLAT_DEPTH = 6.0;
export const CEILING_HEIGHT = 3.0;
export const WALL_THICKNESS = 0.15;

export interface WallSeg {
  x1: number; z1: number;
  x2: number; z2: number;
  /** If true, render at railing height (1.0m) instead of full ceiling height. Deck exteriors. */
  railing?: boolean;
}

// Room boundaries:
//   Master Toilet: x=0..2.59, z=0..1.55
//   Master Bedroom: x=0..4.44, z=1.55..5.69
//   Master Deck: x=4.44..5.89, z=1.45..5.79
//   (deck N-S=4.34 — extends 0.10 north of bedroom + 0.10 south of bedroom)

export const WALLS: WallSeg[] = [
  // ====== Exterior perimeter ======
  // South wall:
  //   - x=0..2.59: Master Toilet south (solid exterior)
  //   - x=2.59..4.44: south of bedroom (solid; nothing south of bedroom east half — exterior)
  //   - x=4.44..5.89: Master Deck south face, slightly south of bedroom (railing)
  //     Deck south at z=1.45 (deck extends 0.10 south of bedroom which starts at z=1.55).
  //     But for perimeter at z=0 here, there's a gap. Treat south wall as stepped:
  { x1: 0,    z1: 0, x2: 4.44, z2: 0 },                    // toilet south + bedroom south-base
  // Step north to deck's south wall:
  { x1: 4.44, z1: 0, x2: 4.44, z2: 1.45 },                 // wall closing the corner south-of-deck
  { x1: 4.44, z1: 1.45, x2: 5.89, z2: 1.45, railing: true }, // deck south (railing)

  // East wall (deck east, full N-S of deck, railing):
  { x1: 5.89, z1: 1.45, x2: 5.89, z2: 5.79, railing: true },

  // North wall:
  //   - deck north (railing)
  { x1: 4.44, z1: 5.79, x2: 5.89, z2: 5.79, railing: true },
  //   - step south back to bedroom north (deck N-S=4.34 extends 0.10 past bedroom north 5.69)
  { x1: 4.44, z1: 5.69, x2: 4.44, z2: 5.79, railing: true },
  //   - bedroom north (solid)
  { x1: 0, z1: 5.69, x2: 4.44, z2: 5.69 },

  // West wall (toilet + bedroom — solid)
  { x1: 0, z1: 0, x2: 0, z2: 5.69 },

  // ====== Internal walls ======

  // ---- Master Toilet (x=0..2.59, z=0..1.55) ----
  // North wall (separates toilet from bedroom — door gap x=0.8..1.5)
  { x1: 0,    z1: 1.55, x2: 0.8,  z2: 1.55 },
  { x1: 1.5,  z1: 1.55, x2: 2.59, z2: 1.55 },
  // East wall of toilet (separates from bedroom's east half area at south)
  { x1: 2.59, z1: 0,    x2: 2.59, z2: 1.55 },

  // ---- Master Bedroom east wall (separates from Master Deck) ----
  // Slider gap z=2.6..4.6 (french-window slider, ~2m wide)
  { x1: 4.44, z1: 1.55, x2: 4.44, z2: 2.6 },
  { x1: 4.44, z1: 4.6,  x2: 4.44, z2: 5.69 },

  // ---- Bedroom entry door (on west wall — would be from rest of flat) ----
  // For this scoped scene, simulate "entry from rest of flat" via door gap on bedroom west wall.
  // Already west wall solid (0..5.69). Cut a door gap z=2.5..3.5:
  // Re-do west wall split:
  // (Note: west wall is part of perimeter. Splitting it.)
];

// Re-write west wall to have a door gap (entry from "outside the scope" — central building hallway placeholder):
// Remove the single segment "{ x1: 0, z1: 0, x2: 0, z2: 5.69 }" — replace with two segments:
//   z=0..2.5 + z=3.5..5.69
// Inline edit:
WALLS.splice(WALLS.findIndex(w => w.x1 === 0 && w.z1 === 0 && w.x2 === 0 && w.z2 === 5.69), 1,
  { x1: 0, z1: 0, x2: 0, z2: 2.5 },
  { x1: 0, z1: 3.5, x2: 0, z2: 5.69 },
);

export interface RoomLabel {
  name: string;
  cx: number; cz: number;
}

export const ROOMS: RoomLabel[] = [
  { name: 'Master Toilet',  cx: 1.30, cz: 0.78 },
  { name: 'Master Bedroom', cx: 2.22, cz: 3.62 },
  { name: 'Master Deck',    cx: 5.16, cz: 3.62 },
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

// Empty — user designs from scratch via AI ("imagine a sofa here", etc.)
export const FURNITURE: FurnitureItem[] = [];

// Spawn just inside entry door (west wall of bedroom), facing east into the room.
export const SPAWN = {
  x: 0.6,
  z: 3.0,
  y: 1.7,
  rotY: -Math.PI / 2,  // face east (into the room, deck visible far end)
};
