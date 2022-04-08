import { MessageEmbed, Permissions } from 'discord.js'
import { Command } from '../../Client'

module.exports = class extends Command {
  constructor() {
    super()
    this.name = '청소'
    this.description = '[메세지 관리하기 권한 필요] Doremi의 청소 명령어입니다.'
    this.options = [
      {
        type: 'NUMBER',
        name: '갯수',
        description: '갯수',
        required: true,
        minValue: 1,
        maxValue: 100,
      },
    ]
  }

  execute(interaction) {
    if (interaction.channel.type === 'DM')
      return interaction.reply({
        content: '해당 명령어는 DM에서 사용하실 수 없어요 :<',
        ephemeral: true,
      })
    if (
      !interaction.guild.members.cache
        .get(interaction.user.id)
        .permissions.has(
          Permissions.FLAGS.MANAGE_MESSAGES || Permissions.FLAGS.ADMINISTRATOR
        )
    )
      return interaction.reply({
        content:
          '당신에게 `메세지 관리하기` 권한이 없어서 명령어를 실행할 수 없어요 :<',
        ephemeral: true,
      })
    if (
      !interaction.guild.me.permissions.has(
        Permissions.FLAGS.MANAGE_MESSAGES || Permissions.FLAGS.ADMINISTRATOR
      )
    )
      return interaction.reply({
        content:
          '저에게 `메세지 관리하기` 권한이 없어서 해당 명령어를 실행할 수 없어요 :<',
        ephemeral: true,
      })
    interaction.channel?.messages
      .fetch({
        limit: interaction.options.getNumber('갯수'),
      })
      .then(messages => {
        interaction.guild?.channels.fetch(interaction.channelId).then(a => {
          a.bulkDelete(messages, true)
          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setTitle('청소')
                .setDescription(
                  `${interaction.options.getNumber(
                    'limit'
                  )} 개의 채팅이 삭제되었습니다.`
                ),
            ],
            ephemeral: true,
          })
        })
      })
      .catch(error => console.log(error))
  }
}
