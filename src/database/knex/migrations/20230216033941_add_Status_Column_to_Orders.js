exports.up = knex => knex.schema.table("orders", table => {
    table.text("status").default("pendente")
})

exports.down = knex => knex.schema.table("orders");