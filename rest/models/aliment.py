from datetime import datetime
from odoo import api, models, fields


class AlimentModel(models.Model):
    _name = "rest.aliment"

    name = fields.Char(string="aliment_name")
    description = fields.Text(string="aliment_description")
    html = fields.Html(string="aliment_html")
    date = fields.Date(string="aliment_date")
    datetime = fields.Datetime(string="aliment_datetime")
    int = fields.Integer(string="aliment_int")
    float = fields.Float(string="aliment_float")
    bool = fields.Boolean(string="aliment_bool")

    @api.model_create_multi
    def create(self, vals_list):
        res = super().create(vals_list)
        for rec in res:
            self.env["bus.bus"].sendone(
                # f'["{self._cr.dbname}","{self._name}",{rec.id}]',
                # TODO choose unique canal name for the member
                "rest.aliment",
                {
                    "timestamp": str(datetime.now()),
                    "data": {
                        "name": rec.name,
                        "id": rec.id
                    },
                    "field_id": rec.id,
                    "canal": f'["{self._cr.dbname}","{self._name}"]',
                    "action": "add"
                },
            )
        return res
