const { Client } = require('klasa');

const { token } = require('../settings.json');

const client = new Client({
	prefix: 'b!',
	cmdEditing: true,
	provider: { engine: 'rethinkdb' },
	clientOptions: { fetchAllMembers: true }
});

client.login(token);
