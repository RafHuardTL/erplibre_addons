odoo.define("xmlrpc_base.animation", require => {
    "use strict";

    let sAnimation = require("website.content.snippets.animation");
    let ajax = require("web.ajax");
    let RequestHandler = require("xmlrpc_base.request-handler");

    sAnimation.registry.xmlrpc_base = sAnimation.Class.extend({
        selector: ".o_xmlrpc_base",

        start: function () {
            RequestHandler.afficher();

            let self = this;

            this._alimentList = this.el.getElementsByClassName("aliment-list")[0];
            this._form = this.el.getElementsByClassName("aliment-form")[0];
            this._input = this.el.getElementsByClassName("aliment__input")[0];
            this._originalContent = this._alimentList.innerHTML;

            this._input.value = "";

            const def = this.getAliments(self);

            this.deleteAliment(self);
            this.updateAliment(self);

            this.addAliment(self);

            return $.when(this._super.apply(this, arguments), def);
        },
        getAliments: function (self) {
            let def = self._rpc({
                route: "/xmlrpc_base/aliments"
            }).then(function (data) {
                if (data.error) {
                    return;
                }

                if (_.isEmpty(data)) {
                    self._$loadedContent = data;
                    self._alimentList.innerHTML = "";
                    self._alimentList.parentElement.style.display = "none";
                    return;
                }

                self._$loadedContent = data;
                self._alimentList.innerHTML = "";
                self._alimentList.parentElement.removeAttribute("style");

                for (const aliment of data) {
                    const alimentListItem = document.createElement("li");
                    alimentListItem.className = "aliment";
                    alimentListItem.id = aliment.id;

                    const alimentText = document.createElement("span");
                    alimentText.className = "aliment__text";
                    alimentText.setAttribute("contenteditable", "true");
                    alimentText.textContent = aliment.name;

                    const alimentDelete = document.createElement("div");
                    alimentDelete.className = "aliment__delete";

                    alimentListItem.append(alimentText);
                    alimentListItem.append(alimentDelete);
                    self._alimentList.append(alimentListItem);
                }
            });

            return def;
        },
        addAliment: function (self) {
            self._form.addEventListener("submit", event => {
                event.preventDefault();

                ajax.jsonRpc(
                    "/xmlrpc_base/add_aliment",
                    "call",
                    {"aliment_name": self._input.value}
                ).done(data => {
                    if (data.error) {
                        return;
                    }

                    if (_.isEmpty(data)) {
                        return;
                    }

                    self._input.value = "";
                    self.getAliments(self)
                })
            });
        },
        deleteAliment: function (self) {
            self.el.addEventListener("click", event => {
                if (!event.target.classList.contains("aliment__delete")) {
                    return;
                }

                const aliment_id = event.target.parentElement.id;

                ajax.jsonRpc(
                    "/xmlrpc_base/delete_aliment",
                    "call",
                    {"aliment_id": aliment_id}
                ).done(data => {
                    self.getAliments(self)
                });
            });
        },
        updateAliment: function (self) {
            self.el.addEventListener("keyup", event => {
                event.preventDefault();

                if (event.which === 13) {
                    event.target.innerHTML = event.target.textContent;
                    event.target.blur();
                    return false;
                }

                if (!event.target.classList.contains("aliment__text")) {
                    return;
                }

                const alimentId = event.target.parentElement.id;
                const alimentName = event.target.textContent;

                ajax.jsonRpc(
                    "/xmlrpc_base/update_aliment",
                    "call",
                    {
                        "aliment_id": alimentId,
                        "aliment_name": alimentName
                    }
                ).done(data => {
                    return true;
                })
            });
        },
        destroy: function () {
            this._super.apply(this, arguments);
            if (this._$loadedContent) {
                this._alimentList.innerHTML = this._originalContent;
            }
        }
    });
});