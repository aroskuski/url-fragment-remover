"use strict";

const DEBUG_MODE = false;

function logInfo(message, tab){
	if(DEBUG_MODE){
		console.log(`URL Fragment Hider (on tab "${tab.title}"): ${message}`);
	}
}

function logError(message, tab){
	console.error(`URL Fragment Hider (on tab "${tab.title}"): ${message}`);
}

function shouldShowPageAction(id, url){
	return id !== browser.tabs.TAB_ID_NONE && url.indexOf("#") !== -1;
}

function updatePageActionState(tab){
	let id = tab.id;
	let url = tab.url;
	if(shouldShowPageAction(id, url)){
		browser.pageAction.show(id).then(
			() => logInfo("successfully showed fragment hider pageAction", tab),
			() => logError("failed to show fragment hider pageAction", tab));
	} else {
		browser.pageAction.hide(id).then(
			() => logInfo("successfully hid fragment hider pageAction", tab),
			() => logError("failed to hide fragment hider pageAction", tab));
	}
}

browser.tabs.onUpdated.addListener((id, info, tab) => {
	if(info.url){
		updatePageActionState(tab);
	}
});

browser.pageAction.onClicked.addListener(tab => {
	browser.tabs.executeScript(tab.id, {file : "/remove-fragment.js"}).then(
				() => logInfo("successfully removed fragment", tab),
				() => logError("failed to execute fragment remover script", tab));
});

// init state for existing tabs
browser.tabs.query({windowType:"normal"}).then(tabs => {
	for (let tab of tabs){
		updatePageActionState(tab);
	}
});

