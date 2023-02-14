exports.up = knex => knex.schema.createTable("meals", table => {
    table.increments("id");
    table.text("name");
    table.text("type");
    table.text("description");
    table.float("price");
    table.text("image").default(null);
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
})

exports.down = knex => knex.schema.dropTable("meals");