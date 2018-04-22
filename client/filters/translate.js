const angular = require('angular');

module.exports = function($q, $http) {
    "ngInject";

    function getFirstBrowserLanguage() {
        let nav = window.navigator,
            browserLanguagePropertyKeys = ['language', 'userLanguage', 'browserLanguage'],
            i,
            language;

        if (angular.isArray(nav.languages)) {
            for (i = 0; i < nav.languages.length; i++) {
                language = nav.languages[i];
                if (language && language.length) {
                    return language;
                }
            }
        }
        for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
            language = nav[browserLanguagePropertyKeys[i]];
            if (language && language.length) {
                return language;
            }
        }
        return 'zh';
    };

    var lang = getFirstBrowserLanguage().toLowerCase();
    if (lang.indexOf('zh') > -1) {
        lang = require('../i18n/zh.json');
    } else {
        lang = require('../i18n/en.json');
    }

    return function(key) {
        return lang && lang[key] || key;
    }
};