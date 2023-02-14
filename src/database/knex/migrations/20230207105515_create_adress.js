exports.up = knex => knex.schema.createTable("adress", table => {
    table.increments("id");
    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.text("nickname")
    table.text("cep");
    table.text("number");
    table.text("streetName");
    table.text("city");
})

exports.down = knex => knex.schema.dropTable("adress");