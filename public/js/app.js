document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map').setView([53.2707, -9.0568], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var geocoder = L.Control.geocoder({
        defaultMarkGeocode: false
    }).on('markgeocode', function(e) {
        var latlng = e.geocode.center;
        map.setView(latlng, 15); 
    }).addTo(map);

    var allMarkers = [];
    var allPolylines = [];  
    var routingControls = [];

    var drawControl = new L.Control.Draw({
        draw: {
            polygon: false,
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: {
                repeatMode: true
            },
            polyline: {
                allowIntersection: false,
                shapeOptions: {
                    color: 'blue'
                },
                repeatMode: false
            }
        },
        edit: false
    });
    map.addControl(drawControl);

    var markerDrawHandler = new L.Draw.Marker(map, { repeatMode: true });
    var polylineDrawHandler = new L.Draw.Polyline(map);
    var currentMode = null;

    document.getElementById('addMarkerMode').addEventListener('click', function() {
        if (currentMode === 'marker') {
            markerDrawHandler.disable();
            currentMode = null;
            this.classList.remove('active');
        } else {
            currentMode = 'marker';
            markerDrawHandler.enable();
            polylineDrawHandler.disable();
            clearActiveStates();
            this.classList.add('active');
        }
    });

    document.getElementById('addPolylineMode').addEventListener('click', function() {
        if (currentMode === 'polyline') {
            polylineDrawHandler.disable();
            currentMode = null;
            this.classList.remove('active');
        } else {
            currentMode = 'polyline';
            polylineDrawHandler.enable();
            markerDrawHandler.disable();
            clearActiveStates();
            this.classList.add('active');
        }
    });

    document.getElementById('removeAllMarkers').addEventListener('click', function() {
        allMarkers.forEach(marker => map.removeLayer(marker));
        allMarkers = [];
    });

    document.getElementById('removeAllPolylines').addEventListener('click', function() {
        allPolylines.forEach(polyline => map.removeLayer(polyline));
        allPolylines = [];
        routingControls.forEach(control => control.remove());
        routingControls = [];
    });

    function clearActiveStates() {
        document.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    }

    map.on('draw:created', function(e) {
        var type = e.layerType, layer = e.layer;
        if (type === 'marker') {
            map.addLayer(layer);
            createMarkerPopup(layer);
            allMarkers.push(layer);
        } else if (type === 'polyline') {
            map.addLayer(layer);
            allPolylines.push(layer);
            calculateAndDisplayDistance(layer);
            polylineDrawHandler.disable();
            document.getElementById('addPolylineMode').classList.remove('active');
            currentMode = null;
            var waypoints = layer.getLatLngs().map(function(latlng) {
                return L.latLng(latlng.lat, latlng.lng);
            });
            createRouting(waypoints);
        }
    });


    function createMarkerPopup(marker) {
        var latlng = marker.getLatLng();
        var popupContent = document.createElement('div');
        var coordsInfo = document.createElement('p');
        coordsInfo.textContent = `Coordinates: ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
        var form = document.createElement('form');
        var nameInput = document.createElement('input'); 
        nameInput.type = 'text';
        nameInput.name = 'markerName';
        nameInput.placeholder = 'Enter marker name';
        var inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.name = 'file';
        inputFile.accept = 'image/*,video/*';
        var submitButton = document.createElement('button');
        submitButton.textContent = 'Upload';
        submitButton.type = 'button';
        submitButton.onclick = function() {
            var formData = new FormData(form);
            formData.append('name', nameInput.value);
            fetch('/upload', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    marker.closePopup();
                }
            })
            .catch(error => console.error('Error:', error));
        };
        var removeButton = document.createElement('button');
        removeButton.textContent = 'Remove Marker';
        removeButton.type = 'button';
        removeButton.onclick = function() {
            map.removeLayer(marker);
            allMarkers = allMarkers.filter(m => m !== marker);
        };
        form.appendChild(nameInput);
        form.appendChild(inputFile);
        form.appendChild(submitButton);
        form.appendChild(removeButton);
        popupContent.appendChild(coordsInfo);
        popupContent.appendChild(form);
        marker.bindPopup(popupContent).openPopup();
    }

    function calculateAndDisplayDistance(layer) {
        var latlngs = layer.getLatLngs();
        var distance = latlngs.reduce((total, latlng, index, arr) => {
            return total + (index > 0 ? latlng.distanceTo(arr[index - 1]) : 0);
        }, 0).toFixed(2);
        var midpoint = latlngs[Math.floor(latlngs.length / 2)];
        L.popup().setLatLng(midpoint).setContent(`Non-routed distance: ${(distance / 1000).toFixed(2)} km`).openOn(map);
    }

    function createRouting(waypoints) {
        var routingControl = L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: true,
            show: false,
            addWaypoints: false,
            router: new L.Routing.osrmv1({
                serviceUrl: `https://router.project-osrm.org/route/v1`
            }),
            lineOptions: {
                styles: [{color: '#6FA1EC', weight: 7}]
            },
            fitSelectedRoutes: false
        }).addTo(map).on('routesfound', function(e) {
            var routes = e.routes;
            var summary = routes[0].summary;
            var lastWaypoint = waypoints[waypoints.length - 1];
            displayRouteSummary(summary.totalDistance, lastWaypoint);
        });
        routingControls.push(routingControl);  
    }    
    
    function displayRouteSummary(distance, latlng) {
        console.log(`Route distance: ${(distance / 1000).toFixed(2)} km`);
        L.popup().setLatLng(latlng).setContent(`Routed distance: ${(distance / 1000).toFixed(2)} km`).openOn(map);
    }

});
