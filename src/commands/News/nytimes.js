const { Command } = require('klasa');
const { get: fetch } = require('snekfetch');

const { API_KEYS: { NYTIMES } } = require('../../../settings.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text', 'dm', 'group'],
			cooldown: 5,
			aliases: ['nyt'],
			botPerms: ['EMBED_LINKS'],
			description: 'Grabs different news articles from the New York Times API.',
			usage: '[sources|sections] [input:str]',
			extendedHelp: [
				'The default prefix is `b!`. If the guild owner has changed the prefix, you will have to substitute `b!` for the guilds prefix.',
				'\n= Example Usage =',
				'b!nytimes [type], [parameters], [result-number]',
				'		or',
				'b!nyt top stories, home, 10',
				'\n= Types =',
				'There are 3 request types:\n  1. top stories\n  2. newswire\n  3. reviews',
				'\n= Top Stories =',
				'There is only 1 parameter for a top story request: a section of the New York Times. To view all sections, type `b!nyt sections`.',
				'\n= Newswire =',
				'There are 2 parameters for newswire. A source and a section. To view sources, type `b!nyt sources`. An example command would be `b!nyt newswire, all all`.',
				'\n= Reviews =',
				'The only parameter for reviews is the name of a movie. For example, `b!nyt reviews, the emoji movie`.'

			].join('\n')
		});

		this.matchRegex = /([^,])+/gi;
		this.replaceRegex = /\s*,\s*/g;

		this.baseURL = 'https://api.nytimes.com/svc';

		this.sections = [
			'home', 'opinion', 'world', 'national', 'politics', 'upshot', 'nyregion', 'business', 'technology', 'science',
			'health', 'sports', 'arts', 'books', 'movies', 'theater', 'sundayreview', 'fashion', 'tmagazine', 'food',
			'travel', 'magazine', 'realestate', 'automobiles', 'obituaries', 'insider', 'all'
		];

		this.sources = ['all', 'nyt', 'iht'];

		this.page = null;

		this.info = null;
	}

	async run(msg, [flag, input]) {
		if (flag === 'sources') return msg.send(`🗒 | Valid source types are: ${'```'}${this.sources.join(' | ')}${'```'}`);
		else if (flag === 'sections') return msg.send(`🗒 | Valid section types are: ${'```'}${this.sections.join(' | ')}${'```'}`);

		if (!input) {
			this.page = 0;
			await this.request(`${this.baseURL}/news/v3/content/all/all.json`, `limit=1`);
			return msg.send({ embed: this.embed });
		}

		input = input.replace(this.replaceRegex, ',').match(this.matchRegex);

		this.page = parseInt(input[2]) - 1 || 0;

		if (input[0] === 'top stories') {
			if (!this.sections.includes(input[1] || 'home'))	throw `❌ | ${msg.author}, you did not select a valid section.`;

			await this.request(`${this.baseURL}/topstories/v2/${input[1] || 'home'}.json`);
		} else if (input[0] === 'newswire') {
			const [source = 'all', section = 'all'] = input[1] !== undefined ? input[1].split(/\s+/) : [];

			if (!this.sources.includes(source))	throw `❌ | ${msg.author}, you did not select a valid source.`;
			else if (!this.sections.includes(section))	throw `❌ | ${msg.author}, you did not select a valid section.`;

			await this.request(`${this.baseURL}/news/v3/content/${source}/${section}.json`, 'limit=10');
		} else if (input[0] === 'reviews') {
			await this.request(`${this.baseURL}/movies/v2/reviews/search.json`, `query=${encodeURIComponent(input[1] || '')}`);
		} else {
			throw `❌ | ${msg.author}, you did not select a valid request type.`;
		}

		return msg.send({ embed: this.embed });
	}

	async request(url, param = '') {
		const { body: { results } } = await fetch(`${url}?api-key=${NYTIMES}${param.length > 0 ? `&${param}` : ''}`);

		this.info = results.length > 0 && this.page + 1 <= results.length ? {
			title: results[this.page].title || results[this.page].headline,
			short: results[this.page].abstract || results[this.page].summary_short,
			url: results[this.page].url,
			link: results[this.page].link ? {
				text: results[this.page].link.suggested_link_text,
				url: results[this.page].link.url
			} : null,
			criticsPick: results[this.page].critics_pick,
			page: this.page,
			pages: results.length
		} : { noRes: true };
	}

	get embed() {
		const embed = this.info.noRes === undefined ?
			new this.client.methods.Embed()
				.setAuthor('New York Times')
				.setDescription([
					`**__${this.info.title}__**`,
					`${this.info.short}${this.info.link !== null ? `\n**Critics Pick**: ${this.info.criticsPick === 1 ? 'Yes' : 'No'}` : ''}`,
					`[${this.info.link === null ? 'Read More' : this.info.link.text}](${this.info.url || this.info.link.url})`
				].join('\n'))
				.setFooter(`Result ${this.info.page + 1} / ${this.info.pages}`)
				.setTimestamp() :
			new this.client.methods.Embed()
				.setAuthor('New York Times')
				.setDescription('**No Results Found.**')
				.setFooter('No Results')
				.setTimestamp();

		return embed;
	}

};
