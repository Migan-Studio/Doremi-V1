import { Command } from '../../Client'
import { Formatters, MessageEmbed } from 'discord.js'

module.exports = class extends Command {
  constructor() {
    super()
    this.name = '서버정보'
    this.description = 'Doremi의 서버정보명령어입니다.'
  }
  execute(interaction) {
    function returnServerSecurity() {
      switch (interaction.guild.verificationLevel) {
        case 'HIGH':
          return '높음'
        case 'LOW':
          return '낮음'
        case 'MEDIUM':
          return '중간'
        case 'NONE':
          return '없음'
        case 'VERY_HIGH':
          return '매우 높음'
      }
    }
    if (interaction.channel.type === 'DM')
      return interaction.reply('DM에서는 해당 명령어를 쓸 수 없습니다.')
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTitle(`${interaction.guild.name}의 서버 정보`)
          .setThumbnail(interaction.guild.iconURL())
          .setDescription(
            Formatters.codeBlock(
              'md',
              `# 서버의 이름
${interaction.guild.name}
# 서버의 주인
${interaction.guild.members.cache.get(interaction.guild.ownerId).user.tag} (${
                interaction.guild.ownerId
              })
# 서버의 부스트 개수
${interaction.guild.premiumSubscriptionCount}
# 서버의 보안
${returnServerSecurity()}
# 서버의 멤버수 (봇 포함)
${interaction.guild.memberCount}
# 서버의 이모티콘 개수
${interaction.guild.emojis.cache.size}
# 서버의 스티커 개수
${interaction.guild.stickers.cache.size}`
            )
          )
          .addFields([
            {
              name: '서버의 생성일',
              value: `${Formatters.time(
                Math.floor(interaction.guild.createdTimestamp / 1000)
              )} (${Formatters.time(
                Math.floor(interaction.guild.createdTimestamp / 1000),
                'R'
              )})`,
            },
          ]),
      ],
    })
  }
}
