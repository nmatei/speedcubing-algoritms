var SpeedCubing = {
    settings: {
        icons: true,
        filtered: 'all',
        /*options: {
            filtered: true
        },*/
        show: {
            F2L: true,
            OLL: true,
            PLL: true
        }
    },
    alg: {},

    get: function(id) {
        return SpeedCubing.algKeys[id];
    },

    getScramble: function(algorithm) {
        var scramble = $('<span>' + algorithm.f + '</span>').text().replace(/[\(\)]/gi, '').split(/\s+/);
        scramble.reverse();
        scramble = scramble.map(function (move) {
            if(!move.endsWith('2')) {
                if (move.indexOf('’') !== -1) {
                    move = move.replace('’', '');
                } else {
                    move += '’';
                }
            }
            return move;
        });
        scramble = (algorithm.scramble ? (' *' + algorithm.scramble + ' / ') : '') + scramble.join(' ');
        return scramble;
    },

    init: function() {
        var appSettings = localStorage.getItem('app-settings');
        if(appSettings !== null){
            appSettings = JSON.parse(appSettings);
            $.extend(SpeedCubing.settings, appSettings);
        }
        // todo body cls
    },

    save: function(config) {
        if(config.show) {
            $.extend(SpeedCubing.settings.show, config.show);
            delete config.show;
        }
        $.extend(SpeedCubing.settings, config);
        //todo save
        localStorage.setItem('app-settings', JSON.stringify(SpeedCubing));
    },

    showAlgo: function () {
        var show, algorithms = [];

        $.each(SpeedCubing.settings.show, function(key, visible) {
            console.warn('key, visible: ', key, visible);
            if (visible) {
                algorithms = algorithms.concat(SpeedCubing.alg[key]);
            }
        });

        // TODO temporary add custom filter
        var filtered = [
                "F2L-9", "F2L-27", "F2L-28", "F2L-29", "F2L-30", "F2L-31", "F2L-32", "F2L-33", "F2L-34", "F2L-36", "F2L-37", "F2L-38", "F2L-39", "F2L-40", "F2L-41",
                // "OLL-8", "OLL-9",
                "OLL-10", "OLL-11", /*"OLL-20",*/ "OLL-22", "OLL-23", "OLL-28", "OLL-29", "OLL-34",
                "OLL-35", "OLL-42", "OLL-44", "OLL-50", "OLL-51", "OLL-52", "OLL-53", "OLL-54", "OLL-55", "OLL-57",
                'PLL-E', 'PLL-F', 'PLL-Ra', 'PLL-Rb', 'PLL-Na', 'PLL-Nb', 'PLL-Ga', 'PLL-Gb', 'PLL-Gc', 'PLL-Gd'
            ],
            skipAlgs = [
                28, 55, 57
            ];

        if (SpeedCubing.settings.filtered) {
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
    },

    load: function () {
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
                SpeedCubing.showAlgo();
            }
        });
    }
};

SpeedCubing.init();
SpeedCubing.load();

$('#algModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget),
        id = button.data('alg-id'),
        modal = $(this);

    var algorithm = SpeedCubing.get(id),
        scramble = SpeedCubing.getScramble(algorithm);

    modal.find('.modal-title').html('<strong>' + id + '</strong>; ');
        // 'Scramble: <span class="scramble">' + scramble + '</span>');
    modal.find('.modal-body').html(
        '<img src="' + algorithm.s + '">' +
        algorithm.f +
        '<div class="scramble">' + scramble + '</div>'
    );
});

$('#option-icons').change(function () {
    SpeedCubing.save({icons: 'f-icons'});
    $('body').addClass("f-icons");
});
$('#option-text').change(function () {
    SpeedCubing.save({icons: ''});
    $('body').removeClass("f-icons");
});

$('#option-F2L').change(function () {
    // SpeedCubing.show.F2L = $(this).is(":checked");
    SpeedCubing.save({
        show: {
            F2L: $(this).is(":checked")
        }
    });
    SpeedCubing.showAlgo();
});
$('#option-OLL').change(function () {
    // SpeedCubing.show.OLL = $(this).is(":checked");
    SpeedCubing.save({
        show: {
            OLL: $(this).is(":checked")
        }
    });
    SpeedCubing.showAlgo();
});
$('#option-PLL').change(function () {
    SpeedCubing.save({
        show: {
            PLL: $(this).is(":checked")
        }
    });
    SpeedCubing.showAlgo();
});

$('#option-show-all').change(function () {
    SpeedCubing.save({filtered: 'all'});
    SpeedCubing.showAlgo();
});
$('#option-show-filtered').change(function () {
    SpeedCubing.save({filtered: 'filtered'});
    SpeedCubing.showAlgo();
});

// TODO show/hide sub-title
// $('#option-sub-title').change(function() {
//     $('body').addClass( "f-show-subtitle" );
// });
// $('#option-sub-title').change(function() {
//     $('body').removeClass( "f-show-subtitle" );
// });

// TODO allow users to specify their own sub-algorithm to highlight
