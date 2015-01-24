// jshint ignore: start

(function() {

    var browser = false;

    var is_iOS = /iP(hone|od|ad)/.test(navigator.platform) && /Apple Computer/.test(navigator.vendor);
    var isIE10 = (Function('/*@cc_on return document.documentMode===10@*/')());
    var isIE11  = (!(window.ActiveXObject) && "ActiveXObject" in window);
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    var isFirefox = /Mozilla/.test(navigator.userAgent) && navigator.vendor === '';

    browser = (browser === false && ( is_iOS )) ? 'ios' : false;
    browser = (browser === false && ( isIE10 )) ? 'ie10' : browser;
    browser = (browser === false && ( isIE11 )) ? 'ie11' : browser;
    browser = (browser === false && ( isChrome )) ? 'chrome' : browser;
    browser = (browser === false && ( isSafari )) ? 'safari' : browser;
    browser = (browser === false && ( isFirefox )) ? 'firefox' : browser;

    var addBrowserClass = function(browser) {
        $("html").addClass(browser);
    };

    var iOS_Browser = function(browser) {
        var ver;
        (function() {
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            ver = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
        })();
        browser = "ios" + ver[0];
        if (browser === 'ios7') {
            window.addEventListener("resize", function() {
                $('.entry').hide().fadeIn(1);
            }, false);

        // iOS 8 Simulator returns '10'
        } else if (browser === 'ios10') {
            browser = 'ios8';
        }
        addBrowserClass(browser);
    };

    var browserActions = {
        'ie10': addBrowserClass,
        'ie11': addBrowserClass,
        'chrome': addBrowserClass,
        'safari': addBrowserClass,
        'firefox': addBrowserClass,
        'ios': iOS_Browser,
    };

    function processBrowser(browser) {
        if (typeof browserActions[browser] !== 'function') {
            return;
        }
        //console.log('browser processed!');
        //console.log('browser: ' + browser);
        return browserActions[browser](browser);
    };

    processBrowser(browser);

}());

// jshint ignore: end