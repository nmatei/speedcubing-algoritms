var F2L = [];
$('li.g1-column p').has('img').each(function(i, el) {
    el = $(el); console.debug(i, el);
    var img = el.find('img'),
        nr = i,
        formulaEl = el;

    if(!formulaEl.text()) {
        console.warn('formula not found', i, el);
        formulaEl = el.next('p');

    }
    F2L.push({
        i: i,
        s: img.attr('src').replace('http://www.speedcubing.ro/wp-content/uploads/2014/01/', './images/f2l/'),
        f: formulaEl.text()
    });
});
JSON.stringify(F2L);

var olls = [];
$('li.g1-column p').has('img').each(function(i, el) {
    el = $(el);
    var img = el.children('img'),
        nr = el.children('strong'),
        formulaEl = el.children('span');

    if(!formulaEl.length) {
        console.warn('formula not found', el);
    }

    olls.push({
        i: nr.text().replace(/\n/gi, '') * 1,
        s: img.attr('src').replace('./OLL_files/', './images/oll/'),
        f: formulaEl.html()
    });
});
JSON.stringify(olls);

var PLL = [];
$('li.g1-column p').has('img').each(function(i, el) {
    el = $(el);
    var img = el.children('img'),
        nr = el.children('strong'),
        formulaEl = el.children('span');

    if(!formulaEl.length) {
        console.warn('formula not found', el);
    }
    console.debug(el, nr.text());

    PLL.push({
        i: nr.text().replace(/\n/gi, ''),
        s: img.attr('src').replace('./PLL_files/', './images/pll/'),
        f: formulaEl.html()
    });
});
JSON.stringify(PLL);

