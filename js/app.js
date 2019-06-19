const SpeedCubing = {
    settings: {
        icons: false,
        filtered: 'all',
        show: {
            F2L: true,
            OLL: true,
            PLL: true
        },
        filters: []
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
        let appSettings = localStorage.getItem('app-settings');
        if(appSettings !== null){
            appSettings = JSON.parse(appSettings);
            $.extend(SpeedCubing.settings, appSettings);
        }
        //console.debug('app settings', SpeedCubing.settings);

        // current states
        if(SpeedCubing.settings.icons) {
            $('body').addClass('f-icons');
            $("#option-icons").parent('.btn').button("toggle");
        } else {
            $("#option-text").parent('.btn').button("toggle");
        }

        $("#option-show-" + SpeedCubing.settings.filtered).parent('.btn').button("toggle");

        $.each(SpeedCubing.settings.show, function(key, visible) {
            if (visible) {
                $("#option-" + key).parent('.btn').button("toggle");
            }
        });
    },

    save: function(config) {
        if(config.show) {
            $.extend(SpeedCubing.settings.show, config.show);
            delete config.show;
        }
        $.extend(SpeedCubing.settings, config);
        //todo save
        localStorage.setItem('app-settings', JSON.stringify(SpeedCubing.settings));
    },

    showAlgo: function () {
        let show, algorithms = [];

        $.each(SpeedCubing.settings.show, function(key, visible) {
            if (visible) {
                algorithms = algorithms.concat(SpeedCubing.alg[key]);
            }
        });

        // const filters = [
        //         "F2L-9", "F2L-27", "F2L-28", "F2L-29", "F2L-30", "F2L-31", "F2L-32", "F2L-33", "F2L-34", "F2L-36", "F2L-37", "F2L-38", "F2L-39", "F2L-40", "F2L-41",
        //         // "OLL-8", "OLL-9",
        //         "OLL-10", "OLL-11", /*"OLL-20",*/ "OLL-22", "OLL-23", "OLL-28", "OLL-29", "OLL-34",
        //         "OLL-35", "OLL-42", "OLL-44", "OLL-50", "OLL-51", "OLL-52", "OLL-53", "OLL-54", "OLL-55", "OLL-57",
        //         'PLL-E', 'PLL-F', 'PLL-Ra', 'PLL-Rb', 'PLL-Na', 'PLL-Nb', 'PLL-Ga', 'PLL-Gb', 'PLL-Gc', 'PLL-Gd'
        //     ];

        const filters = SpeedCubing.settings.filters;
        // TODO find why?
        const skipAlgs = [28, 55, 57];

        if (SpeedCubing.settings.filtered === 'filtered') {
            show = algorithms.filter(function (alg) {
                return filters.indexOf(alg.name) !== -1;
            });
        } else {
            show = algorithms;
        }

        const elements = show.map(function (alg) {
            const formula = $('<span>' + alg.f + '</span>').text();

            return [
                '<li class="algorithm', skipAlgs.indexOf(alg.i) === -1 ? '' : ' f-skip', '"',
                    ' data-alg-id="', alg.name, '"',
                    ' data-alg-key="', alg.i, '"',
                    ' data-toggle="modal"',
                    ' data-target="#algModal" title="', alg.name, ' - ', formula, '">',
                    '<img src="', alg.s, '">',
                    '<div class="f-text">', alg.f, '</div>',
                '</li>'
            ].join('');
        });

        if (elements.length === 0) {
            elements.push(`<div class="empty-list">
                <h3>You don't have any Filtered algorithms</h3>
                <p>To add a new one select <strong>All</strong> algorithms, open one and check <strong>Use in filter</strong></p>
            </div>`);
        }
        const $algorithms = $('#algorithms');
        $algorithms.html('');
        $algorithms.append(elements.join(''));
    },

    load: function () {
        $.ajax({
            url: 'algorithms/all.json',
            success: function (algorithms) {
                const algKeys = {};
                algorithms.F2L.forEach(function (el) {
                    el.name = "F2L-" + el.i;
                    algKeys[el.name] = el;
                });
                algorithms.OLL.forEach(function (el) {
                    el.name = "OLL-" + el.i;
                    algKeys[el.name] = el;
                });
                algorithms.PLL.forEach(function (el) {
                    el.name = "PLL-" + el.i;
                    algKeys[el.name] = el;
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
    const button = $(event.relatedTarget),
        id = button.data('alg-id'),
        modal = $(this);

    const algorithm = SpeedCubing.get(id),
        scramble = SpeedCubing.getScramble(algorithm);

    modal.data('alg-id', id);
    modal.find('.modal-title').html('<strong>' + id + '</strong>; ');
        // 'Scramble: <span class="scramble">' + scramble + '</span>');
    modal.find('.modal-body').html(
        '<img src="' + algorithm.s + '">' +
        algorithm.f +
        '<div class="scramble">' + scramble + '</div>'
    );

    const isInFilter = SpeedCubing.settings.filters.some(key => key === id);
    $('#use-in-filter').prop('checked', isInFilter);
});

$('#option-icons').change(function () {
    //console.debug('icons: ', true);
    SpeedCubing.save({icons: true});
    $('body').addClass("f-icons");
});
$('#option-text').change(function () {
    //console.debug('text: ', true);
    SpeedCubing.save({icons: false});
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
    // console.debug('option-show-all');
    SpeedCubing.save({filtered: 'all'});
    SpeedCubing.showAlgo();
});
$('#option-show-filtered').change(function () {
    //console.debug('option-show-filtered');
    SpeedCubing.save({filtered: 'filtered'});
    SpeedCubing.showAlgo();
});

$('#use-in-filter').change(function () {
    const checkbox = $(this),
        id = $('#algModal').data('alg-id'),
        checked = checkbox.prop("checked");
    //console.debug('use-in-filter', id, checked);
    if (checked) {
        SpeedCubing.settings.filters.push(id);
    } else {
        SpeedCubing.settings.filters = SpeedCubing.settings.filters.filter(key => key !== id);
    }
    SpeedCubing.save({filters: SpeedCubing.settings.filters});

    if (SpeedCubing.settings.filtered) {
        SpeedCubing.showAlgo();
    }
});

// TODO show/hide sub-title
// $('#option-sub-title').change(function() {
//     $('body').addClass( "f-show-subtitle" );
// });
// $('#option-sub-title').change(function() {
//     $('body').removeClass( "f-show-subtitle" );
// });

// TODO allow users to specify their own sub-algorithm to highlight
