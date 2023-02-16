exports.up = knex => knex.schema.table("orders", table => {
    table.float("value")
})

exports.down = knex => knex.schema.table("orders");