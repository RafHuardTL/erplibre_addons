odoo.define("rhuard_snippet.animation", function (require) {
    "use strict";

    let sAnimation = require("website.content.snippets.animation");
    let ajax = require("web.ajax");

    sAnimation.registry.rhuard_snippet = sAnimation.Class.extend({
        selector: ".o_rhuard_snippet",

        start: function () {
            let self = this;
            let _super = self._super.bind(this);

            // Objectif 1
            this._eventListText = this.$(".rh-text__value");
            // Objectif 2
            this._eventListAlimentsHardcoded = this.$(".rh-aliment__list");
            // Objectif 3
            this._sendPostAlimentForm = this.$(".rh-add-aliment__form");
            this._sendPostAlimentInput = this.$(".rh-add-aliment__input");
            this._eventListAliments = this.$(".rh-add-aliment__list");

            this._originalContentText = this._eventListText.text();
            this._originalContentAlimentsHardcoded = this._eventListAlimentsHardcoded.html();
            this._originalContentAliments = this._eventListAliments.html();

            $(this._sendPostAlimentInput).val("");

            const def1 = this.bonjour(self, this._eventListText);
            const def2 = this.updateAliments(self, this._eventListAlimentsHardcoded, "/rhuard_snippet/aliments_hardcoded");
            const def3 = this.updateAliments(self, this._eventListAliments, "/rhuard_snippet/aliments");

            this.add_aliment(self, this._sendPostAlimentInput);

            return $.when(def1, def2, def3).done(function () {
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
        updateAliments: function (self, eventList, route) {
            let def = self._rpc({
                route: route,
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
                    el.id = aliment.id;
                    el.textContent = aliment.name;
                    el.className = "rhuard_aliment";
                    eventList.append(el);
                }

                if (!$(eventList).html()) {
                    $(eventList).parent().hide();
                } else {
                    $(eventList).parent().show();
                }
            });

            return def;
        },
        add_aliment: function (self, eventList) {
            $(self._sendPostAlimentForm).submit(function (event) {
                event.preventDefault();

                if (!$(eventList).val()) {
                    return;
                }

                ajax.jsonRpc(
                    "/rhuard_snippet/add_aliment",
                    "call",
                    {"aliment_name": $(eventList).val()}
                ).done(function (data) {
                    self.updateAliments(self, self._eventListAliments, "/rhuard_snippet/aliments")
                });
            })
        },
        destroy: function () {
            this._super.apply(this, arguments);
            if (this._$loadedContentText) {
                this._eventListText.text(this._originalContentText);
            }
            this._eventListAlimentsHardcoded.html(this._originalContentAlimentsHardcoded);
            this._eventListAliments.html(this._originalContentAliments);
        }
    });
});