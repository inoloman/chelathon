function calculate(orig, dest){
    directionsService.route({
        origin: orig,
        destination: dest,
        travelMode: google.maps.TravelMode.BICYCLING
    }, function(response, status) {
        // Generamos la ruta de la dirección y la marcamos en el mapa
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('No se pudo calcular la dirección' + status);
        }
    });
}

function initMap() {
    var now_origin = {lat: 19.4329379, lng: -99.2050056};
    var modelo_location = {lat: 19.4282786, lng: -99.2087178};
    var directionsService = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 19.4306579, lng: -99.2059422},
        zoom: 16,
        styles: [{
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]  // Apagamos los puntos de interés
        }, {
            featureType: 'transit.station',
            stylers: [{ visibility: 'off' }]  // Apagamos las estaciones
        }],
        disableDoubleClickZoom: true
    });

    var directionsDisplay = new google.maps.DirectionsRenderer({map: map});

    var stepDisplay = new google.maps.InfoWindow;

    calculateAndDisplayRoute(
        directionsDisplay, directionsService, markerArray, stepDisplay, map);

    var marker = new google.maps.Marker({
        position: now_origin,
        map: map,
        title: 'Motor Now'
    });

    var modelo_marker = new google.maps.Marker({
        position: modelo_location,
        map: map,
        title: 'Modelorama'
    });
}
