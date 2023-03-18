exports.up = knex => knex.schema.alterTable("orders", table => {
    table.dropColumn("status");
})

exports.down = knex => knex.schema.dropTable("orders");