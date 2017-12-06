// Packages
const { Client } = require('klasa');
const { Collection } = require('discord.js');

// Externals
const Currency = require('./Currency');

module.exports = class BoebotClient extends Client {

	constructor(options) {
		super(options);

		this.queue = new Collection();

		this.currency = null;

		this.once('ready', this.setup.bind(this));
	}

	async login(token) {
		return super.login(token);
	}

	async setup() {
		this.currency = new Currency(this);
	}

};
