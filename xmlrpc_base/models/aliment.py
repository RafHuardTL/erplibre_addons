from odoo import models, fields


class AlimentModel(models.Model):
    _name = "xmlrpc_base.aliment"

    name = fields.Char(string="aliment_name")
