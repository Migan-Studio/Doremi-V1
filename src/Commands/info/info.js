import {
  Formatters,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
} from 'discord.js'
import { Command } from '../../Client'
import os from 'os'

module.exports = class extends Command {
  constructor() {
    super()
    this.name = '정보'
    this.description = 'Doremi의 정보명령어입니다.'
  }
  execute(interaction) {
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTitle(`${interaction.client.user.username} 정보`)
          .setDescription(
            Formatters.codeBlock(
              'md',
              `# OS 정보
- ${os.platform} ${os.arch}

# 봇 개발자
- ${interaction.client.users.cache.get(process.env.OWNER_ID).tag}

# Node.js 버전
- ${process.version}

# PID
- ${process.pid}

# 서버수
- ${interaction.client.guilds.cache.size}

# 유저수
- ${interaction.client.users.cache.size}`
            )
          ),
      ],
      components: [
        new MessageActionRow().addComponents(
          new MessageSelectMenu().setCustomId('Doremi-select$info').setOptions([
            {
              label: '기본 정보',
              description: 'Doremi의 기본정보',
              value: 'Doremi-info$default',
            },
            {
              label: '모듈 정보',
              description: 'Doremi의 모듈정보',
              value: 'Doremi-info$modules',
            },
          ])
        ),
      ],
    })
  }
}
