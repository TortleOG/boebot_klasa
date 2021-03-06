const { Command } = require('klasa');
const { showSeconds } = require('../../lib/Utils');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			description: 'Check the queue.'
		});
	}

	async run(msg) {
		const { next, queue, autoplay } = msg.guild.music;
		const output = [];

		if (queue.length === 0) throw `❌ | ${msg.author}, there are no songs currently in the queue.`;

		for (let i = 0; i < Math.min(queue.length, 10); i++) {
			output[i] = [
				`[__\`${String(i + 1).padStart(2, 0)}\`__] *${queue[i].title.replace(/\*/g, '\\*')}* requested by **${queue[i].requester.tag || queue[i].requester}**`,
				`   └── <${queue[i].url}> (${showSeconds(queue[i].seconds * 1000)})`
			].join('\n');
		}

		if (queue.length > 10) output.push(`\nShowing 10 songs of ${queue.length}`);
		else if (autoplay) output.push(`\n**AutoPlay**: <${next}>`);

		return msg.send(output.join('\n'));
	}

};
