odoo.define("rhuard_snippet.animation", function (require) {
    "use strict";

    console.log("JavaScript de Rafael Huard");

    let sAnimation = require("website.content.snippets.animation");

    sAnimation.registry.rhuard_snippet = sAnimation.Class.extend({
        selector: ".o_rhuard_snippet",

        start: function () {
            let self = this;
            this._eventList = this.$(".rhuard_snippet_value");
            this._originalContent = this._eventList.text();
            let def = this._rpc({
                route: "/rhuard_snippet/bonjour",
            }).then(function (data) {
                if (data.error) {
                    return;
                }

                if (_.isEmpty(data)) {
                    return;
                }

                self._$loadedContent = $(data);
                self._eventList.text(data["message"]);
            });

            return $.when(this._super.apply(this, arguments), def);
        },
        destroy: function () {
            this._super.apply(this, arguments);
            if (this._$loadedContent) {
                this._eventList.text(this._originalContent);
            }
        }
    });
});