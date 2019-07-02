var SpeedCubing = {
    settings: {
        icons: false,
        listType: 'all', // all | favorites
        show: {
            F2L: true,
            OLL: true,
            PLL: true
        },
        favorites: []
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
        //console.debug('app settings', SpeedCubing.settings);

        // current states
        if(SpeedCubing.settings.icons) {
            $('body').addClass('f-icons');
            $("#option-icons").parent('.btn').button("toggle");
        } else {
            $("#option-text").parent('.btn').button("toggle");
        }

        $("#option-show-" + SpeedCubing.settings.listType).parent('.btn').button("toggle");

        $.each(SpeedCubing.settings.show, function(key, visible) {
            if (visible) {
                $("#option-" + key).parent('.btn').button("toggle");
            }
        });

        // migrate old settings
        var filters = SpeedCubing.settings.filters;
        if (filters) {
            delete SpeedCubing.settings.filters;
            delete SpeedCubing.settings.filtered;
            SpeedCubing.save({
                favorites: filters
            });
        }
    },

    save: function(config) {
        if(config.show) {
            $.extend(SpeedCubing.settings.show, config.show);
            delete config.show;
        }
        $.extend(SpeedCubing.settings, config);
        localStorage.setItem('app-settings', JSON.stringify(SpeedCubing.settings));
    },

    showAlgo: function () {
        var show, algorithms = [];

        $.each(SpeedCubing.settings.show, function(key, visible) {
            if (visible) {
                algorithms = algorithms.concat(SpeedCubing.alg[key]);
            }
        });

        var favorites = SpeedCubing.settings.favorites;
        // TODO find why?
        var skipAlgs = [28, 55, 57];

        if (SpeedCubing.settings.listType === 'favorites') {
            show = algorithms.filter(function (alg) {
                return favorites.indexOf(alg.name) !== -1;
            });
        } else {
            show = algorithms;
        }

        var elements = show.map(function (alg) {
            var formula = $('<span>' + alg.f + '</span>').text();

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
            elements.push([
                '<div class="empty-list">',
                    '<h3>You don\'t have any <strong>Favorite</strong> algorithms</h3>',
                    '<p>To add a new one select <strong>All</strong> algorithms, open one and check <strong>Favorite</strong></p>',
                '</div>'
            ].join(''));
        }
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
    var button = $(event.relatedTarget),
        id = button.data('alg-id'),
        modal = $(this);

    var algorithm = SpeedCubing.get(id),
        scramble = SpeedCubing.getScramble(algorithm);

    modal.data('alg-id', id);
    modal.find('.modal-title').html('<strong>' + id + '</strong>; ');
        // 'Scramble: <span class="scramble">' + scramble + '</span>');
    modal.find('.modal-body').html(
        '<img src="' + algorithm.s + '">' +
        algorithm.f +
        '<div class="scramble">' + scramble + '</div>'
    );

    var isInFilter = SpeedCubing.settings.favorites.some(key => key === id);
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
    SpeedCubing.save({listType: 'all'});
    SpeedCubing.showAlgo();
});
$('#option-show-favorites').change(function () {
    //console.debug('option-show-favorites');
    SpeedCubing.save({listType: 'favorites'});
    SpeedCubing.showAlgo();
});

$('#use-in-filter').change(function () {
    var checkbox = $(this),
        id = $('#algModal').data('alg-id'),
        checked = checkbox.prop("checked");
    //console.debug('use-in-filter', id, checked);
    if (checked) {
        SpeedCubing.settings.favorites.push(id);
    } else {
        SpeedCubing.settings.favorites = SpeedCubing.settings.favorites.filter(key => key !== id);
    }
    SpeedCubing.save({
        favorites: SpeedCubing.settings.favorites
    });

    if (SpeedCubing.settings.listType === 'favorites') {
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
