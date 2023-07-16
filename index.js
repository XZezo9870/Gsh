const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Discord.Collection();

client.on('ready', () => {
  console.log(`Bot is ready and connected as ${client.user.tag}`);
  client.user.setPresence({ activities: [{ name: `Zeus Bot | !help | ${client.guilds.cache.size} servers`, type: 'WATCHING' }], status: 'dnd' });
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
    command.execute(message, args, client, prefix);
  } catch (error) {
    console.error(error);
    message.reply('Terjadi kesalahan saat menjalankan perintah.');
  }
});

client.login(token);
