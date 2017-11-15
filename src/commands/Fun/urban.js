const { Command } = require('klasa');
const { get: fetch } = require('snekfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text', 'dm', 'group'],
			cooldown: 5,
			permLevel: 0,
			description: 'Searches Urban Dictionary for the definition of a word.',
			usage: '<search:str> [result:int]',
			usageDelim: ', '
		});
	}

	async run(msg, [search, res = 0]) {
		res = res > 1 ? res - 1 : res;

		const { body: { list } } = await fetch(`http://api.urbandictionary.com/v0/define?term=${search}`);
		const result = list[res];

		if (!result) throw `❌ | ${msg.author}, no result found.`;

		const wdef = result.definition.length > 1000 ? `${this.splitText(result.definition, 1000)}...` : result.definition;
		const definition = [
			`**Word:** ${search}`,
			'',
			`**Definition:** ${res += 1} out of ${list.length}\n_${wdef}_`,
			'',
			`**Example:**\n${result.example}`,
			`<${result.permalink}>`
		].join('\n');

		return msg.send(definition);
	}

	splitText(string, length, endBy = ' ') {
		const x0 = string.substring(0, length).lastIndexOf(endBy);
		const pos = x0 === -1 ? length : x0;
		return string.substring(0, pos);
	}

};
