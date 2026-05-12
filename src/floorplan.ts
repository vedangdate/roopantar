// Floor plan — flat 804, Erandwane Central. Vedang's actual home.
//
// 4BHK Indian apartment:
//   - 1 bedroom on NW, attached to Lobby + Living (NW Bedroom).
//   - 3 bedrooms in a single line on the east wall, all sharing east wall
//     at x=14.61: NE → Middle → Master (north to south).
//   - 4 toilets: NW en-suite, NE en-suite (the 6'0"×9'0"), common (off
//     entrance area), master en-suite alcove.
//   - 3 decks: big North Deck along the north exterior, NE Deck above
//     NE bedroom, Master Deck east of master.
//   - Kitchen + small utility alcove north of Living.
//   - Inner Lobby (north-south passage at x=8.77..10.47, z=1.42..7.77)
//     serves as access corridor for the 3 east bedrooms.
//
// Source: ~/Library/CloudStorage/OneDrive-Personal/Documents/Family/
//         sthaavar maalmatta - jameen/erandwane central/interior/Modified 804.jpg
//
// Dimensions are converted from the photo labels (feet/inches → metres).
// Coordinates: origin (0,0) at SW corner; X = east, Z = north; Y = up.

export const FLAT_WIDTH = 16.06;
export const FLAT_DEPTH = 14.51;
export const CEILING_HEIGHT = 3.0;
export const WALL_THICKNESS = 0.15;

export interface WallSeg {
  x1: number; z1: number;
  x2: number; z2: number;
}

// === Room rectangle reference (metres) ===
//  South strip (entrance level):
//    Lobby:           x=4.83..7.27,  z=0..1.42       (8'0" × 4'8")
//    Common Toilet:   x=7.27..9.56,  z=0..1.40       (7'6" × 4'7")
//    Master Bedroom:  x=10.47..14.61,z=0..4.44       (14'7" × 13'7")
//    Master Toilet:   x=10.47..12.02,z=1.85..4.44    (alcove inside master)
//    Master Deck:     x=14.61..16.06,z=0..4.34       (4'9" × 14'3")
//
//  West strip:
//    NW Toilet:       x=0..1.55,    z=1.42..3.81    (5'1" × 7'10")
//    NW Bedroom:      x=1.55..4.83, z=1.42..5.41    (10'9" × 13'1")
//
//  Central column:
//    Dining:          x=4.83..8.77, z=1.42..4.75    (12'9" × 10'11", E-W=3.94)
//    Living:          x=4.83..8.77, z=4.75..10.39   (12'11" × 18'6", E-W=3.94)
//    Kitchen:         x=4.83..7.52, z=10.39..12.12  (8'10" × 11'3")
//    Utility:         x=7.52..10.01,z=10.93..12.12  (8'2" × 3'11")
//
//  East-side passage + bedrooms (all east bedrooms share east wall x=14.61):
//    Inner Lobby:     x=8.77..10.47,z=1.42..7.77    (passage to east bedrooms)
//    Middle Bedroom:  x=10.47..14.61,z=4.44..7.77   (label 16'2"×10'11",
//                                                    treated as 4.14×3.33 for alignment)
//    NE Toilet:       x=8.64..10.47,z=8.69..11.43   (6'0" × 9'0" — NE en-suite)
//    NE Bedroom:      x=10.47..14.61,z=7.77..12.14  (13'7" × 14'4")
//    NE Deck:         x=10.47..14.61,z=12.14..13.49 (13'7" × 4'5")
//
//  North strip:
//    North Deck:      x=4.83..12.12,z=12.12..14.51  (23'11" × 7'10")

