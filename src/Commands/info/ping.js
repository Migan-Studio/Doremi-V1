import { Command } from '../../Client'
import { Formatters, MessageEmbed } from 'discord.js'

module.exports = class extends Command {
  constructor() {
    super()
    this.name = '핑'
    this.description = 'Doremi의 지연시간'
  }
  execute(interaction) {
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTitle(`${interaction.client.user.username}의 지연시간`)
          .setDescription(
            Formatters.codeBlock('md', `${interaction.client.ws.ping}ms`)
          ),
      ],
    })
  }
}
