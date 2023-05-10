from odoo import models, fields


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
