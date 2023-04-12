from odoo import models, fields


class AlimentModel(models.Model):
    _name = "rhuard.aliment"

    name = fields.Char(string="aliment_name")
