
// Ensure the script for Mapbox GL JS is loaded before using it
document.addEventListener("DOMContentLoaded", function () {
    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: listing.geometry.coordinates, // starting position [lng, lat]
        zoom: 15 // starting zoom
    });

    // Define the popup content
    const popupContent = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h4>${listing.title}</h4><p>Exact Location provided after booking</p>`
    );

    // Create a DOM element for the custom marker
    const el = document.createElement('div');
    el.id = 'marker'; // This will apply the CSS styling

    // Create the custom marker
    new mapboxgl.Marker(el)
        .setLngLat(listing.geometry.coordinates)
        .setPopup(popupContent) // sets the same popup on this marker
        .addTo(map);
});