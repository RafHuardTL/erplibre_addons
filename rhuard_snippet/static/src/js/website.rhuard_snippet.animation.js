odoo.define("rhuard_snippet.animation", function (require) {
    "use strict";

    let sAnimation = require("website.content.snippets.animation");
    let ajax = require("web.ajax");

    sAnimation.registry.rhuard_snippet = sAnimation.Class.extend({
        selector: ".o_rhuard_snippet",

        start: function () {
            let self = this;
            let _super = self._super.bind(this);

            this._obj1Text = this.$(".rh-text__value");

            this._obj2ListAliments = this.$(".rh-aliment__list");

            this._obj3Form = this.$(".rh-add-aliment__form");
            this._obj3Input = this.$(".rh-add-aliment__input");
            this._obj3ListAliments = this.$(".rh-add-aliment__list");

            this._obj4Form = this.$(".rh-delete-aliment__form");
            this._obj4Input = this.$(".rh-delete-aliment__input");
            this._obj4ListAliments = this.$(".rh-delete-aliment__list");

            this._obj1OriginalContentText = this._obj1Text.text();
            this._obj2OriginalContentAliments = this._obj2ListAliments.html();
            this._obj3OriginalContentAliments = this._obj3ListAliments.html();
            this._obj3OriginalContentAliments = this._obj3ListAliments.html();

            $(this._obj3Input).val("");
            $(this._obj4Input).val("");

            const def1 = this.bonjour(self, this._obj1Text);
            const def2 = this.updateAliments(self, this._obj2ListAliments, "/rhuard_snippet/aliments_hardcoded");
            const def3 = this.updateAliments(self, this._obj3ListAliments, "/rhuard_snippet/aliments");
            const def4 = this.updateAlimentsObj4(self, this._obj4ListAliments, "/rhuard_snippet/aliments");

            this.add_aliment(self, this._obj3Form, this._obj3Input);
            this.add_aliment(self, this._obj4Form, this._obj4Input);
            this.delete_aliment(self, this._obj4ListAliments);

            return $.when(def1, def2, def3, def4).done(function () {
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
                    el.className = "rh-aliment";
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
        updateAlimentsObj4: function (self, eventList, route) {
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
                    el.className = "rh-aliment";

                    const delBtn = document.createElement("div");
                    delBtn.className = "rh-delete-aliment__button";

                    el.append(delBtn);
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
        add_aliment: function (self, form, input) {
            $(form).submit(function (event) {
                event.preventDefault();

                if (!$(input).val()) {
                    return;
                }

                ajax.jsonRpc(
                    "/rhuard_snippet/add_aliment",
                    "call",
                    {"aliment_name": $(input).val()}
                ).done(function (data) {
                    self.updateAliments(self, self._obj3ListAliments, "/rhuard_snippet/aliments")
                    self.updateAlimentsObj4(self, self._obj4ListAliments, "/rhuard_snippet/aliments")
                });
            })
        },
        delete_aliment: function (self, form) {
            $(form).click(function (event) {
                if (!event.target.classList.contains("rh-delete-aliment__button")) {
                    return;
                }

                const aliment_id = $(event.target).parent()[0].id;

                ajax.jsonRpc(
                    "/rhuard_snippet/delete_aliment",
                    "call",
                    {"aliment_id": aliment_id}
                ).done (function (data) {
                    self.updateAliments(self, self._obj3ListAliments, "/rhuard_snippet/aliments")
                    self.updateAlimentsObj4(self, self._obj4ListAliments, "/rhuard_snippet/aliments")
                });
            });
        },
        destroy: function () {
            this._super.apply(this, arguments);
            if (this._$loadedContentText) {
                this._obj1Text.text(this._obj1OriginalContentText);
            }
            this._obj2ListAliments.html(this._obj2OriginalContentAliments);
            this._obj3ListAliments.html(this._obj3OriginalContentAliments);
            this._obj4ListAliments.html(this._obj4OriginalContentAliments);
        }
    });
});