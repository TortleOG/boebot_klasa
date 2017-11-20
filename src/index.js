const BoebotClient = require('./structures/Boebot');

const { token } = require('../settings.json');

const vMASTER = 'v8.9';
const [MAJOR, MINOR] = process.version.split('.');

if (vMASTER !== `${MAJOR}.${MINOR}`) throw `This bot requires a node version of atleast ${vMASTER} You have version ${process.version} installed. Please install the required version.`;

const client = new BoebotClient({
	prefix: 'b!',
	cmdEditing: true,
	provider: { engine: 'rethinkdb' },
	clientOptions: { fetchAllMembers: true }
});

return client.login(token);
