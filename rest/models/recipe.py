from odoo import models, fields


class RecipeModel(models.Model):
    _name = "rest.recipe"

    name = fields.Char(string="recipe_name")
    description = fields.Text(string="recipe_description")
    aliments = fields.Many2many("rest.aliment", string="recipe_aliments")
