odoo.define("rest.request-handler", require => {
    "use strict";

    let ajax = require("web.ajax");

    class RequestHandler {
        static get(context, route, callback) {
            const def = context._rpc({
                route: route
            }).then(data => {
                callback(data);
            });
            return def;
        }
        static post(route, params, callback) {
            const def = ajax.jsonRpc(route, "call", params).done(data => {
                callback(data);
            });
        }
    }

    return RequestHandler;
})