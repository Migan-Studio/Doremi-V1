import { MessageEmbed } from 'discord.js'
import { Command } from '../../Client'

module.exports = class extends Command {
  constructor() {
    super()
    this.name = '문의답장'
    this.description = '[개발자 전용] 문의 답장'
    this.options = [
      {
        type: 'STRING',
        name: 'id',
        description: '문의 답장할 유저의 ID',
        required: true,
      },
      {
        type: 'STRING',
        name: '내용',
        description: '답장 내용',
        required: true,
      },
    ]
  }
  execute(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID)
      return interaction.reply({
        content: '해당 명령어는 개발자 전용 명령어입니다.',
        ephemeral: true,
      })
    const ReplyMember = interaction.client.users.cache.get(
      interaction.options.getString('id')
    )

    ReplyMember.send({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: `답변자: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTitle('문의 답장 내용')
          .setDescription(
            `문의 내용에 대해 답장이 왔어요.\n답장 내용: \`${interaction.options.getString(
              '내용'
            )}\``
          )
          .setTimestamp(),
      ],
    })
    interaction.reply({
      content: '문의 내용이 성공적으로 갔어요. :)',
      ephemeral: true,
    })
  }
}
