exports.up = knex => knex.schema.table("meals", table => {
    table.renameColumn("name", "title")
})

exports.down = knex => knex.schema.table("meals", table => {
    table.renameColumn("title", "name")
})