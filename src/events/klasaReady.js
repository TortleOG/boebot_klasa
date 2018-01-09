const { Event } = require('klasa');

module.exports = class extends Event {

	async run() {
		// Validate that all settings exist
		await this.client.validate();

		// Setup external structures
		await this.client.setup();

		// Set presence activity
		this.client.user.setPresence({ activity: { name: `with ${this.client.guilds.size} guild${this.client.guilds.size > 1 ? 's' : ''}!`, type: 0 } });
	}

};
