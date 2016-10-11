var assign = require('core-js/library/fn/object/assign');
var Page = require('./page');
var analyzeObjets = require('../analyzers/objets');
var analyzePager = require('../analyzers/pager');
var calcul = require('../calcul');
var objetEnhancement = require('./objet-enhancement');

function analyze(doc, date, context) {
    var objets = analyzeObjets(doc, date);
    var pager = analyzePager(doc, date);

    context.objets = context.objets || {};
    assign(context.objets, objets);

    // update the 'perso' bonus data according to the objects in 'inventaire'
    if (context.perso) {
        var bonuses = calcul.bonusObjets(context.objets.inventaire);
        assign(context.perso, bonuses);
    }

    return {
        objets: objets,
        pager: pager
    };
}

function enhance(doc, context) {
    var sol = context.objets.sol || [];
    var inventaire = context.objets.inventaire || [];
    var objets = sol.concat(inventaire);
    objetEnhancement.enhance(doc, objets, context);
}

module.exports = Page('transfert', {
    analyze: analyze,
    enhance: enhance
});
