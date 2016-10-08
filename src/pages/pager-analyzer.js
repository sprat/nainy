var jsAnalyzer = require('./js-analyzer');
var extend = require('xtend/mutable');

function int(v) {
    return parseInt(v, 10);
}

function analyze(js, context) {
    var regex = /miseajourpager\((.*)\);/ig;
    var keys = 'pa,pv,pvbase,classeeven,evnonlu,classechat,mesgnonlu,posx,posy,IDS,newmonochat'.split(',');
    var object = jsAnalyzer.buildObjectsFromJSSequences(js, regex, keys)[0];
    var pager = {
        PA: int(object.pa),
        vie: int(object.pv),
        vieTotal: int(object.pvbase),
        position: [int(object.posx), int(object.posy)],
        messagesNonLus: int(object.mesgnonlu),
        nainxpressNonLu: object.newmonochat.indexOf('<b>') === 0
    };

    context.perso = context.perso || {};
    extend(context.perso, pager);

    return pager;
}

module.exports = {
    analyze: analyze
};