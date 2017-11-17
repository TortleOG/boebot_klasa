const { Client } = require('klasa');
const { Collection } = require('discord.js');

module.exports = class BoebotClient extends Client {

	constructor(options) {
		super(options);

		this.queue = new Collection();
	}

};
