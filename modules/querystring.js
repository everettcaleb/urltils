window.urltils.qs = {};

!function() {
    var qs = window.urltils.qs,
        // Regex to pull data from query string parameters or query string-like parameters in the location hash
        PARAMETER_EXTRACTION_REGEX = /([\?|&](([^#&=]+)=([^#&=]*)))/g,
        // Regex for splitting query string pieces into key/value pairs
        SPLIT_REGEX = /([^=]+)=([^=]*)/,
        callbacks = [];

    // Constructs a query string from an object containing parameters
    // stripEmpty: strips empty parameters if set
    // ex: { a: 5, b: 6, c: 12 } would return ?a=5&b=6&c=12
    function qs_build(params, stripEmpty) {
        var paramArray = [],
            key = null,
            v = null;

        if(stripEmpty) {
            for(key in params) {
                v = params[key];
                if(v == null || v == undefined || v == '') {
                    continue;
                }
                paramArray.push(encodeURIComponent(key) + '=' + encodeURIComponent(v));
            }
        }
        else {
            for(key in params) {
                paramArray.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
            }
        }

        return '?' + paramArray.join('&');
    }
    qs.build = qs_build;

    // Gets the current URL and extracts parameters from it, returns an object containing the parameters
    // ex: google.com/search?q=whatever would return { q: 'whatever' }
    function qs_getAll() {
        var matches = location.href.match(PARAMETER_EXTRACTION_REGEX),
            params = {};

        if(matches) {
            matches = matches.forEach(function(m) {
                var m2 = m.slice(1).match(SPLIT_REGEX);
                params[m2[1]] = m2[2];
            });
        }

        return params;
    }
    qs.getAll = qs_getAll;

    // Sets all URL parameters
    // pushToHistory is whether to push the URL change to history like a navigation
    // note: strips params with empty, null, or undefined values
    function qs_setAll(params, pushToHistory) {
        var p = qs_build(params, true);

        if(pushToHistory) {
            history.pushState( params, "", location.pathname + p );
        } else {
            history.replaceState( params, "", location.pathname + p );
        }

        callbacks.forEach(function(c) {
            c(params, false);
        });
    }
    qs.setAll = qs_setAll;

    // Sets a single parameter of the URL, pass no value to delete a parameter
    // pushToHistory is whether to push the URL change to history like a navigation
    // note: strips params with empty, null, or undefined values
    function qs_set(key, value, pushToHistory) {
        var params = qs_getAll();
        params[key] = value;
        qs_setAll(params, pushToHistory);
    }
    qs.set = qs_set;

    // Registers a callback to handle URL changes
    // callback: function(params, isNavigation) where params are the result of getAll
    //    and isNavigation is whether the user triggered it
    function qs_onChange(f) {
        callbacks.push(f);
    }
    qs.onChange = qs_onChange;

    // Handle back-button navigation
    window.addEventListener('popstate', function() {
        var params = qs_getAll();

        if(callbacks.length) {
            callbacks.forEach(function(c) {
                c(params, true);
            });
        }
    });
}();
