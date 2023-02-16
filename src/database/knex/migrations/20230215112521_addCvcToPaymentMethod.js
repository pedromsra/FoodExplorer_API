exports.up = knex => knex.schema.table("savedPaymentMethod", table => {
    table.text("csc")
})

exports.down = knex => knex.schema.table("savedPaymentMethod");