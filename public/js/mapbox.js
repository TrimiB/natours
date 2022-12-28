/* eslint-disable */

//// LEAFLET //////

export const displayMap = (locations) => {
  const map = L.map('map');

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  locations.forEach((location) => {
    const [lat, lng] = location.coordinates;

    const lnglat = L.latLng(lng, lat);

    const popup = L.popup(lnglat, {
      content: `<p class="location_description">Day ${location.day}: ${location.description}</p>`,
    });

    const greenIcon = L.icon({
      iconUrl: '../img/pin.png',
      className: 'marker',
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -50],
    });

    map.options.center = lnglat;

    L.marker(lnglat, { icon: greenIcon }).addTo(map).bindPopup(popup);

    map.setView(map.options.center, 6);
  });
};
