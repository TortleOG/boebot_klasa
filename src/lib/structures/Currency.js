module.exports = class Currency {

	constructor(client) {
		Object.defineProperty(this, 'client', { value: client });

		this.table = 'currency';

		this.init();
	}

	async init() {
		if (!(await this.provider.hasTable(this.table))) await this.provider.createTable(this.table);
	}

	async changeBalance(user, amount) {
		if (typeof amount !== 'number') throw "Expected parameter 'amount' to be type 'number'.";
		let row = await this.provider.get(this.table, user.id);
		if (!row) row = await this.create(user);
		await this.provider.update(this.table, user.id, { amount: row.amount + amount });
	}

	async getBalance(user) {
		const row = await this.provider.get(this.table, user.id);
		return row ? row.amount : 0;
	}

	async create(user) {
		await this.provider.create(this.table, user.id, { amount: 0 });
		return this.provider.get(this.table, user.id);
	}

	add(user, amount) {
		return this.changeBalance(user, amount);
	}

	remove(user, amount) {
		return this.changeBalance(user, -amount);
	}

	async set(user, amount) {
		if (typeof amount !== 'number') throw "Expected parameter 'amount' to be type 'number'.";
		const row = await this.provider.get(this.table, user.id);
		if (!row) {
			await this.create(user);
			await this.changeBalance(user, amount);
		} else { await this.provider.update(this.table, user.id, { amount }); }
	}

	async reset(user, amount = 0) {
		if (typeof amount !== 'number') throw "Expected parameter 'amount' to be type 'number'.";
		const row = await this.provider.get(this.table, user.id);
		if (!row) await this.create(user.id);
		else await this.provider.update(this.table, user.id, { amount });
	}

	get provider() {
		return this.client.providers.get('rethinkdb');
	}

};
