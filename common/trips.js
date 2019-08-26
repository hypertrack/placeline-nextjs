export function findTripById(trips, id) {
  let output = { trip: null, i: null };

  if (!trips) {
    return output;
  }

  for (let i = 0; i < trips.length; i++) {
    const trip = trips[i];

    if (trips["trip_id"] === id) {
      return { trip, i };
    }
  }
  return output;
}
