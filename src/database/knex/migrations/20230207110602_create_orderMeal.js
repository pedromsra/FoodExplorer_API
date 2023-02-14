exports.up = knex => knex.schema.createTable("orderMeal", table => {
    table.increments("id");
    table.integer("meal_id").references("id").inTable("meals");
    table.integer("quantity");
    table.integer("order_id").references("id").inTable("orders").onDelete("CASCADE");
})

exports.down = knex => knex.schema.dropTable("orderMeal");