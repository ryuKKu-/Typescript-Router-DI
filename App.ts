/// <reference path="definitions/jquery.d.ts" />
/// <reference path="definitions/underscore.d.ts" />
/// <reference path="SimpleRouter.ts" />
/// <reference path="SimpleDI.ts" />


interface Window { 
    $injector: Injector;
}

class App {
    constructor() {
        window.$injector = new Injector();
    }

    start(array) {
        var fn = window.$injector.resolve(array);
        fn.apply({});
    }
}


$(document).ready(() => {
    var app = new App();

    app.start(["Router", ($router) => {
        $router
            .when("/", {
                controller: "IndexController"
            })
            .run();
    }]);
});
