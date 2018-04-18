"use strict";

{
	let url = location.href;

	history.pushState({}, "", url.slice(0, url.indexOf("#")));

}
