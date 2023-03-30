from odoo import http
import uuid


class RafaelHuardSnippetController(http.Controller):
    aliment_list = dict()
    aliment_list_hardcoded = dict()

    def __init__(self):
        self.aliment_list_hardcoded = {
            "aliments": [
                {
                    "id": 1,
                    "name": "Carotte"
                },
                {
                    "id": 2,
                    "name": "Lait"
                },
                {
                    "id": 3,
                    "name": "Chocolat"
                },
                {
                    "id": 4,
                    "name": "Orange"
                },
                {
                    "id": 5,
                    "name": "Pain"
                }
            ]
        }
        self.aliment_list = {
            "aliments": []
        }

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
        ["/rhuard_snippet/aliments_hardcoded"],
        type="json",
        auth="public",
        website=True,
        methods=["POST", "GET"],
        csrf=False,
    )
    def aliments_hardcoded(self):
        return self.aliment_list_hardcoded

    @http.route(
        ["/rhuard_snippet/aliments"],
        type="json",
        auth="public",
        website=True,
        methods=["POST", "GET"],
        csrf=False,
    )
    def aliments(self):
        return self.aliment_list

    @http.route(
        ["/rhuard_snippet/add_aliment"],
        type="json",
        auth="public",
        website=True,
        methods=["POST"],
        csrf=False,
    )
    def add_aliment(self, **kwargs):
        if not kwargs.get("aliment_name"):
            return False

        aliments_with_same_name = tuple((
            aliment for aliment in self.aliment_list.get("aliments")
            if aliment["name"] == kwargs.get("aliment_name")
        ))

        if len(aliments_with_same_name) > 0:
            return False

        new_aliment = {
            "id": uuid.uuid4(),
            "name": kwargs.get("aliment_name")
        }
        self.aliment_list.get("aliments").append(new_aliment)
        return new_aliment
