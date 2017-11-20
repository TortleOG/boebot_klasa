const BoebotClient = require('./structures/Boebot');

const { token } = require('../settings.json');

const client = new BoebotClient({
	prefix: 'b!',
	cmdEditing: true,
	provider: { engine: 'rethinkdb' },
	clientOptions: { fetchAllMembers: true }
});

if (process.version !== 'v8.9.0') return client.console.error(`This bot requires a node version of atleast v8.9.1 You have version ${process.version} installed. Please install the required version.`);

return client.login(token);
