const { Event } = require('klasa');

module.exports = class extends Event {

	run() {
		this.client.user.setPresence({ activity: { name: `with ${this.client.guilds.size} guild${this.client.guilds.size > 1 ? 's' : ''}!`, type: 0 } });
	}

};
