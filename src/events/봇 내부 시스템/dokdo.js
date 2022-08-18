const client = require('../../../index')
const Dokdo = require('dokdo');
const DokdoHandler = new Dokdo(client, { aliases: ['dokdo', 'dok', '독도', 'dkd'], prefix: 't!' })

client.on('messageCreate', async (msg) => {
    DokdoHandler.run(msg) // try !dokdo
})