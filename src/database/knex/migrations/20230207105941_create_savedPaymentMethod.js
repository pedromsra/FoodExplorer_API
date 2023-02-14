exports.up = knex => knex.schema.createTable("savedPaymentMethod", table => {
    table.increments("id");
    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.text("cardname");
    table.text("cardnumber");
    table.date("cardexpiresin");
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
})

exports.down = knex => knex.schema.dropTable("savedPaymentMethod");