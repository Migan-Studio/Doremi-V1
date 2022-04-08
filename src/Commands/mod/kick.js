import { Command } from '../../Client'
import { MessageEmbed, Permissions } from 'discord.js'

module.exports = class extends Command {
  constructor() {
    super()
    this.name = '추방'
    this.description = '[멤버 추방하기 권한 필요] Doremi의 추방 명령어입니다.'
    this.options = [
      {
        type: 'USER',
        name: '멤버',
        description: '멤버',
        required: true,
      },
      {
        type: 'STRING',
        name: '사유',
        description: '추방 사유',
        required: false,
      },
    ]
  }
  execute(interaction) {
    let member = interaction.options.getMember('멤버')
    if (interaction.channel.type === 'DM')
      return interaction.reply({
        content: '해당 명령어는 DM에서 사용하실 수 없어요 :<',
        ephemeral: true,
      })
    if (
      !interaction.guild.members.cache
        .get(interaction.user.id)
        .permissions.has(Permissions.FLAGS.KICK_MEMBERS)
    )
      return interaction.reply({
        content:
          '당신에게 `멤버 추방하기` 권한이 없어서 명령어를 실행할 수 없어요 :<',
        ephemeral: true,
      })
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
      return interaction.reply({
        content:
          '저에게 `멤버 추방하기` 권한이 없어서 해당 명령어를 실행할 수 없어요 :<',
        ephemeral: true,
      })

    if (!member.kickable)
      return interaction.reply({
        content: '해당 멤버가 없거나 차단할 수가 없어요 :<',
        ephemeral: true,
      })

    try {
      member.kick(interaction.options.getString('사유') || 'None')
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle('Kick')
            .setDescription(`멤버 ${member.user.tag}를 추방했어요.`)
            .setTimestamp(),
        ],
        ephemeral: true,
      })
    } catch (error) {
      console.log(error)
    }
  }
}
