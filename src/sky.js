// Maps WeatherAPI condition codes to a sky "scene", and each scene to the colours
// of the sky drawn behind the buddy in the character pane.

// Grouped as in the design system's weather variations: "cloudy" includes overcast,
// mist and the "... possible" forecasts; sleet and ice pellets fall as rain.
const SCENE_CODES = {
  clear: [1000],
  partly: [1003],
  cloudy: [1006, 1009, 1030, 1063, 1066, 1069, 1072, 1087],
  fog: [1135, 1147],
  rain: [
    1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201,
    1204, 1207, 1237, 1240, 1243, 1246, 1249, 1252, 1261, 1264,
  ],
  snow: [1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258],
  storm: [1273, 1276, 1279, 1282],
};

const SCENE_BY_CODE = Object.fromEntries(
  Object.entries(SCENE_CODES).flatMap(([scene, codes]) => codes.map((code) => [code, scene]))
);

export const SCENES = Object.keys(SCENE_CODES);

export function sceneForCode(code) {
  return SCENE_BY_CODE[code] ?? 'clear';
}

// Five colours per sky, top to bottom.
// tone is 'dark' for pale skies and 'light' for dark ones; Sky uses it to pick effect colours.
export const SKIES = {
  'day-clear': { tone: 'dark', bands: ['#6db0ee', '#82bdf2', '#98c9f5', '#afd6f8', '#c6e3fb'] },
  'day-partly': { tone: 'dark', bands: ['#80b4e2', '#94c1e8', '#a8cdee', '#bcd9f3', '#d0e5f8'] },
  'day-cloudy': { tone: 'dark', bands: ['#9aa9b7', '#a8b6c2', '#b6c2cd', '#c4ced8', '#d2dae2'] },
  'day-fog': { tone: 'dark', bands: ['#bcc5cc', '#c6ced4', '#d0d6db', '#dadfe3', '#e4e8eb'] },
  'day-snow': { tone: 'dark', bands: ['#b9cce0', '#c5d5e6', '#d1deec', '#dde7f2', '#e9f0f8'] },
  'day-rain': { tone: 'light', bands: ['#334252', '#38485a', '#3e4f62', '#44566a', '#4a5d72'] },
  'day-storm': { tone: 'light', bands: ['#2e3440', '#353c49', '#3d4452', '#454d5c', '#4e5666'] },
  'night-clear': { tone: 'light', bands: ['#0b1530', '#111d3d', '#17264a', '#1e3058', '#263a66'] },
  'night-partly': { tone: 'light', bands: ['#121b33', '#18233f', '#1f2b4a', '#263456', '#2e3d61'] },
  'night-cloudy': { tone: 'light', bands: ['#1c232e', '#222a36', '#29323f', '#303a48', '#384352'] },
  'night-fog': { tone: 'light', bands: ['#262c33', '#2d343c', '#353d46', '#3e464f', '#474f59'] },
  'night-rain': { tone: 'light', bands: ['#141c27', '#19222f', '#1f2938', '#253041', '#2c384a'] },
  'night-snow': { tone: 'light', bands: ['#1d2638', '#243045', '#2c3a52', '#35455f', '#3f506c'] },
  'night-storm': { tone: 'light', bands: ['#0d0f17', '#13161f', '#1a1d28', '#212532', '#282d3c'] },
};

export function skyKey(scene, isDay) {
  return `${isDay ? 'day' : 'night'}-${scene}`;
}

// Blends smoothly through the bands, top to bottom
export function skyGradient(bands) {
  return `linear-gradient(to bottom, ${bands.join(', ')})`;
}
