exports.up = knex => knex.schema.alterTable("orders", table => {
    table.text("status").default("created")
})

exports.down = knex => knex.schema.dropTable("orders");
