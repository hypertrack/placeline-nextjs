var randomColor = require("randomcolor");

export function getDeviceColor(id) {
  return randomColor({
    luminosity: "dark",
    seed: id
  });
}
