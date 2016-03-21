export class Injector {
    dependencies: {}; 

    constructor() {
        this.dependencies = {};
    }

    register(key, name, value) {
        this.dependencies[key] = {
            name: name,
            value: value
        };
    }

    resolve(...params: any[]) {
        var func, deps, args = [];
        func = params[0][params[0].length - 1];
        deps = func.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].replace(/ /g, '').split(',');

        return () => {
            for (var i = 0; i < deps.length; i++) {
                var cl = params[0][i].split(".");

                try {
                    if (cl.length === 1) {
                        this.register(deps[i], params[0][i], new window[<string>cl[0]]);
                    } else {
                        this.register(deps[i], params[0][i], new window[<string>cl[0]][<string>cl[1]]);
                    }
                } catch (e) {
                    throw new Error(`Type ${params[0][i]} not found.`);
                }

                args.push(this.dependencies[deps[i]].value);
            }

            func.apply({}, args);
        }
    }

    get(name) {
        try {
            return _.findWhere(_.values(this.dependencies), { name: name }).value;
        } catch (e) {
            throw new Error(`Dependency ${name} not found.`);
        }
    }
}