let map;
let currentMarker;
let streetView;
let infowindow;
let service;

function initMap() {
    // Initialize the map
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        mapTypeId: 'roadmap',
    });

    // Initialize Street View
    streetView = new google.maps.StreetViewPanorama(
        document.getElementById('street-view'), {
            position: { lat: 0, lng: 0 },
            pov: { heading: 0, pitch: 0 },
            zoom: 1
        });

    map.setStreetView(streetView);

    // Place service for fetching reviews and photos
    service = new google.maps.places.PlacesService(map);

    // Geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                map.setCenter({ lat, lng: lon });
                map.setZoom(13);
                addMarker(lat, lon, 'You are here!');
            },
            (error) => console.error('Geolocation error:', error)
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }

    // Search functionality
    document.getElementById('search-btn').addEventListener('click', () => {
        const query = document.getElementById('search-box').value.trim();
        const geocoder = new google.maps.Geocoder();

        if (query) {
            geocoder.geocode({ address: query }, (results, status) => {
                if (status === 'OK') {
                    const location = results[0].geometry.location;
                    map.setCenter(location);
                    map.setZoom(13);
                    addMarker(location.lat(), location.lng(), results[0].formatted_address);

                    // Update Street View
                    streetView.setPosition(location);
                    streetView.setPov({ heading: 0, pitch: 0 });

                    // Get Place Details (Reviews and Photos)
                    if (results[0].place_id) {
                        getPlaceDetails(results[0].place_id);
                    } else {
                        alert('No place details available for this location.');
                    }
                } else {
                    alert(`Location not found. Status: ${status}`);
                }
            });
        } else {
            alert('Please enter a location!');
        }
    });

    // Change map view
    document.getElementById('view-selector').addEventListener('change', (e) => {
        const selectedView = e.target.value;
        map.setMapTypeId(google.maps.MapTypeId[selectedView.toUpperCase()]);
    });
}

function addMarker(lat, lon, popupText) {
    const marker = new google.maps.Marker({
        position: { lat, lng: lon },
        map: map,
        title: popupText,
    });

    const infoWindow = new google.maps.InfoWindow({
        content: popupText,
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

// Function to fetch Place details (reviews and photos)
function getPlaceDetails(placeId) {
    service.getDetails({
        placeId: placeId,
        fields: ['name', 'photos', 'reviews']
    }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Display reviews
            displayReviews(place.reviews);
            // Display photos
            displayPhotos(place.photos);
        } else {
            alert(`Place details not found. Status: ${status}`);
        }
    });
}

// Function to display reviews
function displayReviews(reviews) {
    const reviewContainer = document.getElementById('place-reviews');
    reviewContainer.innerHTML = '';  // Clear previous reviews

    if (reviews && reviews.length > 0) {
        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review';
            reviewElement.innerHTML = `<strong>${review.author_name}</strong><br>${review.text}`;
            reviewContainer.appendChild(reviewElement);
        });
    } else {
        reviewContainer.innerHTML = 'No reviews available.';
    }
}

// Function to display photos
function displayPhotos(photos) {
    const photoContainer = document.getElementById('place-photos');
    photoContainer.innerHTML = '';  // Clear previous photos

    if (photos && photos.length > 0) {
        photos.forEach(photo => {
            const photoElement = document.createElement('img');
            photoElement.src = photo.getUrl({ maxWidth: 100, maxHeight: 100 });
            photoContainer.appendChild(photoElement);
        });
    } else {
        photoContainer.innerHTML = 'No photos available.';
    }
}

google.maps.event.addDomListener(window, 'load', initMap);
