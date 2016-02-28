var promotion_ok = false;
var directionsDisplay;
var directionsService;
var timesService;
var map;
var firebaseRef = new Firebase('https://second-oportunity.firebaseio.com');

// Verificamos si llega alguna promocion aceptada
firebaseRef.on('value', function(dataSnapshot){
    promotion_ok = dataSnapshot.val().order_accepted;
});

function calculate(orig, dest, moving){
    directionsService.route({
        origin: new google.maps.LatLng(orig),
        destination: new google.maps.LatLng(dest),
        travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
        // Generamos la ruta de la dirección y la marcamos en el mapa
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            if (!moving){
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
            }
        } else {
            console.dir('No se pudo calcular la dirección' + status);
        }
    });
}


// La posición del modelorama nunca cambia
var modelo_location = {lat: 19.4282786, lng: -99.2087178};
function initMap() {
    var now_origin = {lat: 19.4329379, lng: -99.2050056};
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
    timesService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({map: map, suppressMarkers: true});
    calculate(now_origin, modelo_location);

}


var numDeltas = 80;
var delay = 10; //milliseconds
var i = 0;
// Función que nos permitirá mover el pin en el mapa hacia el destino
function moveMarker(origin, route, step){
    i = 0;
    var deltaLat = (route[step].lat() - origin.getPosition().lat())/numDeltas;
    var deltaLng = (route[step].lng() - origin.getPosition().lng())/numDeltas;
    transition(deltaLat, deltaLng, origin, route, step);
}

// Función que acepta la oferta mencionda
function accept(response, origin){
    // Cambiamos el destino
    modelo_location = promotion_position;
    directionsDisplay.setDirections(response);
    info_accept.close();
    moveMarker(origin, response.routes[0].overview_path, 0);
}

// Función que rechaza la oferta mencionada
function denegate(state){
    transition(state.deltaLat, state.deltaLng, state.origin, state.route
        , state.step);
    info_accept.close();
}

// Función que hace la transición sin ser brusco
var promotion_position = {lat: 19.4306688, lng: -99.2056889};
var info_accept;

function transition(deltaLat, deltaLng, origin, route, step){
    if (promotion_ok){
        var state = {deltaLat: deltaLat,
            deltaLng: deltaLng, origin: origin, route: route, step: step};
        setTimeout(function(){
            calculateTime({lat: origin.getPosition().lat(),
                lng: origin.getPosition().lng()}, promotion_position, origin, state);
        }, 1000);
        return;
    }
    var latlng = new google.maps.LatLng(origin.getPosition().lat() + deltaLat, origin.getPosition().lng() + deltaLng);
    origin.setPosition(latlng);
    calculate({lat: latlng.lat(), lng: latlng.lng()}, modelo_location,  true);
    if(i!=numDeltas){
        i++;
        setTimeout(function(){
            transition(deltaLat, deltaLng, origin, route, step);
        }, delay);
    } else {
        moveMarker(origin, route, step+1);
    }
}


// Función que calcula el tiempo aproximado entre un punto y otro
function calculateTime(orig, dest, marker_origin, state){
    // Si nos llega la promoción la reiniciamos como falsa
    firebaseRef.update({'order_accepted': false});
    // E inicializamos el origen y el destino en LatLang de google
    var origen = new google.maps.LatLng(orig);
    var destino = new google.maps.LatLng(dest);
    timesService.route({
        origin: origen,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
        // Generamos la ruta de la dirección y la marcamos en el mapa
        console.dir(status);
        if (status === google.maps.DirectionsStatus.OK) {
            var content_string = '<div id="content">' +
                '<h3>Se acepto la oferta!</h3>' +
                '<p>Se ha aceptado la oferta tiempo aproximado de entrega: ' +
                response.routes[0].legs[0].duration.text + '</p>' +
                '<a class="btn btn-default" href="#" role="button" style="margin: 0 50px;">Aceptar</a>' +
                '<a class="btn btn-default" href="#" role="button" onclick="denegate()">Rechazar</a>' +
                '</div>';
            info_accept = new google.maps.InfoWindow({content: content_string});
            var promotion_marker = new google.maps.Marker({position: promotion_position, map: map,
                title: 'Nueva Oferta'});
            info_accept.open(map, promotion_marker);
            var content = $('#content');
            content.find('a').eq(0).click(function(){
                accept(response, marker_origin);
            });
            content.find('a').eq(1).click(function(){
                promotion_marker.setMap(null);
                denegate(state);
            });
        } else {
            console.dir('Hubo un error');
        }
    });
}