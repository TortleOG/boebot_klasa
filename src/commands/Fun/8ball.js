const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text', 'dm', 'group'],
			cooldown: 5,
			aliases: ['8', 'magic8'],
			description: 'Ask me a question, and I will give you an answer like the famous 8ball!',
			usage: '<query:str>'
		});

		this.answers = [
			'Maybe.', 'I hope so.', 'There is a good chance.', 'Quite likely.', 'I think so.',
			'I hope so.', 'Hell, yes.', 'Possibly.', 'There is a small chance.', 'Yes!',
			'As I see it, yes.', 'It is certain.', 'It is decidedly so.', 'Certainly not.', 'Not in your wildest dreams.',
			'I hope not.', 'Never!', 'Fuhgeddaboudit.', 'Ahaha! Really?!?', 'Pfft.',
			'Sorry, bucko.', 'Hell to the no.', 'The future is bleak.', 'The future is uncertain.', 'I would rather not say.',
			'Who cares?', 'Never, ever, ever.', 'Don’t count on it.', 'My reply is no.', 'My sources say no.',
			'Very doubtful.', 'That was dumb.', 'Is math hard for you?', "Stand up and I'll bop you."
		];
	}

	async run(msg, [query]) {
		if (query.indexOf('?') !== -1) return msg.send(`**Magic 🎱 says**:${'```'}${this.answers[Math.floor(Math.random() * this.answers.length)]}${'```'}`);
		throw "**Magic 🎱 says**: That doesn't look like a question, try again please.";
	}

};
