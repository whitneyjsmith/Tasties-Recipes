function populateContent(content) {
    // take a string and put it into the <div id='content-wrapper'>
    document.getElementById("content-wrapper").innerHTML = content;
}

function loadRecipe(url, rewrite=true) {
    /*
    TODO:
        - make sure the url begins with a "/" so people can't do cross-site-scripting
        - make the ajax request to load the html from the url
     */

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send(null);

    // TODO: change `content = url` to `content = the_results_of_the_ajax_request
    const content = xmlHttp.responseText;

    populateContent(content);

    // url rewriting
    if (rewrite) {
        const data = {"recipe": url};
        const querystring = encodeQueryData(data);
        window.history.pushState(querystring, "", querystring);
    }
}

function handleRecipeClick(event) {
    // notice that loadRecipe takes an event.
    // when an event listener calls a function it will pass an event as the parameter
    // an event includes a lot of data, but we only care about the target
    // the target is the DOM element that triggered the event.
    // in this case it will be the `<a>` that was clicked with all of its info
    const target = event.target;
    // this is just some magic that gets a data variable from html
    // notice that all the menu tags have `data-url=` in them.
    //
    // JS recognizes any `data-[name]` as a special attribute and will add all of the info to a dict
    // called `dataset`. Accessing a dataset is done by calling `.dataset['x']`
    // eg. calling `.dataset['name']` on `<div data-name="chum"></div>` will return `"chum"`.
    let url = target.dataset['url'];

    // let timestamp = + new Date;
    // url = url + "?t=" + timestamp;

    loadRecipe(url)
}
/*comment*/
window.onload = function () {
    // this query selector will find all `<a>` items inside of the `#menu` element
    let divs = document.querySelectorAll('ul#menu > li > a');
    // loop over all of the found `<a>`
    for (let i = 0; i < divs.length; i++) {
        // add a `click` event listener for all of the found `<a>` elements
        // an event listener tells the browser what to do when a certain action happens.
        // eg. when the user clicks item A do action B.
        // in this case, when a user clicks a link in the sidebar menu, call `loadRecipe`
        divs[i].addEventListener('click', handleRecipeClick, false);
    }
    // make an if statement that checks if there is a query.
    // if not then load omelete
    // if there is a ?recipe= then decode the query and load it instead
    // loadRecipe('/recipes/omelette.html');
    const urlParams = new URLSearchParams(window.location.search);
    const queryRecipe = urlParams.get('recipe');

    if (queryRecipe === null) {
        loadRecipe('/recipes/omelette.html', false);
    } else {
        loadRecipe(queryRecipe, false);
    }

};

function encodeQueryData(data) {
    const ret = [];
    for (let d in data)
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return "?" + ret.join('&');
}

