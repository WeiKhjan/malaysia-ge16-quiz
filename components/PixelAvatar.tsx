"use client";
import { PartyId } from "@/lib/parties";

// 16x16 pixel portraits, hand-coded as 2D arrays. Each char = palette index.
// Palette per party defined below. Designed to feel iconic, not photorealistic.
//
// Legend:
//  . = transparent
//  # = outline (black)
//  s = skin
//  h = hair / cloth
//  e = eye highlight
//  m = mouth / mustache
//  c = clothing
//  a = accent (glasses / serban / songkok)
//  w = white highlight

type Palette = Record<string, string>;

const PORTRAITS: Record<PartyId, { sprite: string[]; palette: Palette }> = {
  ph: {
    sprite: [
      "................",
      ".....######.....",
      "....#aaaaaa#....",
      "...#aaaaaaaa#...",
      "..#hhhhhhhhhh#..",
      ".#hssssssssssh#.",
      ".#sssssssssss#..",
      ".#s##sss##sss#..",
      ".#seesseessss#..",
      ".#sssssssssss#..",
      ".#ssssmmsssss#..",
      "..#ssmmmmmsss#..",
      "...#sssssssss#..",
      "...#cccccccc#...",
      "..#cccwwccccc#..",
      ".##cccccccccc##.",
    ],
    palette: {
      "#": "#000000",
      s: "#e8b89a",
      h: "#1a1a1a",
      e: "#ffffff",
      m: "#3a2620",
      c: "#E2231A",
      a: "#1f3a8a",
      w: "#FFE066",
    },
  },
  bn: {
    sprite: [
      "................",
      ".....aaaaaa.....",
      "....aaaaaaaa....",
      "...#aaaaaaaa#...",
      "..#hhhhhhhhhh#..",
      ".#hssssssssssh#.",
      ".#sssssssssss#..",
      ".#s##sss##sss#..",
      ".#seesseessss#..",
      ".#sssssssssss#..",
      ".#smmmmmmmmms#..",
      "..#smmmmmmmms#..",
      "...#sssssssss#..",
      "...#cccwwcccc#..",
      "..#cccwwccccc#..",
      ".##cccccccccc##.",
    ],
    palette: {
      "#": "#000000",
      s: "#d7a07e",
      h: "#1a1a1a",
      e: "#ffffff",
      m: "#3a2620",
      c: "#0a2472",
      a: "#0a2472",
      w: "#FFD700",
    },
  },
  pn: {
    sprite: [
      "................",
      ".....aaaaaa.....",
      "....aaaaaaaa....",
      "...aaawwaaaaa...",
      "..aaaawwwaaaaa..",
      ".#aassssssssa#..",
      ".#ssssssssssss#.",
      ".#s##sss##ssss#.",
      ".#seesseesssss#.",
      ".#sssssssssss#..",
      ".#shhhhhhhhss#..",
      "..#hhhhhhhhss#..",
      "...#hhhhhhhh#...",
      "...#cccccccc#...",
      "..#cccccccccc#..",
      ".##cccccccccc##.",
    ],
    palette: {
      "#": "#000000",
      s: "#e0b08a",
      h: "#f8f8f0",
      e: "#1a1a1a",
      m: "#3a2620",
      c: "#1A4D2E",
      a: "#f8f8f0",
      w: "#1A4D2E",
    },
  },
};

interface Props {
  party: PartyId;
  size?: number; // px
  className?: string;
  framed?: boolean;
}

export default function PixelAvatar({ party, size = 128, className = "", framed = true }: Props) {
  const { sprite, palette } = PORTRAITS[party];
  const cell = size / 16;

  const rects: React.ReactElement[] = [];
  sprite.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const fill = palette[ch];
      if (!fill) return;
      rects.push(
        <rect
          key={`${x}-${y}`}
          x={x * cell}
          y={y * cell}
          width={cell}
          height={cell}
          fill={fill}
        />,
      );
    });
  });

  return (
    <div
      className={`inline-block ${framed ? "border-4 border-black shadow-pixel bg-bgalt p-2" : ""} ${className}`}
      style={{ width: framed ? size + 24 : size, height: framed ? size + 24 : size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ imageRendering: "pixelated", display: "block" }}
        shapeRendering="crispEdges"
      >
        {rects}
      </svg>
    </div>
  );
}
