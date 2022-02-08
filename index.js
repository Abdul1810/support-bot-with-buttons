//Discord Client
const { Client } = require('discord.js')
const client = new Client()

//Passing Client in disbut
const disbut = require('discord-buttons')
const { MessageButton, MessageActionRow } = require('discord-buttons')
disbut(client)

//Loading Config
const config = require('./config.json')
console.log('Config Loaded')
var owners = config.owners

//Ready Event
client.on('ready', () => {
	console.log(`${client.user.tag} is Ready!`)
	client.user.setPresence({
		status: "online",
		activity: {
			name: config.status,
			type: "LISTENING",
		}
	})
})

/**
 * @author Abdul$5464 <https://github.com/Abdul1810/>
 */

//Message Event only Listen to owners so make sure to fill the owner array in config
client.on('message', async (msg) => {
	if (msg.author.bot) return
	if (msg.channel.type === "dm") return
	if (!owners.includes(msg.author.id)) return
	if (msg.content !== `${config.prefix}create`) return
	if (msg.content = `${config.prefix}create`) {
		await msg.delete().catch(() => {})
		let button1 = new MessageButton()
    		.setStyle("grey")
    		.setEmoji("1️⃣")
    		.setID("button_one")
		
		let button2 = new MessageButton()
			.setEmoji("2️⃣")
    		.setStyle("grey")
			.setID("button_two")
			
		let button3 = new MessageButton()
			.setEmoji("3️⃣")
    		.setStyle("grey")
			.setID("button_three")
		
		let button4 = new MessageButton()
			.setEmoji("4️⃣")
    		.setStyle("grey")
			.setID("button_four")

		//If You Don't Need 5th Button Remove The 4 Lines Below and Remove Line 67 
		let button5 = new MessageButton()
			.setEmoji("5️⃣")
    		.setStyle("grey")
			.setID("button_five")

		let button6 = new MessageButton()
			.setLabel("None Of The Above")
    		.setStyle("green")
    		//.setEmoji("🤷🏻‍♂️")
    		.setID("none_of_the_above")
		
		let buttonRow = new MessageActionRow()
			.addComponent(button1)
			.addComponent(button2)
			.addComponent(button3)
			.addComponent(button4)
			.addComponent(button5)
		
		let buttonRow2 = new MessageActionRow()
			.addComponent(button6)
		
		const supportembed = {
			author: { name: config.embed_content.title, icon_url: client.user.displayAvatarURL({ size: 2048, dynamic: false, format:"png"}) },
			timestamp: new Date(),
			color: `0x${config.embed_content.color}`,
			thumbnail: { url: config.thumbnail ? config.thumbnail_url : client.user.displayAvatarURL({ size: 2048, format: "png", dynamic: false}) },
			description: `\u200b\n1️⃣ ${config.embed_content.question_1}\n\u200b\n2️⃣ ${config.embed_content.question_2}\n\u200b\n3️⃣ ${config.embed_content.question_3}\n\u200b\n4️⃣ ${config.embed_content.question_4}\n\u200b\n5️⃣ ${config.embed_content.question_5}\n\u200b\n> **None Of The Above**\nIf Your Question is not in the Above List.(Further Assistance)\n\u200b\n`,
			footer:{
				text: msg.guild.name
			}
		}
		return msg.channel.send('', {
			components: [buttonRow, buttonRow2],
			embed: supportembed
		})
	} else return
})


//onClick Event
client.on('clickButton', async (button) => {
	let responseembed = {
		author:{ name: config.title, icon_url: config.thumbnail ? config.thumbnail_url : client.user.displayAvatarURL({ size: 2048, format: "png", dynamic: false}) },
		color: `0x${config.embed_content.color}`,
		description: null,
		timestamp: new Date(),
		footer:{
			text: button.guild.name
		}
	}
	const logchannel = button.guild.channels.cache.get(config.log_channel_id)
	if (button.id === "button_one") {
		responseembed.description = `\u200b\n**${config.responses.response_1}**\n\u200b\n`
		logchannel.send(`> **${button.clicker.user.username + "#" + button.clicker.user.discriminator}**(${button.clicker.user.id}) Used ${button.id}\nTimeStamp: ${new Date()}`)
		// let invitecutie = new MessageButton()
        //     .setLabel("Invite Link")
        //     .setStyle("url")
        //     .setURL("Link")
		// let buttonRow = new MessageActionRow()
		// 	.addComponent(invitecutie)
		//!If You Want Button in the Response remove // from the the Above 6 lines
		return button.reply.send('',{ embed: responseembed, ephemeral: true })//If you want to send link button add ,component: buttonRow after the ephermeral: true declaration
	}
	if (button.id === "button_two") {
		responseembed.description = `**${config.responses.response_2}**\n\u200b\n`
		logchannel.send(`> **${button.clicker.user.username + "#" + button.clicker.user.discriminator}**(${button.clicker.user.id}) Used ${button.id}\nTimeStamp: ${new Date()}`)
		return button.reply.send('',{ embed: responseembed, ephemeral: true })
	}
	if (button.id === "button_three") {
		responseembed.description = `**${config.responses.response_3}**`
		logchannel.send(`> **${button.clicker.user.username + "#" + button.clicker.user.discriminator}**(${button.clicker.user.id}) Used ${button.id}\nTimeStamp: ${new Date()}`)
		return button.reply.send('',{ embed: responseembed, ephemeral: true })
	}
	if (button.id === "button_four") {
		responseembed.description = `**${config.responses.response_4}**`
		logchannel.send(`> **${button.clicker.user.username + "#" + button.clicker.user.discriminator}**(${button.clicker.user.id}) Used ${button.id}\nTimeStamp: ${new Date()}`)
		return button.reply.send('',{ embed: responseembed, ephemeral: true })
	}
	if (button.id === "button_five") {
		responseembed.description = `**${config.responses.response_5}**`
		logchannel.send(`> **${button.clicker.user.username + "#" + button.clicker.user.discriminator}**(${button.clicker.user.id}) Used ${button.id}\nTimeStamp: ${new Date()}`)
		return button.reply.send('',{ embed: responseembed, ephemeral: true })
	}
	if (button.id === "none_of_the_above") {
		responseembed.description = `**Go to <#${config.assistance_channel_id}> Channel and ask Your Questions.**`
		button.guild.members.cache.get(button.clicker.user.id).roles.add(config.assistance_role_id)
		button.guild.channels.cache.get(config.assistance_channel_id).send(`<@${button.clicker.user.id}> Here you can Ask your Further Questions.`)
		logchannel.send(`> **${button.clicker.user.username + "#" + button.clicker.user.discriminator}**(${button.clicker.user.id}) Used ${button.id}\nTimeStamp: ${new Date()}`)
		return button.reply.send('',{ embed: responseembed, ephemeral: true })
	}
})

//Bot Coded By Abdul#5464
//For Support Join Support Server https://discord.gg/sAMznQK2NG
//For Feature Request Open a PR

client.login(config.token).catch(() => console.log('Invalid Token.Make Sure To Fill config.json'))
