var firebaseRef = new Firebase('https://second-oportunity.firebaseio.com');
$(document).ready(function(){
    $('#principal').find('a').click(function(){
        firebaseRef.update({'order_canceled': true}, function(){
            window.location = "/now.html"
        });
    })
});
