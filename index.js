//Discord Client
const {
	Client,
	Events,
	GatewayIntentBits,
	ActivityType,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	InteractionContextType,
	MessageFlags,
} = require('discord.js')
//MessageContent is a Privileged Intent, enable it in the Developer Portal for the prefix command to work
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] })

//Loading Config
const config = require('./config.json')
console.log('Config Loaded')
var owners = config.owners
const embedColor = parseInt(config.embed_content.color, 16) || 0

//Ready Event
client.once(Events.ClientReady, async () => {
	console.log(`${client.user.tag} is Ready!`)

	client.user.setPresence({
		status: "online",
		activities: [{
			name: config.status,
			type: ActivityType.Listening,
		}]
	})

	//Registering Slash
	if (config.enable_slash) {
		const commands = [{
			name: 'create',
			description: 'Replies with Help Embed!',
			contexts: [InteractionContextType.Guild],
		}]

		try {
			console.log('Started refreshing application (/) commands.')

			await client.application.commands.set(commands)

			console.log('Successfully reloaded application (/) commands.')
		}
		catch (error) {
			console.error(error)
		}
	}
})

/**
 * @author Abdul$5464 <https://github.com/Abdul1810/>
 */

const thumbnailUrl = () => config.embed_content.thumbnail ? config.embed_content.thumbnail_url : client.user.displayAvatarURL({ size: 2048, extension: "png", forceStatic: true })

//Builds the Support Embed with its Buttons
function createSupportMessage(guild) {
	const supportEmbed = new EmbedBuilder()
		.setAuthor({ name: config.embed_content.title, iconURL: client.user.displayAvatarURL({ size: 2048, extension: "png", forceStatic: true }) })
		.setTimestamp()
		.setColor(embedColor)
		.setThumbnail(thumbnailUrl())
		.setDescription(`​\n1️⃣ ${config.embed_content.question_1}\n​\n2️⃣ ${config.embed_content.question_2}\n​\n3️⃣ ${config.embed_content.question_3}\n​\n4️⃣ ${config.embed_content.question_4}\n​\n5️⃣ ${config.embed_content.question_5}\n​\n> **None Of The Above**\nIf Your Question is not in the Above List.(Further Assistance)\n​\n`)
		.setFooter({ text: guild.name })

	let button1 = new ButtonBuilder()
		.setStyle(ButtonStyle.Secondary)
		.setEmoji("1️⃣")
		.setCustomId("button_one")

	let button2 = new ButtonBuilder()
		.setEmoji("2️⃣")
		.setStyle(ButtonStyle.Secondary)
		.setCustomId("button_two")

	let button3 = new ButtonBuilder()
		.setEmoji("3️⃣")
		.setStyle(ButtonStyle.Secondary)
		.setCustomId("button_three")

	let button4 = new ButtonBuilder()
		.setEmoji("4️⃣")
		.setStyle(ButtonStyle.Secondary)
		.setCustomId("button_four")

	//If You Don't Need 5th Button Remove The 4 Lines Below and Remove button5 from buttonRow1
	let button5 = new ButtonBuilder()
		.setEmoji("5️⃣")
		.setStyle(ButtonStyle.Secondary)
		.setCustomId("button_five")

	let button6 = new ButtonBuilder()
		.setLabel("None Of The Above")
		.setStyle(ButtonStyle.Success)
		//.setEmoji("🤷🏻‍♂️")
		.setCustomId("none_of_the_above")

	let buttonRow1 = new ActionRowBuilder()
		.addComponents(button1, button2, button3, button4, button5)

	let buttonRow2 = new ActionRowBuilder()
		.addComponents(button6)

	return { embeds: [supportEmbed], components: [buttonRow1, buttonRow2] }
}

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.inGuild()) return

	if (interaction.isChatInputCommand()) {
		if (!owners.includes(interaction.user.id)) {
			return interaction.reply({ content: "You aren\'t Authorized To use This Command!", flags: MessageFlags.Ephemeral })
		}

		await interaction.reply(createSupportMessage(interaction.guild))
	}
	else if (interaction.isButton()) {
		let responseembed = new EmbedBuilder()
			.setAuthor({ name: config.embed_content.title, iconURL: thumbnailUrl() })
			.setColor(embedColor)
			.setTimestamp()
			.setFooter({ text: interaction.guild.name })

		const logchannel = interaction.guild.channels.cache.get(config.log_channel_id)
		const log = () => logchannel?.send(`> **${interaction.user.tag}**(${interaction.user.id}) Used ${interaction.customId}\nTimeStamp: ${new Date()}`).catch(console.error)

		if (interaction.customId === "button_one") {
			responseembed.setDescription(`​\n**${config.responses.response_1}**\n​\n`)
			log()
			// let invitecutie = new ButtonBuilder()
			//     .setLabel("Invite Link")
			//     .setStyle(ButtonStyle.Link)
			//     .setURL("Link")
			// let buttonRow = new ActionRowBuilder()
			// 	.addComponents(invitecutie)
			//!If You Want Button in the Response remove // from the the Above 6 lines
			return interaction.reply({ embeds: [responseembed], flags: MessageFlags.Ephemeral })//If you want to send link button add ,components: [buttonRow] after the flags declaration
		}
		if (interaction.customId === "button_two") {
			responseembed.setDescription(`**${config.responses.response_2}**\n​\n`)
			log()
			return interaction.reply({ embeds: [responseembed], flags: MessageFlags.Ephemeral })
		}
		if (interaction.customId === "button_three") {
			responseembed.setDescription(`**${config.responses.response_3}**`)
			log()
			return interaction.reply({ embeds: [responseembed], flags: MessageFlags.Ephemeral })
		}
		if (interaction.customId === "button_four") {
			responseembed.setDescription(`**${config.responses.response_4}**`)
			log()
			return interaction.reply({ embeds: [responseembed], flags: MessageFlags.Ephemeral })
		}
		if (interaction.customId === "button_five") {
			responseembed.setDescription(`**${config.responses.response_5}**`)
			log()
			return interaction.reply({ embeds: [responseembed], flags: MessageFlags.Ephemeral })
		}
		if (interaction.customId === "none_of_the_above") {
			responseembed.setDescription(`**Go to <#${config.assistance_channel_id}> Channel and ask Your Questions.**`)
			interaction.member.roles.add(config.assistance_role_id).catch(console.error)
			interaction.guild.channels.cache.get(config.assistance_channel_id)?.send(`<@${interaction.user.id}> Here you can Ask your Further Questions.`).catch(console.error)
			log()
			return interaction.reply({ embeds: [responseembed], flags: MessageFlags.Ephemeral })
		}
	}
})

//Message Event only Listen to owners so make sure to fill the owner array in config
client.on(Events.MessageCreate, async (msg) => {
	if (msg.author.bot) return
	if (!msg.inGuild()) return
	if (!owners.includes(msg.author.id)) return
	if (msg.content !== `${config.prefix}create`) return

	await msg.delete().catch(() => {})
	return msg.channel.send(createSupportMessage(msg.guild))
})

//Bot Coded By Abdul#5464
//For Support Join Support Server https://discord.gg/sAMznQK2NG
//For Feature Request Open a Pull Request

client.login(config.token).catch(() => console.log('Invalid Token.Make Sure To Fill config.json'))
