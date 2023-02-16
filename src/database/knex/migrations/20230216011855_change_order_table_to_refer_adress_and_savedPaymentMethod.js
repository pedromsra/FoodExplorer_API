exports.up = knex => knex.schema.alterTable('orders', table => {
    table.dropColumn('paymentMethod');
    table.integer('payment_id').references("id").inTable("savedPaymentMethod");
})

exports.down = knex => knex.schema.dropTable("orders");