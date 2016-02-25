/* HTML utilities */
var extend = require('xtend/mutable');

function parseTag(tag) {
    var data = {
        '.': [],
        '#': []
    };

    // extract id and classes from tag string
    tag = tag.replace(/([#\.])([^#\.]+)/g, function(match, type, name) {
        data[type].push(name);
        return '';
    });

    return {
        'name': tag || 'div',
        'id': data['#'][0],
        'classes': data['.']
    };
}

function Renderer(document) {
    function text(str) {
        return document.createTextNode(str);
    }

    function create(tag, children, options) {
        tag = parseTag(tag);
        options = options || {};

        var el = document.createElement(tag.name),
            elOptions = extend({}, options),
            id = options.id || tag.id,
            classes = (options.classes || []).concat(tag.classes || []);

        // add the options
        elOptions.id = id;
        delete elOptions.classes;
        elOptions.className = classes.join(' ');
        extend(el, elOptions);

        // append the children
        if (children) {
            if (!Array.isArray(children)) {
                children = [children];
            }

            children.forEach(function (child) {
                if (typeof child === 'string' || child instanceof String) {
                    child = text(child);
                }
                el.appendChild(child);
            });
        }

        return el;
    }

    create.text = text;

    return create;
}

module.exports = Renderer;