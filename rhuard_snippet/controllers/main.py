from odoo import http


class RafaelHuardSnippetController(http.Controller):
    @http.route(
        ["/rhuard_snippet/bonjour"],
        type="json",
        auth="public",
        website=True,
        methods=["POST", "GET"],
        csrf=False,
    )
    def dire_bonjour(self):
        return {"message": "Bonjour, le monde!"}

    @http.route(
        ["/rhuard_snippet/aliments"],
        type="json",
        auth="public",
        website=True,
        methods=["POST", "GET"],
        csrf=False
    )
    def aliments(self):
        return {
            "aliments": [
                {
                    "name": "Carotte"
                },
                {
                    "name": "Lait"
                },
                {
                    "name": "Chocolat"
                },
                {
                    "name": "Orange"
                },
                {
                    "name": "Pain"
                }
            ]
        }
