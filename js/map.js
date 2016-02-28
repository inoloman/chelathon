var directionsDisplay;
var directionsService;
var map;

function calculate(orig, dest){
    directionsService.route({
        origin: new google.maps.LatLng(orig),
        destination: new google.maps.LatLng(dest),
        travelMode: google.maps.TravelMode.DRIVING
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
    map = new google.maps.Map(document.getElementById('map'), {
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

    directionsService = new google.maps.DirectionsService();

    directionsDisplay = new google.maps.DirectionsRenderer({map: map});

    calculate(now_origin, modelo_location);

}
