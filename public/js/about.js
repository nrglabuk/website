/**
 * The class name for active elements.
 * @type string
 */
const activeClass = "active";

/**
 * Get the correct URL that should be shown in the browser for the article ID given.
 * @param {string} articleID
 * @returns string
 */
const getURL = articleID => "/about/" + (articleID !== "about" ? articleID : "");

/**
 * API for hiding or showing an article.
 * @typedef Article
 * @property {function: void} hide Hides the article.
 * @property {function: void} show Shows the article.
 */

/**
 * @param {HTMLElement} element An article's container element.
 * @returns Article
 * @constructor
 */
function Article(element) {

	/**
	 * The article's ID.
	 * @type string
	 */
	const id = element.id;

	/**
	 * The article's JavaScript button.
	 * @type HTMLAnchorElement
	 */
	const button = document.getElementById(id + "-btn");

	// Add event listener to button
	button.addEventListener('click', event => {
		event.preventDefault();
		if (history.state.article !== id) {
			showArticle(id);
			history.pushState({article: id}, "", getURL(id));
		}
	});

	return {
		show: () => {
			element.classList.add(activeClass);
			button.classList.add(activeClass);
			document.title = button.innerText + " | NRGLAB";
		},
		hide: () => {
			element.classList.remove(activeClass);
			button.classList.remove(activeClass);
		}
	}
}

/**
 * Make an article visible.
 * @param {string} articleID The ID of an article.
 * @returns void
 */
const showArticle = (() => {

	/**
	 * Object containing all Articles to iterate through.
	 * Uses article's ID attribute as the key.
	 * @type {Object<Article>}
	 */
	const articles = {};

	// Populate articles from <article> tags
	for (const article of document.getElementsByTagName('article')) {
		articles[article.id] = Article(article);
		// Replace history state to remove loading times when going forward/back in browser
		if (article.classList.contains(activeClass)) history.replaceState({article: article.id}, "", getURL(article.id));
	}

	return articleID => Object.keys(articles).forEach(key => articles[key][key === articleID ? "show" : "hide"]());
})();

// Switching articles on this page with JS adds a state to the history.
// This listener uses JS to retrace this navigation instead of reloading the page when using forward/back browser controls.
window.addEventListener('popstate', event => showArticle(event.state.article));
