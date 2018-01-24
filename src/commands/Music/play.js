const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			description: 'Starts to play the first song in the queue.'
		});
	}

	delayer(time) {
		return new Promise(res => setTimeout(() => res(), time));
	}

	async run(msg) {
		const musicInterface = msg.guild.music;

		if (musicInterface.queue.length === 0) return msg.send(`❌ | ${msg.author}, add some songs to the queue first with ${msg.guild.configs.prefix}add.`);

		if (!musicInterface.dispatcher || !musicInterface.voiceChannel) await this.client.commands.get('join').run(msg);

		if (musicInterface.status === 'paused') await this.client.commands.get('resume').run(msg);
		else if (musicInterface.status === 'playing') return msg.send(`❌ | ${msg.author}, the stream is already playing.`);

		musicInterface.status = 'playing';
		musicInterface.channel = msg.channel;

		return this.play(musicInterface);
	}

	async play(musicInterface) {
		if (musicInterface.status !== 'playing') return null;

		const song = musicInterface.queue[0];

		if (!song) {
			if (musicInterface.autoplay) return this.autoPlayer(musicInterface).then(() => this.play(musicInterface));
			return musicInterface.channel.send('⏹ | Queue is empty.').then(() => musicInterface.destroy());
		}

		await musicInterface.channel.send(`🎧 | Playing: **${song.title}** as requested by: **${song.requester}**`);
		await this.delayer(300);

		return musicInterface.play()
			.then(
				(dispatcher) => dispatcher.on('end', () => {
					musicInterface.skip();
					this.play(musicInterface);
				}).on('error', (err) => {
					musicInterface.channel.send('❌ | It seems like an error has occured! Sorry for the incovenience.');
					musicInterface.client.emit('log', err, 'error');
					musicInterface.skip();
					this.play(musicInterface);
				})
			);
	}

	autoPlayer(musicInterface) {
		return musicInterface.add('YouTube AutoPlay', musicInterface.next);
	}

};
