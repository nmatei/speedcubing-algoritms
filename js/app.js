
$.ajax({
    url: 'algorithms/oll.json',
    success: function(algorithms) {
        var ollElements = algorithms.map(function(alg) {
            var formula = $('<span>' + (alg.f || '') + '</span>').text();

            return '<li class="algorithm" data-alg-id="' + alg.i + '" data-toggle="modal" data-target="#algModal" title="' + alg.i + ' - ' + formula + '"><img src="' + alg.s + '"></li>';
        });

        $('#algorithms').append(ollElements.join(''));

        window.OLL = algorithms;
    }
});

$('#algModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget),
        id = button.data('alg-id'),
        modal = $(this);

    var algorithm = OLL[id - 1].f;

    //algorithm = algorithm.replace(/\s+/gi, '');

    modal.find('.modal-title').html('Formula: <strong>' + id + '</strong>');
    modal.find('.modal-body').html(algorithm);
});

