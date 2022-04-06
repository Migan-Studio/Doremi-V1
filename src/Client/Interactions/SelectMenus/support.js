import SelectMenus from './SupportCategory'

module.exports = {
  execute(interaction, content) {
    SelectMenu[interaction.values[0]].execute(interaction, content)
  },
}
