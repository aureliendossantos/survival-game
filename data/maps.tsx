export const dictionary = {
  s: "sea",
  b: "beach",
  p: "plains",
  f: "forest",
  m: "mountains",
}

// little tool to make the maps https://blurymind.github.io/tilemap-editor/
export const maps = [
  [
    ["s", "b", "p"],
    ["b", "p", "f"],
    ["p", "f", "m"],
  ],
  [
    ["s", "s", "s", "s", "s", "s", "s", "s", "s", "s"],
    ["s", "s", "s", "b", "b", "b", "b", "s", "s", "s"],
    ["s", "s", "b", "p", "p", "p", "p", "b", "s", "s"],
    ["s", "b", "p", "p", "p", "f", "f", "p", "b", "s"],
    ["s", "b", "p", "p", "f", "f", "f", "p", "p", "s"],
    ["s", "p", "p", "f", "f", "f", "f", "f", "p", "s"],
    ["s", "f", "f", "f", "m", "m", "f", "f", "p", "s"],
    ["s", "f", "f", "m", "m", "m", "f", "p", "s", "s"],
    ["s", "s", "p", "f", "f", "f", "p", "s", "s", "s"],
    ["s", "s", "s", "s", "s", "s", "s", "s", "s", "s"],
  ],
]
