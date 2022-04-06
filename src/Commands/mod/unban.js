import { MessageEmbed, Permissions } from 'discord.js'
import { Command } from '../../Client'

module.exports = class extends Command {
  constructor() {
    super()
    this.name = '차단해제'
    this.description = 'Doremi의 차단해제명령어입니다'
    this.options = [
      {
        type: 'STRING',
        name: '아이디',
        description: '차단해제할 멤버의 아이디',
        required: true,
      },
    ]
  }
  execute(interaction) {
    if (
      !interaction.guild.members.cache
        .get(interaction.user.id)
        .permissions.has(Permissions.FLAGS.BAN_MEMBERS)
    )
      return interaction.reply({
        content:
          '당신에게 `멤버 차단하기` 권한이 없어서 명령어를 실행할 수 없어요 :<',
        ephemeral: true,
      })
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
      return interaction.reply({
        content:
          '저에게 `멤버 차단하기` 권한이 없어서 명령어를 실행할 수 없어요 :<',
        ephemeral: true,
      })
    if (isNaN(interaction.options.getString('아이디')))
      return interaction.reply({
        content: '아이디를 입력해 주세요 :<',
        ephemeral: true,
      })
    interaction.guild.members
      .unban(interaction.options.getString('아이디'))
      .then(() => {
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setAuthor({
                name: `관리자 ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setTitle('차단해제')
              .setDescription('해당 멤버를 차단해제 했습니다.')
              .setTimestamp(),
          ],
        })
      })
      .catch(error => {
        interaction.reply({
          content: '해당 멤버를 차단해제할 수 없어요 :<',
          ephemeral: true,
        })
        console.log(error)
      })
  }
}
