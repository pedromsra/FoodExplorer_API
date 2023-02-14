exports.up = knex => knex.schema.createTable("ingredientsMeal", table => {
    table.increments("id");
    table.integer("meal_id").references("id").inTable("meals").onDelete("CASCADE");
    table.integer("ingredient_id").references("id").inTable("ingredients").onDelete("CASCADE");
})

exports.down = knex => knex.schema.dropTable("ingredientsMeal");