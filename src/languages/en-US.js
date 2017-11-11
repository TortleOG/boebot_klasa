const { Language } = require('klasa');

module.exports = class extends Language {

	constructor(...args) {
		super(...args, { enabled: true });

		this.language = {
			MOD_BOT: (user) => `❌ | ${user}, I cannot execute moderation actions against bots.`,
			MOD_INVALID_USER: (user) => `❌ | ${user}, I cannot execute moderation actions against this user.`,
			MOD_KICKABLE: (user) => `❌ | ${user}, I cannot kick this user.`,
			MOD_BANNABLE: (user) => `❌ | ${user}, I cannot ban this user.`
		};
	}

};
