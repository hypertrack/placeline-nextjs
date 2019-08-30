var randomColor = require("randomcolor");

export function shortenLargeNumber(num, digits, meters = true) {
  if (num <= -1000 || num >= 1000) {
    return {
      number: +(num / 1000).toFixed(digits),
      unit: meters ? "km" : "k"
    };
  }

  return { number: num, unit: meters ? "m" : "steps" };
}

export function getDeviceColor(id) {
  return randomColor({
    luminosity: "dark",
    seed: id
  });
}
