from odoo import http


class XmlRpcBaseController(http.Controller):

    @http.route(
        ["/xmlrpc_base/aliments"],
        type="json",
        auth="public",
        website=True,
        methods=["POST", "GET"],
        csrf=False,
    )
    def get_aliments(self):
        aliment_response = http.request.env["xmlrpc_base.aliment"].search([])
        aliments = list()
        for aliment in aliment_response:
            aliments.append({
                "id": aliment["id"],
                "name": aliment["name"]
            })
        return aliments

    @http.route(
        ["/xmlrpc_base/add_aliment"],
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

        aliments_with_same_name = http.request.env["xmlrpc_base.aliment"].search([("name", "=", aliment_name)])

        if len(aliments_with_same_name) != 0:
            return False

        new_aliment = {"name": aliment_name}

        http.request.env["xmlrpc_base.aliment"].create(new_aliment)
        return new_aliment

    @http.route(
        ["/xmlrpc_base/delete_aliment"],
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

        http.request.env["xmlrpc_base.aliment"].search([("id", "=", aliment_id)], limit=1).unlink()
        return True

    @http.route(
        ["/xmlrpc_base/update_aliment"],
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

        matching_aliment = http.request.env["xmlrpc_base.aliment"].search([("id", "=", aliment_id)], limit=1)
        matching_aliment.write({"name": aliment_name})
        return True

