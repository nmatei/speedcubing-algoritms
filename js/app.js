var SpeedCubing = {
    options: {
        filtered: true
    },
    show: {
        F2L: true,
        OLL: true,
        PLL: true
    },
    alg: {},

    get: function(id) {
        return SpeedCubing.algKeys[id];
    }
};

$.ajax({
    url: 'algorithms/all.json',
    success: function (algorithms) {
        var algKeys = {};
        algorithms.F2L.forEach(function (el) {
            el.i = "F2L-" + el.i;
            algKeys[el.i] = el;
        });
        algorithms.OLL.forEach(function (el) {
            el.i = "OLL-" + el.i;
            algKeys[el.i] = el;
        });
        algorithms.PLL.forEach(function (el) {
            el.i = "PLL-" + el.i;
            algKeys[el.i] = el;
        });
        SpeedCubing.alg = algorithms;
        SpeedCubing.algKeys = algKeys;
        showAlgorithms();
    }
});

function showAlgorithms() {
    var show, algorithms = [];

    $.each(SpeedCubing.show, function(key, visible) {
        if (visible) {
            algorithms = algorithms.concat(SpeedCubing.alg[key]);
        }
    });

    // TODO temporary add custom filter
    var filtered = [
            // "OLL-8", "OLL-9",
            "OLL-10", "OLL-11", /*"OLL-20",*/ "OLL-22", "OLL-23", "OLL-28", "OLL-29", "OLL-34",
            "OLL-35", "OLL-42", "OLL-44", "OLL-50", "OLL-51", "OLL-52", "OLL-53", "OLL-54", "OLL-55", "OLL-57",
            'PLL-E', 'PLL-F', 'PLL-Ra', 'PLL-Rb', 'PLL-Na', 'PLL-Nb', 'PLL-Ga', 'PLL-Gb', 'PLL-Gc', 'PLL-Gd'
        ],
        skipAlgs = [
            28, 55, 57
        ];

    if (SpeedCubing.options.filtered) {
        show = algorithms.filter(function (alg) {
            return filtered.indexOf(alg.i) !== -1;
        });
    } else {
        show = algorithms;
    }

    var elements = show.map(function (alg) {
        var formula = $('<span>' + alg.f + '</span>').text();

        return [
            '<li class="algorithm',
            skipAlgs.indexOf(alg.i) === -1 ? '' : ' f-skip',
            '" data-alg-id="', alg.i, '" data-toggle="modal" data-target="#algModal" title="', alg.i, ' - ', formula, '">',
            '<img src="', alg.s, '">',
            '<div class="f-text">', alg.f, '</div>',
            '</li>'
        ].join('');
    });

    var $algorithms = $('#algorithms');
    $algorithms.html('');
    $algorithms.append(elements.join(''));
}

$('#algModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget),
        id = button.data('alg-id'),
        modal = $(this);

    var algorithm = SpeedCubing.get(id),
        scramble = $('<span>' + algorithm.f + '</span>').text().replace(/[\(\)]/gi, '').split(/\s+/);

    scramble.reverse();
    scramble = scramble.map(function (move) {
        if (move.indexOf('’') !== -1) {
            move = move.replace('’', '');
        } else {
            move += '’';
        }
        return move;
    });
    scramble = (algorithm.scramble ? (' ' + algorithm.scramble + ' / ') : '') + scramble.join(' ');

    modal.find('.modal-title').html('<img class="icon" src="' + algorithm.s +
        '"><strong>' + id + '</strong>; ');
        // 'Scramble: <span class="scramble">' + scramble + '</span>');
    modal.find('.modal-body').html(algorithm.f + '<div class="scramble">' + scramble + '</div>');
});

$('#option-icons').change(function () {
    $('body').addClass("f-icons");
});
$('#option-text').change(function () {
    $('body').removeClass("f-icons");
});

$('#option-F2L').change(function () {
    SpeedCubing.show.F2L = $(this).is(":checked");
    showAlgorithms();
});
$('#option-OLL').change(function () {
    SpeedCubing.show.OLL = $(this).is(":checked");
    showAlgorithms();
});
$('#option-PLL').change(function () {
    SpeedCubing.show.PLL = $(this).is(":checked");
    showAlgorithms();
});

$('#option-show-all').change(function () {
    SpeedCubing.options.filtered = false;
    showAlgorithms();
});
$('#option-show-filtered').change(function () {
    SpeedCubing.options.filtered = true;
    showAlgorithms();
});

// TODO show/hide sub-title
// $('#option-sub-title').change(function() {
//     $('body').addClass( "f-show-subtitle" );
// });
// $('#option-sub-title').change(function() {
//     $('body').removeClass( "f-show-subtitle" );
// });

// TODO allow users to specify their own sub-algorithm to highlight
