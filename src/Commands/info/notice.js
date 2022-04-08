import { MessageEmbed } from 'discord.js'
import { Command } from '../../Client'

module.exports = class extends Command {
  constructor() {
    super()
    this.name = '공지'
    this.description = '[개발자 전용] Doremi의 공지커맨드.'
    this.options = [
      {
        type: 'STRING',
        name: '내용',
        description: '공지 내용',
        required: true,
      },
    ]
  }
  execute(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID)
      return interaction.reply({
        content: '이 명령어는 봇 개발자 전용이에요',
        ephemeral: true,
      })
    interaction.client.channels.cache.forEach(channel => {
      const textChannel = channel
      if (textChannel.type !== 'GUILD_TEXT') return
      if (
        textChannel.topic?.includes(`${interaction.client.user?.username}-공지`)
      ) {
        textChannel.send({
          embeds: [
            new MessageEmbed()
              .setTitle('공지')
              .setDescription(interaction.options.getString('내용'))
              .setTimestamp(Date.now())
              .setAuthor({
                name: `공지 작성자: ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL(),
              }),
          ],
        })
      } else if (
        !textChannel.topic?.includes(
          `${interaction.client.user?.username}-공지`
        )
      )
        return
    })
    interaction.reply({
      content: `성공적으로 ${interaction.options.getString(
        '내용'
      )}을/를 발송했어요 :\)`,
      ephemeral: true,
    })
  }
}
