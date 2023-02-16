exports.up = knex => knex.schema.alterTable('orders', table => {
    table.dropColumn('destiny');
    table.integer('adress_id').references("id").inTable("adress");
})

exports.down = knex => knex.schema.dropTable("orders");