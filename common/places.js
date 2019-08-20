export function findPlacesByDeviceId(places, deviceId) {
  let output = [];

  if (!places) {
    return output;
  }

  for (let i = 0; i < places.length; i++) {
    const place = places[i];

    if (place["device_id"] === deviceId) {
      output.push(place);
    }
  }

  return output;
}

export function findPlaceByLabel(places, label) {
  let output = {};

  if (!places) {
    return output;
  }

  for (let i = 0; i < places.length; i++) {
    const place = places[i];

    if (place.label.toLowerCase() === label.toLowerCase()) {
      return place;
    }
  }

  return output;
}
