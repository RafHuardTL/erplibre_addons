from odoo import http
import uuid


class RafaelHuardSnippetController(http.Controller):
    obj2_aliment_list = dict()
    obj3_aliment_list = dict()
    obj4_aliment_list = dict()

    def __init__(self):
        self.obj2_aliment_list = {
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
        self.obj3_aliment_list = {
            "aliments": []
        }
        self.obj4_aliment_list = {
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
        ["/rhuard_snippet/obj2_aliments"],
        type="json",
        auth="public",
        website=True,
        methods=["POST", "GET"],
        csrf=False,
    )
    def get_obj2_aliments(self):
        return self.obj2_aliment_list

    @http.route(
        ["/rhuard_snippet/obj3_aliments"],
        type="json",
        auth="public",
        website=True,
        methods=["POST", "GET"],
        csrf=False,
    )
    def get_obj3_aliments(self):
        return self.obj3_aliment_list

    @http.route(
        ["/rhuard_snippet/obj4_aliments"],
        type="json",
        auth="public",
        website=True,
        methods=["POST", "GET"],
        csrf=False,
    )
    def get_obj4_aliments(self):
        return self.obj4_aliment_list

    @http.route(
        ["/rhuard_snippet/obj3_add_aliment"],
        type="json",
        auth="public",
        website=True,
        methods=["POST"],
        csrf=False,
    )
    def obj3_add_aliment(self, **kwargs):
        if not kwargs.get("aliment_name"):
            return False

        aliments_with_same_name = tuple((
            aliment for aliment in self.obj3_aliment_list.get("aliments")
            if aliment["name"] == kwargs.get("aliment_name")
        ))

        if len(aliments_with_same_name) > 0:
            return False

        new_aliment = {
            "id": str(uuid.uuid4()),
            "name": kwargs.get("aliment_name")
        }
        self.obj3_aliment_list.get("aliments").append(new_aliment)
        return new_aliment

    @http.route(
        ["/rhuard_snippet/obj4_add_aliment"],
        type="json",
        auth="public",
        website=True,
        methods=["POST"],
        csrf=False,
    )
    def obj4_add_aliment(self, **kwargs):
        if not kwargs.get("aliment_name"):
            return False

        aliments_with_same_name = tuple((
            aliment for aliment in self.obj4_aliment_list.get("aliments")
            if aliment["name"] == kwargs.get("aliment_name")
        ))

        if len(aliments_with_same_name) > 0:
            return False

        new_aliment = {
            "id": str(uuid.uuid4()),
            "name": kwargs.get("aliment_name")
        }
        self.obj4_aliment_list.get("aliments").append(new_aliment)
        return new_aliment

    @http.route(
        ["/rhuard_snippet/delete_aliment"],
        type="json",
        auth="public",
        website=True,
        methods=["POST"],
        csrf=False
    )
    def delete_aliment(self, **kwargs):
        if not kwargs.get("aliment_id"):
            return False

        for aliment in self.obj4_aliment_list.get("aliments"):
            if aliment.get("id") == kwargs.get("aliment_id"):
                aliment_list = self.obj4_aliment_list.get("aliments")
                aliment_list.remove(aliment)
                return aliment

        return False
