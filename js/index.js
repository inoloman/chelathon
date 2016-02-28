var firebaseRef = new Firebase('https://second-oportunity.firebaseio.com');
// Verificamos si llega alguna promocion aceptada
firebaseRef.on('value', function(dataSnapshot){
    if(dataSnapshot.val().order_canceled){
        $('body').append('<div id="alert" class="alert alert-success" role="alert"><p>Hay una promoción cerca de tí</p> ' +
            '<a class="btn btn-default" href="#" role="button" data-toggle="modal"' +
            'data-target="#myModal">Revisar</a></div>');
    }
});

$(document).ready(function(){
    /*$('body').click(function(e){
        if (!e.target.is('#alert')){
            $('#alert').remove();
        }
    });*/

    $('#myModal').on('hidden.bs.modal', function (e) {
        $('#alert').remove();
    });
});

function acepta_promo(){
    firebaseRef.update({'order_accepted': true});
    firebaseRef.update({'order_canceled': false});
    $('#myModal').modal('hide');
    $('.modal-backdrop').remove();
}