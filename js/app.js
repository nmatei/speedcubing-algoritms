
$.ajax({
    url: 'algorithms/oll.json',
    success: function(algorithms) {
        var showAlgorithms;

        // TODO temporary add custom filter
        var selectedAlg = [8,9,10,11,20,22,23,28,29,34,35,42,44,50,51,52,53,54,55,57];

        showAlgorithms = algorithms.filter(function(alg) {
            return selectedAlg.indexOf(alg.i) !== -1;
        });

        var ollElements = showAlgorithms.map(function(alg) {
            var formula = $('<span>' + alg.f + '</span>').text();

            return [
                '<li class="algorithm" data-alg-id="', alg.i, '" data-toggle="modal" data-target="#algModal" title="', alg.i, ' - ', formula, '">',
                    '<img src="', alg.s, '">',
                    // '<div class="f-text">', formula.replace(/\s+/gi, '') ,'</div>',
                    '<div class="f-text">', alg.f ,'</div>',
                '</li>'
            ].join('');
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


$('#option-icons').change(function() {
    $('body').addClass( "f-icons" );
});
$('#option-text').change(function() {
    $('body').removeClass( "f-icons" );
});

// TODO show/hide sub-title
// $('#option-sub-title').change(function() {
//     $('body').addClass( "f-show-subtitle" );
// });
// $('#option-sub-title').change(function() {
//     $('body').removeClass( "f-show-subtitle" );
// });