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
            `**참고. 이 봇은 [mbpr](https://github.com/Migan-Studio/mbpr)프로젝트를 기반하여 만들어 졌습니다.**
            ${Formatters.codeBlock(
              'md',
              `# 정보
- 도움말
- 정보
- 핑

# mod
- 추방
- 차단
- 청소
- 차단해제

# 유틸리티
서버정보`

            )}`
          )
          .setThumbnail(interaction.user.displayAvatarURL()),
      ],
    })
  }
}
