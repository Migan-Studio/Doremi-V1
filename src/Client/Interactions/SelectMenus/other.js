import { MessageEmbed } from 'discord.js'

module.exports = {
  execute(interaction, content) {
    interaction.client.SendDMWithDeveloperForEmbed(
      new MessageEmbed()
        .setAuthor({
          name: `문의 발신자: ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTitle('지원')
        .setDescription(`기타 카테고리 \`${content}\``)
        .setTimestamp()
    )
    interaction.update({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTitle('지원')
          .setDescription('문의가 성공적으로 갔어요!'),
      ],
      components: [],
    })
  },
}
