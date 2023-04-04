from odoo import http
from uuid import uuid4


class RHuardAlimentsController(http.Controller):

    aliments = list()

    @http.route(
        ["/rhuard_aliments/aliments"],
        type="json",
        auth="public",
        website=True,
        methods=["POST", "GET"],
        csrf=False,
    )
    def get_aliments(self):
        return self.aliments

    @http.route(
        ["/rhuard_aliments/add_aliment"],
        type="json",
        auth="public",
        website=True,
        methods=["POST"],
        csrf=False,
    )
    def add_aliment(self, **kwargs):
        aliment_name = kwargs.get("aliment_name")

        if not aliment_name:
            return False

        aliments_with_same_name = tuple(
            aliment for aliment in self.aliments
            if aliment["name"] == aliment_name
        )

        if len(aliments_with_same_name) != 0:
            return False

        new_aliment = {
            "id": str(uuid4()),
            "name": aliment_name
        }

        self.aliments.append(new_aliment)
        return new_aliment

    @http.route(
        ["/rhuard_aliments/delete_aliment"],
        type="json",
        auth="public",
        website=True,
        methods=["POST"],
        csrf=False,
    )
    def delete_aliment(self, **kwargs):
        aliment_id = kwargs.get("aliment_id")

        if not aliment_id:
            return False

        for aliment in self.aliments:
            if aliment["id"] == aliment_id:
                self.aliments.remove(aliment)
                return True

        return False

    @http.route(
        ["/rhuard_aliments/update_aliment"],
        type="json",
        auth="public",
        website=True,
        methods=["POST"],
        csrf=False,
    )
    def update_aliment(self, **kwargs):
        aliment_id, aliment_name = kwargs.get("aliment_id"), kwargs.get("aliment_name")

        if not aliment_id:
            return False

        for aliment in self.aliments:
            if aliment["id"] == aliment_id:
                aliment["name"] = aliment_name
                return aliment

        return False

