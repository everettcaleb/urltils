# urltils (U-R-L-tils)
A JavaScript library for manipulating URLs. Currently in alpha stage.

## To Use
Either clone and compile using "gulp minify" or use a CDN (there isn't one yet).

### qs (query string)
Use `urltils.qs` to manipulate query strings and handle history and forward/back buttons

To build a query string from an object:

    urltils.qs.build({
        a: 5,
        b: 6,
        c: 12
    });

That would return `?a=5&b=6&c=12`.

To get the current query string as an object:

    urltils.qs.getAll();

That would return { a: 5, b: 6, c: 12 }.

To set the query string from an object, but not cause navigation. It still will call any `onChange` callbacks.
If you pass in `pushToHistory` then it will create an entry in history to go back to.

    urltils.qs.setAll({ a: 5, b: 6, c: 12 }, true);

Nothing is returned because the URL is set for you.

To set one part of the query string (inefficient!!!), but not cause navigation. It still will call `any onChange` callbacks.
If you pass in `pushToHistory` then it will create an entry in history to go back to.

    urltils.qs.set('a', 50, true);

Nothing is returned because the URL is set for you.

To register a callback that gets triggered: after navigating, after back/forward click (`popstate`), or after calling `set` or `setAll`.

    urltils.qs.onChange(function(params, isNavigation) {
        console.log(isNavigation ? 'navigated to' : 'changed settings');
    });

There is currently not a way to unregister callbacks but that'll come soon enough.
