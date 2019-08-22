var randomColor = require("randomcolor");

export function findDeviceById(devices, id) {
  let output = { device: null, i: null };

  if (!devices) {
    return output;
  }

  for (let i = 0; i < devices.length; i++) {
    const device = devices[i];

    if (device["device_id"] === id) {
      return { device, i };
    }
  }
  return output;
}

export function getDeviceColor(id) {
  return randomColor({
    luminosity: "dark",
    seed: id
  });
}
