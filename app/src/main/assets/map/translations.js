
var localizedTranslations = {};
var translationBase = {};

function loadTranslationLanguage(language) {
    script = document.createElement("script");
    script.src = "../translations/" + language + ".js";
    document.head.appendChild(script);
}

function getUserLanguage() {
    // example to match from the WebView of the app:
    // "Mozilla/5.0 (Linux; U; Android 2.3.5; de-de; GT-I9001 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1 | language: en"
    var languageMatch = navigator.userAgent.match(/\|\s*language:\s*(\S+)$/);
    var locale = languageMatch == null ? navigator.language : languageMatch[1];
    return locale.split("-")[0];
}

var language = getUserLanguage();
console.log("The browser language is " + language);
var defaultLanguage = "en";

var define = function (newTranslations) {
    console.log("loaded translations for " + defaultLanguage);
    translationBase = newTranslations;
    //console.log("base translations", newTranslations);
    if (defaultLanguage == language) {
        localizedTranslations = translationBase;
        _notifyThatTheTranslationsAreLoaded();
    } else {
        define = function(newTranslations) {
            localizedTranslations = newTranslations;
            //console.log(language + " translations", newTranslations);
            console.log("loaded translations for " + language);
            _notifyThatTheTranslationsAreLoaded();
        }
        loadTranslationLanguage(language);
    }
}

loadTranslationLanguage(defaultLanguage);

function translate(key) {
    var t = localizedTranslations[key];
    if (t != undefined) {
        return t;
    }
    console.log("key " + key + " is not translated to " + language);
    t = translationBase[key];
    if (t != undefined) {
        return t;
    }
    console.log("ERROR: key " + key + " is not found in the " + defaultLanguage + " translations. It should be there. Make sure it is not misspelled.");
    return key;
}

function _notifyThatTheTranslationsAreLoaded0() {
    console.log("All translations are loaded.");
}
var toNotifyAboutLoad = [_notifyThatTheTranslationsAreLoaded0];
function _notifyThatTheTranslationsAreLoaded() {
    toNotifyAboutLoad.forEach(function (callback) {
        callback();
    });
    toNotifyAboutLoad = [];
}

function onNotifyThatTheTranslationsAreLoaded(func) {
    toNotifyAboutLoad.push(func);
}

// notify about translations even if they do not exist.
setTimeout(_notifyThatTheTranslationsAreLoaded, 100);
