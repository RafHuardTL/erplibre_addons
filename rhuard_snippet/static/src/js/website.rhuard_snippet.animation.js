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

            this._obj5Form = this.$(".rh-update-aliment__form");
            this._obj5Input = this.$(".rh-update-aliment__input");
            this._obj5ListAliments = this.$(".rh-update-aliment__list");

            this._obj1OriginalContentText = this._obj1Text.text();
            this._obj2OriginalContentAliments = this._obj2ListAliments.html();
            this._obj3OriginalContentAliments = this._obj3ListAliments.html();
            this._obj4OriginalContentAliments = this._obj4ListAliments.html();
            this._obj5OriginalContentAliments = this._obj5ListAliments.html();

            $(this._obj3Input).val("");
            $(this._obj4Input).val("");
            $(this._obj5Input).val("");

            const def1 = this.bonjour(self, this._obj1Text);
            const def2 = this.displayAliments(self, this._obj2ListAliments, "/rhuard_snippet/obj2_aliments");
            const def3 = this.displayAliments(self, this._obj3ListAliments, "/rhuard_snippet/obj3_aliments");
            const def4 = this.displayAlimentsObj4(self, this._obj4ListAliments, "/rhuard_snippet/obj4_aliments");
            const def5 = this.displayAlimentsObj5(self, this._obj5ListAliments, "/rhuard_snippet/obj5_aliments");

            this.add_aliment_obj3(self, this._obj3Form, this._obj3Input);
            this.add_aliment_obj4(self, this._obj4Form, this._obj4Input);
            this.add_aliment_obj5(self, this._obj5Form, this._obj5Input);
            this.delete_aliment_obj4(self, this._obj4ListAliments);
            this.delete_aliment_obj5(self, this._obj5ListAliments);

            return $.when(def1, def2, def3, def4, def5).done(function () {
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
        displayAliments: function (self, eventList, route) {
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
        displayAlimentsObj4: function (self, eventList, route) {
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
                    el.className = "rh-aliment";

                    const text = document.createElement("span");
                    text.className = "rh-aliment__text";
                    text.textContent = aliment.name;

                    const delBtn = document.createElement("div");
                    delBtn.className = "rh-delete-aliment__button";

                    el.append(text);
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
        displayAlimentsObj5: function (self, eventList, route) {
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
                    el.className = "rh-aliment";

                    const text = document.createElement("span");
                    $(text).attr("contenteditable", true);
                    text.className = "rh-aliment__text";
                    text.textContent = aliment.name;

                    const delBtn = document.createElement("div");
                    delBtn.className = "rh-delete-aliment__button";

                    $(text).keyup(function (e) {
                        self.updateAliments(self, e);
                    });

                    el.append(text);
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
        add_aliment_obj3: function (self, form, input) {
            $(form).submit(function (event) {
                event.preventDefault();

                if (!$(input).val()) {
                    return;
                }

                ajax.jsonRpc(
                    "/rhuard_snippet/obj3_add_aliment",
                    "call",
                    {"aliment_name": $(input).val()}
                ).done(function (data) {
                    $(input).val("");
                    self.displayAliments(self, self._obj3ListAliments, "/rhuard_snippet/obj3_aliments")
                });
            })
        },
        add_aliment_obj4: function (self, form, input) {
            $(form).submit(function (event) {
                event.preventDefault();

                if (!$(input).val()) {
                    return;
                }

                ajax.jsonRpc(
                    "/rhuard_snippet/obj4_add_aliment",
                    "call",
                    {"aliment_name": $(input).val()}
                ).done(function (data) {
                    $(input).val("");
                    self.displayAlimentsObj4(self, self._obj4ListAliments, "/rhuard_snippet/obj4_aliments")
                });
            })
        },
        add_aliment_obj5: function (self, form, input) {
            $(form).submit(function (event) {
                event.preventDefault();

                if (!$(input).val()) {
                    return;
                }

                ajax.jsonRpc(
                    "/rhuard_snippet/obj5_add_aliment",
                    "call",
                    {"aliment_name": $(input).val()}
                ).done(function (data) {
                    $(input).val("");
                    self.displayAlimentsObj5(self, self._obj5ListAliments, "/rhuard_snippet/obj5_aliments")
                });
            })
        },
        delete_aliment_obj4: function (self, form) {
            $(form).click(function (event) {
                if (!event.target.classList.contains("rh-delete-aliment__button")) {
                    return;
                }

                const aliment_id = $(event.target).parent()[0].id;

                ajax.jsonRpc(
                    "/rhuard_snippet/obj4_delete_aliment",
                    "call",
                    {"aliment_id": aliment_id}
                ).done(function (data) {
                    self.displayAlimentsObj4(self, self._obj4ListAliments, "/rhuard_snippet/obj4_aliments")
                });
            });
        },
        delete_aliment_obj5: function (self, form) {
            $(form).click(function (event) {
                if (!event.target.classList.contains("rh-delete-aliment__button")) {
                    return;
                }

                const aliment_id = $(event.target).parent()[0].id;

                ajax.jsonRpc(
                    "/rhuard_snippet/obj5_delete_aliment",
                    "call",
                    {"aliment_id": aliment_id}
                ).done(function (data) {
                    self.displayAlimentsObj5(self, self._obj5ListAliments, "/rhuard_snippet/obj5_aliments")
                });
            });
        },
        updateAliments: function (self, e) {
            const text = e.target;

            if (e.which === 13) {
                $(text).html($(text).text())
                $(text).blur();
                return false;
            }

            const aliment_id = $(text).parent()[0].id;
            const new_name = $(text)[0].textContent;

            ajax.jsonRpc(
                "/rhuard_snippet/update_aliment",
                "call",
                {
                    "aliment_id": aliment_id,
                    "new_name": new_name
                }
            ).done(function (data) {
                return true;
            });

            return false;
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