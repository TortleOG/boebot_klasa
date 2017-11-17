const BoebotClient = require('./structures/Boebot');

const { token } = require('../settings.json');

const client = new BoebotClient({
	prefix: 'b!',
	cmdEditing: true,
	provider: { engine: 'rethinkdb' },
	clientOptions: { fetchAllMembers: true }
});

client.login(token);
