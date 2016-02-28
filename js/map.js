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
            var directions = directionsDisplay.setDirections(response);
            console.dir(response);
            // Agregamos los marcadores personalizados para poder moverlos
            var now_marker = new google.maps.Marker({
                position: response.request.origin,
                map: map,
                title: 'Bicicle Now'
            });
            var modelo_marker = new google.maps.Marker({
                position: response.request.destination,
                map: map,
                title: 'Modelorama'
            });
            // Movemos el pin al primer paso
            moveMarker(now_marker, response.routes[0].overview_path, 0);
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
    directionsDisplay = new google.maps.DirectionsRenderer({map: map, suppressMarkers: true});
    calculate(now_origin, modelo_location);

}


var numDeltas = 50;
var delay = 10; //milliseconds
var i = 0;
// Función que nos permitirá mover el pin en el mapa hacia el destino
function moveMarker(origin, route, step){
    i = 0;
    var deltaLat = (route[step].lat() - origin.getPosition().lat())/numDeltas;
    var deltaLng = (route[step].lng() - origin.getPosition().lng())/numDeltas;
    transition(deltaLat, deltaLng, origin, route, step);
}
function transition(deltaLat, deltaLng, origin, route, step){
    var latlng = new google.maps.LatLng(origin.getPosition().lat() + deltaLat, origin.getPosition().lng() + deltaLng);
    origin.setPosition(latlng);
    if(i!=numDeltas){
        i++;
        setTimeout(function(){
            transition(deltaLat, deltaLng, origin, route, step);
        }, delay);
    } else {
        console.dir(step);
        if (step < 5){
            moveMarker(origin, route, step+1);
        }
    }
}
