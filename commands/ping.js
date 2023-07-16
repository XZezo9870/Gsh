const Discord = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'Ping command',
  execute(message, args) {
    let start = Date.now();

    message.channel.send({ content: 'Pinging...' }).then(m => {

      let end = Date.now();

      let embed = new Discord.MessageEmbed()
        .setAuthor({ name: 'Ping!', iconURL: message.author.avatarURL() })
        .addFields(
    { name: 'API Latency', value: `\`\`\`${Math.round(message.client.ws.ping)}ms\`\`\`` },
    { name: 'Message Latency', value: `\`\`\`${end - start}ms\`\`\``, inline: true }
  )
        .setColor("RANDOM");
      m.edit({ content: null, embeds: [embed] }).catch(e => message.channel.send(e));
    });
  },
};
