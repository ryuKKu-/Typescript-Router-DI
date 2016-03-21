export class Router {
    routes: Array<any>;

    constructor() {
        this.routes = new Array();
    }

    when(re: string, opts: {}) {
        this.routes.push({ re: re, opts: opts });
        return this;
    }
        
    otherwise(opts: {}) {
        this.routes.push({ re: "otherwise", opts: opts });
        return this;
    }

    run() {
        var url = location.pathname;
        this.executeUrlMatch(url);
    }

    private executeUrlMatch(url: string) {
        for (var i = 0; i < this.routes.length; i++) {
            var regExp = "^" + this.routes[i].re.replace("/\//g", "\\/") + "$";

            var m = regExp.match(new RegExp(":.[^\/]", "g"));
            _.each(m, r => {
                regExp = regExp.replace(r, "[0-9]+");
            });

            var match = url.match(regExp);

            if (match) {
                match.shift();

                try {
                    var ctr = Object.create(window["Controller"][this.routes[i].opts.controller].prototype);
                    ctr.constructor.apply(ctr);
                } catch (e) {
                    throw new Error(`Controller ${this.routes[i].opts.controller} does not exist.`);
                }

                return this;
            } 
        }

        try {
            var route = _.findWhere(this.routes, { re: "otherwise" });
            var ctr = Object.create(window["Controller"][route.opts.controller].prototype);
            ctr.constructor.apply(ctr);
        } catch (e) {
            throw new Error("Error");
        }

        return this;
    }
}
