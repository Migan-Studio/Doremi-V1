import { Command } from '../../Client'
import { Formatters, MessageEmbed } from 'discord.js'

module.exports = class extends Command {
  constructor() {
    super()
    this.name = '도움말'
    this.description = 'Doremi의 도움말입니다.'
  }

  execute(interaction) {
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`${interaction.client.user.username} 도움말`)
          .setDescription(
            Formatters.codeBlock(
              'md',
              `# 정보
- 도움말

# mod
- 추방
- 밴
- 청소`
            )
          ),
      ],
    })
  }
}
