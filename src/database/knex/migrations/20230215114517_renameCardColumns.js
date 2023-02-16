exports.up = knex => knex.schema.table("savedPaymentMethod", table => {
    table.renameColumn("cardname", "cardName");
    table.renameColumn("cardnumber", "cardNumber");
    table.renameColumn("cardexpiresin", "cardExpiresIn");
})

exports.down = knex => knex.schema.table("savedPaymentMethod", table => {
    table.renameColumn("cardName", "cardname");
    table.renameColumn("cardNumber", "cardnumber");
    table.renameColumn("cardExpiresIn", "cardexpiresin");
})