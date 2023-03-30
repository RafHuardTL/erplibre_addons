odoo.define("rhuard_snippet.animation", function (require) {
    "use strict";

    let sAnimation = require("website.content.snippets.animation");

    sAnimation.registry.rhuard_snippet = sAnimation.Class.extend({
        selector: ".o_rhuard_snippet",

        start: function () {
            let self = this;
            let _super = self._super.bind(this);

            this._eventListText = this.$(".rhuard_snippet_value");
            this._eventListAliments = this.$(".rhuard_aliment_list");

            this._originalContentText = this._eventListText.text();
            this._originalContentAliments = this._eventListAliments.html();

            const def1 = this.bonjour(self, this._eventListText);
            const def2 = this.aliments(self, this._eventListAliments);

            return $.when(def1, def2).done(function () {
                _super.apply(this, arguments);
            });
        },
        bonjour: function (self, eventList) {
            let def = self._rpc({
                route: "/rhuard_snippet/bonjour",
            }).then(function (data) {
                if (data.error) {
                    return;
                }

                if (_.isEmpty(data)) {
                    return;
                }

                self._$loadedContentText = $(data);
                eventList.text(data["message"]);
            });

            return def;
        },
        aliments: function (self, eventList) {
            let def = self._rpc({
                route: "/rhuard_snippet/aliments",
            }).then(function (data) {
                if (data.error) {
                    return;
                }

                if (_.isEmpty(data)) {
                    return;
                }

                self._loadedContentAliments = $(data);
                const aliments = data["aliments"];

                $(eventList).html("");
                for (const aliment of aliments) {
                    const el = document.createElement("li");
                    el.textContent = aliment.name;
                    el.className = "rhuard_aliment";
                    eventList.append(el);
                }
            });

            return def;
        },
        destroy: function () {
            this._super.apply(this, arguments);
            if (this._$loadedContentText) {
                this._eventListText.text(this._originalContentText);
            }
            this._eventListAliments.html(this._originalContentAliments);
        }
    });
});