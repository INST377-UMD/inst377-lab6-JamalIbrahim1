function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

const markersData = Array.from({ length: 3 }, () => ({
    latitude: getRandomInRange(30, 35, 3),
    longitude: getRandomInRange(-100, -90, 3)
}));

const map = L.map('map').setView([37.8, -96], 4); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
}).addTo(map);

async function fetchLocality(latitude, longitude) {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.locality || 'Locality not found';
    } catch (error) {
        console.error('Error fetching locality:', error);
        return 'Error retrieving locality';
    }
}

async function addMarkers() {
    const coordinatesInfo = document.getElementById('coordinates-info');

    for (let i = 0; i < markersData.length; i++) {
        const { latitude, longitude } = markersData[i];
        const marker = L.marker([latitude, longitude]).addTo(map);
        
        const locality = await fetchLocality(latitude, longitude);

        marker.bindPopup(`<b>Marker ${i + 1}</b><br>Coordinates: ${latitude}, ${longitude}<br>Locality: ${locality}`).openPopup();

        const markerInfo = document.createElement('div');
        markerInfo.classList.add('marker-info');
        markerInfo.innerHTML = `<b>Marker ${i + 1}: Latitude: ${latitude}, Longitude: ${longitude}</b><br>Locality: ${locality}`;
        coordinatesInfo.appendChild(markerInfo);
    }
}

addMarkers();
