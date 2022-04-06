import { MessageEmbed, Formatters } from 'discord.js'

module.exports = {
  execute(interaction) {
    interaction.update({
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
              `# dependencies

## discord.js
- 13.6.0

## dotenv
- 16.0.0

# devDependencies

## @babel/cli
- 7.17.6

## @babel/core
- 7.16.8

## @babel/preset-env
- 7.16.11

## prettier
- 2.6.1`
            )
          ),
      ],
    })
  },
}
