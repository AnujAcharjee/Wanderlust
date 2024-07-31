
// Ensure the script for Mapbox GL JS is loaded before using it
document.addEventListener("DOMContentLoaded", function () {
    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: [77.2088, 28.6139], // starting position [lng, lat]
        zoom: 9 // starting zoom
    });
});
