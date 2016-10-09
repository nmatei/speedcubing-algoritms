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