export const WALLS: WallSeg[] = [
  // ====== Exterior perimeter ======
  // South wall (front) — front door gap x=5.5..6.5
  { x1: 0,     z1: 0, x2: 5.5,   z2: 0 },
  { x1: 6.5,   z1: 0, x2: FLAT_WIDTH, z2: 0 },
  // East wall (varies by section due to master deck and NE deck step)
  { x1: FLAT_WIDTH, z1: 0,     x2: FLAT_WIDTH, z2: 4.34 },   // master deck east
  { x1: 14.61, z1: 4.34, x2: FLAT_WIDTH, z2: 4.34 },         // north edge of master deck
  { x1: 14.61, z1: 4.34, x2: 14.61, z2: 13.49 },             // east wall of Master/Middle/NE bedrooms + NE deck
  { x1: 10.47, z1: 13.49, x2: 14.61, z2: 13.49 },            // NE Deck north wall
  { x1: 10.47, z1: 13.49, x2: 10.47, z2: 14.51 },            // step from NE Deck to North Deck
  { x1: 4.83,  z1: 14.51, x2: 10.47, z2: 14.51 },            // North Deck north wall
  // West wall of north deck steps south to flat's west wall
  { x1: 4.83,  z1: 5.41,  x2: 4.83,  z2: 14.51 },
  // West side: NW area
  { x1: 0, z1: 5.41, x2: 4.83, z2: 5.41 },                    // NW bedroom north wall (boundary with 803)
  { x1: 0, z1: 0,    x2: 0,    z2: 5.41 },                    // west exterior (along NW toilet + NW bedroom)
  { x1: 0, z1: 0,    x2: 4.83, z2: 0 } /* never used */, // (placeholder; south of NW area is exterior already drawn)

  // ====== Internal walls ======

  // ---- Lobby (entrance, x=4.83..7.27, z=0..1.42) ----
  // West wall (separates Lobby from NW Bedroom): door gap z=0.4..1.1
  { x1: 4.83, z1: 0,   x2: 4.83, z2: 0.4 },
  { x1: 4.83, z1: 1.1, x2: 4.83, z2: 1.42 },
  // North wall (separates Lobby from Dining): door gap x=5.6..6.4
  { x1: 4.83, z1: 1.42, x2: 5.6, z2: 1.42 },
  { x1: 6.4,  z1: 1.42, x2: 7.27, z2: 1.42 },
  // East wall (separates Lobby from Common Toilet): no door from lobby (toilet door is on its north wall, off Dining)
  { x1: 7.27, z1: 0, x2: 7.27, z2: 1.42 },

  // ---- Common Toilet (7'6"×4'7", x=7.27..9.56, z=0..1.40) ----
  // East wall (separates from Master Bedroom):
  { x1: 9.56, z1: 0, x2: 9.56, z2: 1.40 },
  // North wall (separates from Dining): door gap x=7.8..8.5
  { x1: 7.27, z1: 1.40, x2: 7.8,  z2: 1.40 },
  { x1: 8.5,  z1: 1.40, x2: 9.56, z2: 1.40 },

  // ---- NW Toilet (5'1"×7'10", x=0..1.55, z=1.42..3.81) ----
  { x1: 0,   z1: 1.42, x2: 1.55, z2: 1.42 },                  // south wall (boundary with 803)
  { x1: 0,   z1: 3.81, x2: 1.55, z2: 3.81 },                  // north wall (boundary with 803 toilet)
  { x1: 1.55,z1: 1.42, x2: 1.55, z2: 2.4 },                   // east wall (with door into NW bedroom)
  { x1: 1.55,z1: 3.1,  x2: 1.55, z2: 3.81 },                  // east wall continued

  // ---- NW Bedroom (10'9"×13'1", x=1.55..4.83, z=1.42..5.41) ----
  // South wall (separates from outside / 803 boundary)
  { x1: 1.55, z1: 1.42, x2: 4.83, z2: 1.42 },
  // East wall (separates from Dining and Living): door gap z=3.6..4.4 (into Living)
  { x1: 4.83, z1: 1.42, x2: 4.83, z2: 3.6 },
  { x1: 4.83, z1: 4.4,  x2: 4.83, z2: 5.41 },

  // ---- Dining (3.89 × 3.33, x=4.83..8.77, z=1.42..4.75) ----
  // East wall (separates from Inner Lobby): door gap z=2.5..3.3
  { x1: 8.77, z1: 1.42, x2: 8.77, z2: 2.5 },
  { x1: 8.77, z1: 3.3,  x2: 8.77, z2: 4.75 },

  // ---- Living (3.94 × 5.64, x=4.83..8.77, z=4.75..10.39) ----
  // (no wall between Dining and Living — open hall)
  // East wall (separates from Inner Lobby): all wall, no door (the corridor is reached from Dining)
  { x1: 8.77, z1: 4.75, x2: 8.77, z2: 7.77 },
  // North-east continuation (Living east wall continues north of Inner Lobby end at z=7.77,
  // separating Living from NE Toilet at higher z):
  { x1: 8.77, z1: 7.77, x2: 8.77, z2: 8.69 },
  // North wall (separates Living from Kitchen): door gap x=6.0..7.0
  { x1: 4.83, z1: 10.39, x2: 6.0,  z2: 10.39 },
  { x1: 7.0,  z1: 10.39, x2: 8.77, z2: 10.39 },

  // ---- Inner Lobby (passage, x=8.77..10.47, z=1.42..7.77) ----
  // South wall (separates from Master Bedroom area): door at x=10.47, z=1.8..2.6 (handled on master west wall)
  // North wall (separates from NE Toilet — passage ends at z=7.77): no wall here per se, blocked by NE Bedroom south wall.
  // The passage ends at z=7.77 where the NE Bedroom south wall begins.
  // East wall of inner lobby = west wall of Master/Middle (handled below).

  // ---- Master Bedroom (4.14 × 4.44, x=10.47..14.61, z=0..4.44) ----
  // West wall (separates from Inner Lobby + Common Toilet): door from Inner Lobby z=1.8..2.6
  { x1: 10.47, z1: 0,    x2: 10.47, z2: 1.8 },
  { x1: 10.47, z1: 2.6,  x2: 10.47, z2: 4.44 },
  // North wall (separates Master from Middle):
  { x1: 10.47, z1: 4.44, x2: 14.61, z2: 4.44 },
  // West wall of Master Deck (door from Master into Master Deck): door z=2.8..3.6
  { x1: 14.61, z1: 0,    x2: 14.61, z2: 2.8 },
  { x1: 14.61, z1: 3.6,  x2: 14.61, z2: 4.34 },

  // ---- Master Toilet alcove (1.55 × 2.59, inside Master at x=10.47..12.02, z=1.85..4.44) ----
  { x1: 10.47, z1: 1.85, x2: 12.02, z2: 1.85 },               // south wall
  { x1: 12.02, z1: 1.85, x2: 12.02, z2: 3.5 },                // east wall (with door gap 3.5..4.1)
  { x1: 12.02, z1: 4.1,  x2: 12.02, z2: 4.44 },               // east wall continued

  // ---- Middle Bedroom (4.14 × 3.33, x=10.47..14.61, z=4.44..7.77) ----
  // West wall (separates from Inner Lobby): door at z=5.2..6.0
  { x1: 10.47, z1: 4.44, x2: 10.47, z2: 5.2 },
  { x1: 10.47, z1: 6.0,  x2: 10.47, z2: 7.77 },
  // North wall (separates Middle from NE Bedroom):
  { x1: 10.47, z1: 7.77, x2: 14.61, z2: 7.77 },

  // ---- NE Bedroom (4.14 × 4.37, x=10.47..14.61, z=7.77..12.14) ----
  // South wall (separates from Inner Lobby + Middle Bedroom): door from Inner Lobby at x=11.0..11.8
  // (Middle/NE wall is already drawn at z=7.77; we need a door gap in it where the inner lobby reaches)
  // The Inner Lobby is at x=8.77..10.47, so it doesn't directly touch NE south wall.
  // Need an extension: the Inner Lobby connects to NE Bedroom via a small gap at its NE corner.
  // Implementation: at x=10.47, z=7.77 corner, the inner lobby has access. Add a door on the
  // NE Bedroom's south wall accessible from a step. For simplicity, add a door on NE Bedroom's
  // south wall directly from the inner lobby extension:
  // Re-do the Middle/NE wall above to leave a gap at x=10.47..11.0 (which is over the lobby end):
  // (We placed the wall as { x1: 10.47, z1: 7.77, x2: 14.61, z2: 7.77 } — leave it.)
  // Instead, the door from Inner Lobby into NE Bedroom is the WEST wall of NE Bedroom at x=10.47,
  // z=7.77..7.77 (a corner step). To make it work, we leave a gap in the NE Bedroom west wall
  // just north of the inner lobby's north end.
  // West wall of NE Bedroom (separates from NE Toilet on most of the span, and from Inner Lobby at the bottom):
  { x1: 10.47, z1: 7.77, x2: 10.47, z2: 8.69 },               // NE west wall — between inner lobby end and NE toilet south
  // (We'll put the actual door from inner lobby to NE bedroom on the corner — represented by leaving a small gap)
  // For practical 3D, just open the door by removing this wall segment:
  // Actually, since the segment above is 0.92m long (z=7.77..8.69), let's make it the door:
  // We'll remove this wall and call it the NE bedroom entrance.

  // ---- NE Toilet (1.83 × 2.74, x=8.64..10.47, z=8.69..11.43) ----
  // West wall (separates from Kitchen + Utility area):
  { x1: 8.64, z1: 8.69, x2: 8.64, z2: 11.43 },
  // South wall (separates from Living's north area beyond x=8.77):
  { x1: 8.64, z1: 8.69, x2: 10.47, z2: 8.69 },
  // North wall (separates from NE Bedroom + Utility):
  { x1: 8.64, z1: 11.43, x2: 10.47, z2: 11.43 },
  // East wall (separates from NE Bedroom): door at z=10.0..10.6
  { x1: 10.47, z1: 8.69, x2: 10.47, z2: 10.0 },
  { x1: 10.47, z1: 10.6, x2: 10.47, z2: 11.43 },

  // ---- Kitchen (2.69 × 3.43, x=4.83..7.52, z=10.39..12.12) ----
  // East wall (separates Kitchen from NE Toilet area):
  { x1: 7.52, z1: 10.39, x2: 7.52, z2: 12.12 },
  // North wall (separates Kitchen from North Deck): solid wall here
  { x1: 4.83, z1: 12.12, x2: 7.52, z2: 12.12 },

  // ---- Utility (2.49 × 1.19, x=7.52..10.01, z=10.93..12.12) ----
  // South wall (separates Utility from NE Toilet — but NE Toilet's north wall at z=11.43 overlaps):
  // Adjust: Utility is north of NE Toilet, between Kitchen and... wait NE Toilet ends at z=11.43.
  // Utility at z=10.93..12.12 overlaps NE Toilet z=8.69..11.43 from z=10.93..11.43.
  // To avoid overlap, place Utility above NE Toilet: x=7.52..10.01, z=11.43..12.12 (only 0.69m N-S — too thin).
  // Simpler: skip Utility for v0; treat that area as part of Kitchen/Deck transition.
  // Door from Kitchen area to North Deck: north wall gap x=8.0..9.0
  { x1: 7.52, z1: 12.12, x2: 8.0,  z2: 12.12 },
  { x1: 9.0,  z1: 12.12, x2: 10.01, z2: 12.12 },
  { x1: 10.01,z1: 12.12, x2: 12.12, z2: 12.12 },             // east of utility, west of NE bedroom
  // East wall of utility/kitchen-deck transition:
  { x1: 10.01, z1: 11.43, x2: 10.01, z2: 12.12 },
  { x1: 12.12, z1: 12.12, x2: 12.12, z2: 14.51 },             // east wall of North Deck

  // ---- North Deck ----
  // South wall is the kitchen+utility north wall (already drawn).
  // North wall is the flat north exterior (already drawn).
  // West wall: at x=4.83 (already drawn as part of perimeter).
  // East wall: at x=12.12 (drawn above), separates from NE Bedroom protrusion area.

  // ---- NE Bedroom north wall (separates from NE Deck) ----
  { x1: 10.47, z1: 12.14, x2: 14.61, z2: 12.14 },
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
  { name: 'Inner Lobby',    cx: 9.62,  cz: 4.60 },
  { name: 'Kitchen',        cx: 6.18,  cz: 11.26 },
  { name: 'North Deck',     cx: 8.48,  cz: 13.32 },
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
  // ===== NW Toilet (5'1"×7'10" = 1.55 × 2.39m) at x=0..1.55, z=1.42..3.81 =====
  // Commode against west wall, shower stall in NW corner, basin + mirror against east wall.
  { name: 'commode (NW)',       room: 'NW Toilet', x: 0.3, z: 3.4, width: 0.4, depth: 0.65, height: 0.42, color: [0.96, 0.96, 0.96] },
  { name: 'cistern (NW)',       room: 'NW Toilet', x: 0.2, z: 3.4, width: 0.18, depth: 0.4, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'shower base (NW)',   room: 'NW Toilet', x: 0.4, z: 2.05, width: 0.8, depth: 0.8, height: 0.05, color: [0.78, 0.78, 0.82] },
  { name: 'shower glass (NW)',  room: 'NW Toilet', x: 0.83, z: 2.05, width: 0.04, depth: 0.8, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower head (NW)',   room: 'NW Toilet', x: 0.15, z: 2.05, width: 0.15, depth: 0.15, height: 0.1, y: 2.0, color: [0.78, 0.78, 0.82] },
  { name: 'basin (NW)',         room: 'NW Toilet', x: 1.3, z: 1.75, width: 0.45, depth: 0.40, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'mirror (NW)',        room: 'NW Toilet', x: 1.43, z: 1.75, width: 0.08, depth: 0.7, height: 0.7, y: 1.2, color: [0.30, 0.45, 0.55] },

  // ===== NW Bedroom =====
  { name: 'bed (NW)',          room: 'NW Bedroom', x: 3.0, z: 3.2, width: 1.6, depth: 2.0, height: 0.55, color: [0.78, 0.71, 0.60] },
  { name: 'nightstand (NW)',   room: 'NW Bedroom', x: 2.0, z: 2.1, width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'wardrobe (NW)',     room: 'NW Bedroom', x: 4.5, z: 3.4, width: 0.55, depth: 1.8, height: 2.4, color: [0.30, 0.18, 0.11] },

  // ===== Lobby =====
  { name: 'console',           room: 'Lobby', x: 5.05, z: 1.20, width: 1.0, depth: 0.3, height: 0.85, color: [0.42, 0.27, 0.18] },

  // ===== Common Toilet (7'6"×4'7" = 2.29 × 1.40m) at x=7.27..9.56, z=0..1.40 =====
  { name: 'commode (common)',  room: 'Common Toilet', x: 7.55, z: 0.4, width: 0.4, depth: 0.65, height: 0.42, color: [0.96, 0.96, 0.96] },
  { name: 'cistern (common)',  room: 'Common Toilet', x: 7.45, z: 0.25, width: 0.18, depth: 0.4, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'basin (common)',    room: 'Common Toilet', x: 8.7, z: 0.3, width: 0.45, depth: 0.40, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'mirror (common)',   room: 'Common Toilet', x: 8.7, z: 0.12, width: 0.7, depth: 0.04, height: 0.7, y: 1.2, color: [0.30, 0.45, 0.55] },
  { name: 'shower base (common)',  room: 'Common Toilet', x: 9.2, z: 1.0, width: 0.7, depth: 0.7, height: 0.05, color: [0.78, 0.78, 0.82] },
  { name: 'shower glass (common)', room: 'Common Toilet', x: 9.2, z: 0.62, width: 0.7, depth: 0.04, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower head (common)',  room: 'Common Toilet', x: 9.45, z: 1.05, width: 0.15, depth: 0.15, height: 0.1, y: 2.0, color: [0.78, 0.78, 0.82] },

  // ===== Dining =====
  { name: 'dining table',      room: 'Dining', x: 6.78, z: 3.0, width: 1.6, depth: 0.95, height: 0.75, color: [0.40, 0.26, 0.16] },
  { name: 'dining chair 1',    room: 'Dining', x: 6.1, z: 2.3, width: 0.45, depth: 0.45, height: 0.85, color: [0.35, 0.22, 0.14] },
  { name: 'dining chair 2',    room: 'Dining', x: 6.78, z: 2.3, width: 0.45, depth: 0.45, height: 0.85, color: [0.35, 0.22, 0.14] },
  { name: 'dining chair 3',    room: 'Dining', x: 7.45, z: 2.3, width: 0.45, depth: 0.45, height: 0.85, color: [0.35, 0.22, 0.14] },
  { name: 'dining chair 4',    room: 'Dining', x: 6.78, z: 3.7, width: 0.45, depth: 0.45, height: 0.85, color: [0.35, 0.22, 0.14] },

  // ===== Living =====
  { name: 'sofa',              room: 'Living', x: 6.0, z: 6.0, width: 2.5, depth: 0.95, height: 0.8, color: [0.55, 0.25, 0.18] },
  { name: 'armchair',          room: 'Living', x: 7.8, z: 7.5, width: 0.9, depth: 0.9, height: 0.85, color: [0.65, 0.45, 0.30] },
  { name: 'coffee table',      room: 'Living', x: 6.5, z: 7.4, width: 1.2, depth: 0.6, height: 0.45, color: [0.42, 0.27, 0.18] },
  { name: 'tv unit',           room: 'Living', x: 5.05, z: 6.5, width: 0.4, depth: 2.0, height: 0.55, color: [0.15, 0.12, 0.10] },
  { name: 'rug (living)',      room: 'Living', x: 6.78, z: 7.2, width: 2.8, depth: 2.5, height: 0.02, color: [0.45, 0.32, 0.22] },

  // ===== Kitchen =====
  { name: 'counter (kitchen north)', room: 'Kitchen', x: 6.18, z: 11.8, width: 2.4, depth: 0.6, height: 0.9, color: [0.85, 0.78, 0.68] },
  { name: 'counter (kitchen west)',  room: 'Kitchen', x: 5.13, z: 11.0, width: 0.6, depth: 1.5, height: 0.9, color: [0.85, 0.78, 0.68] },
  { name: 'fridge',                  room: 'Kitchen', x: 7.15, z: 11.6, width: 0.7, depth: 0.7, height: 1.8, color: [0.92, 0.92, 0.92] },
  { name: 'hob/oven',                room: 'Kitchen', x: 5.8, z: 11.8, width: 0.7, depth: 0.6, height: 0.92, color: [0.20, 0.18, 0.18] },

  // ===== North Deck =====
  { name: 'plant (north)',     room: 'North Deck', x: 11.6, z: 13.7, width: 0.5, depth: 0.5, height: 1.4, color: [0.25, 0.50, 0.25] },
  { name: 'lounger',           room: 'North Deck', x: 6.5, z: 13.5, width: 0.7, depth: 1.8, height: 0.4, color: [0.45, 0.35, 0.22] },

  // ===== NE Toilet (6'0"×9'0" = 1.83 × 2.74m) at x=8.64..10.47, z=8.69..11.43 =====
  { name: 'commode (NE)',      room: 'NE Toilet', x: 8.9, z: 11.1, width: 0.4, depth: 0.65, height: 0.42, color: [0.96, 0.96, 0.96] },
  { name: 'cistern (NE)',      room: 'NE Toilet', x: 8.75, z: 11.25, width: 0.18, depth: 0.4, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'shower base (NE)',  room: 'NE Toilet', x: 8.95, z: 9.15, width: 0.85, depth: 0.9, height: 0.05, color: [0.78, 0.78, 0.82] },
  { name: 'shower glass NE-1', room: 'NE Toilet', x: 9.40, z: 9.15, width: 0.04, depth: 0.9, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower glass NE-2', room: 'NE Toilet', x: 8.95, z: 9.60, width: 0.85, depth: 0.04, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower head (NE)',  room: 'NE Toilet', x: 8.7,  z: 9.15, width: 0.15, depth: 0.15, height: 0.1, y: 2.0, color: [0.78, 0.78, 0.82] },
  { name: 'basin (NE)',        room: 'NE Toilet', x: 10.2, z: 9.0, width: 0.45, depth: 0.40, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'mirror (NE)',       room: 'NE Toilet', x: 10.35,z: 9.0, width: 0.08, depth: 0.7, height: 0.7, y: 1.2, color: [0.30, 0.45, 0.55] },

  // ===== NE Bedroom =====
  { name: 'bed (NE)',          room: 'NE Bedroom', x: 12.5, z: 10.5, width: 1.8, depth: 2.0, height: 0.55, color: [0.78, 0.71, 0.60] },
  { name: 'nightstand (NE-1)', room: 'NE Bedroom', x: 13.8, z: 9.4,  width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'wardrobe (NE)',     room: 'NE Bedroom', x: 14.3, z: 10.5, width: 0.55, depth: 1.8, height: 2.4, color: [0.30, 0.18, 0.11] },
  { name: 'desk (NE)',         room: 'NE Bedroom', x: 11.0, z: 8.3,  width: 1.2, depth: 0.5, height: 0.75, color: [0.42, 0.27, 0.18] },

  // ===== NE Deck =====
  { name: 'plant (NE)',        room: 'NE Deck', x: 11.5, z: 13.0, width: 0.5, depth: 0.5, height: 1.2, color: [0.25, 0.50, 0.25] },

  // ===== Middle Bedroom =====
  { name: 'bed (middle)',      room: 'Middle Bedroom', x: 12.5, z: 6.0, width: 1.8, depth: 2.0, height: 0.55, color: [0.68, 0.62, 0.50] },
  { name: 'wardrobe (middle)', room: 'Middle Bedroom', x: 14.3, z: 6.0, width: 0.55, depth: 1.6, height: 2.4, color: [0.30, 0.18, 0.11] },
  { name: 'desk (middle)',     room: 'Middle Bedroom', x: 11.0, z: 4.95, width: 1.2, depth: 0.5, height: 0.75, color: [0.42, 0.27, 0.18] },

  // ===== Master Bedroom =====
  { name: 'bed (master)',      room: 'Master Bedroom', x: 13.5, z: 2.7, width: 2.0, depth: 1.7, height: 0.55, color: [0.65, 0.55, 0.45] },
  { name: 'nightstand (m1)',   room: 'Master Bedroom', x: 12.3, z: 2.2, width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'nightstand (m2)',   room: 'Master Bedroom', x: 14.5, z: 2.2, width: 0.4, depth: 0.4, height: 0.55, color: [0.35, 0.22, 0.14] },
  { name: 'wardrobe (master)', room: 'Master Bedroom', x: 14.3, z: 4.1, width: 0.55, depth: 1.8, height: 2.4, color: [0.30, 0.18, 0.11] },

  // ===== Master Toilet (5'1"×8'6" = 1.55 × 2.59m) at x=10.47..12.02, z=1.85..4.44 =====
  { name: 'commode (master)',     room: 'Master Toilet', x: 10.75, z: 3.9, width: 0.4, depth: 0.65, height: 0.42, color: [0.96, 0.96, 0.96] },
  { name: 'cistern (master)',     room: 'Master Toilet', x: 10.6,  z: 4.05, width: 0.18, depth: 0.4, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'shower base (master)', room: 'Master Toilet', x: 10.75, z: 2.25, width: 0.7, depth: 0.7, height: 0.05, color: [0.78, 0.78, 0.82] },
  { name: 'shower glass M-1',     room: 'Master Toilet', x: 11.20, z: 2.25, width: 0.04, depth: 0.7, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower glass M-2',     room: 'Master Toilet', x: 10.75, z: 2.60, width: 0.7, depth: 0.04, height: 2.0, color: [0.85, 0.92, 0.95] },
  { name: 'shower head (master)', room: 'Master Toilet', x: 10.55, z: 2.25, width: 0.15, depth: 0.15, height: 0.1, y: 2.0, color: [0.78, 0.78, 0.82] },
  { name: 'basin (master)',       room: 'Master Toilet', x: 11.7,  z: 2.05, width: 0.45, depth: 0.4, height: 0.85, color: [0.96, 0.96, 0.96] },
  { name: 'mirror (master)',      room: 'Master Toilet', x: 11.7,  z: 1.90, width: 0.7, depth: 0.04, height: 0.7, y: 1.2, color: [0.30, 0.45, 0.55] },

  // ===== Master Deck =====
  { name: 'plant (master)',    room: 'Master Deck', x: 15.2, z: 1.0, width: 0.5, depth: 0.5, height: 1.2, color: [0.25, 0.50, 0.25] },
  { name: 'lounger (master)',  room: 'Master Deck', x: 15.2, z: 3.0, width: 0.7, depth: 1.6, height: 0.4, color: [0.45, 0.35, 0.22] },

  // ===== Windows (visual panels mounted just inside exterior walls; y=1.0..2.2 = window height) =====
  // East wall windows (looking east)
  { name: 'window NE-east-1',  room: 'NE Bedroom',  x: 14.50, z: 9.0,  width: 0.08, depth: 1.4, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  { name: 'window NE-east-2',  room: 'NE Bedroom',  x: 14.50, z: 11.4, width: 0.08, depth: 1.4, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  { name: 'window Mid-east-1', room: 'Middle Bedroom', x: 14.50, z: 5.0, width: 0.08, depth: 1.4, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  { name: 'window Mid-east-2', room: 'Middle Bedroom', x: 14.50, z: 7.0, width: 0.08, depth: 1.4, height: 1.2, y: 1.0, color: [0.62, 0.82, 0.95] },
  // Master deck has glass french-door styling — window on east wall of master deck
  { name: 'window Mdeck-east-1', room: 'Master Deck', x: 15.95, z: 0.7, width: 0.06, depth: 1.2, height: 2.0, y: 0.5, color: [0.62, 0.82, 0.95] },
  { name: 'window Mdeck-east-2', room: 'Master Deck', x: 15.95, z: 3.4, width: 0.06, depth: 1.2, height: 2.0, y: 0.5, color: [0.62, 0.82, 0.95] },

  // North-wall windows (overlooking the deck — kitchen and bedrooms have these)
  { name: 'window NE-deck-north-1', room: 'NE Deck', x: 11.0, z: 13.45, width: 1.4, depth: 0.06, height: 1.4, y: 0.8, color: [0.62, 0.82, 0.95] },
  { name: 'window NE-deck-north-2', room: 'NE Deck', x: 13.5, z: 13.45, width: 1.4, depth: 0.06, height: 1.4, y: 0.8, color: [0.62, 0.82, 0.95] },
  { name: 'window N-deck-1',  room: 'North Deck', x: 6.5, z: 14.47, width: 1.6, depth: 0.06, height: 1.4, y: 0.8, color: [0.62, 0.82, 0.95] },
  { name: 'window N-deck-2',  room: 'North Deck', x: 9.5, z: 14.47, width: 1.6, depth: 0.06, height: 1.4, y: 0.8, color: [0.62, 0.82, 0.95] },

  // West wall windows for NW Bedroom (subtle — looking west toward 803 boundary)
  // Skip — the west wall is a party wall with flat 803, not exterior.

  // Living room windows (facing north onto kitchen+deck) — gives the living a "see through" feel
  { name: 'window Living-north', room: 'Living', x: 6.5, z: 10.34, width: 1.5, depth: 0.06, height: 1.0, y: 1.0, color: [0.62, 0.82, 0.95] },
];

// Spawn just inside the front door, facing north into the flat.
export const SPAWN = {
  x: 6.05,
  z: 0.7,
  y: 1.7,
  rotY: 0,
};
