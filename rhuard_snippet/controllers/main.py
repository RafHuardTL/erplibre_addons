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
        return {"message": "Bonjour le monde!"}
