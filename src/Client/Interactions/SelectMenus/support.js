import SelectMenus from './SupportCategory'

module.exports = {
  execute(interaction, content) {
    SelectMenus[interaction.values[0]].execute(interaction, content)
  },
}
