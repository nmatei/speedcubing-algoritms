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
        i: nr.text(),
        s: img.attr('src'),
        f: formulaEl.html()
    });
});
JSON.stringify(olls);