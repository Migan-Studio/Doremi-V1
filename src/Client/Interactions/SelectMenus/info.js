import SelectMenus from './InfoCategory'
import { CommandInteraction } from 'discord.js'

module.exports = {
  execute(interaction, id) {
    interaction.channel
      .createMessageComponentCollector({
        filter: i => i.user.id === id,
        time: 60000,
      })
      .on('collect', interaction => {
        SelectMenus[interaction.values[0]].execute(interaction)
      })
      .on('end', interaction => {
        interaction.first().editReply({ components: [] })
      })
  },
}
