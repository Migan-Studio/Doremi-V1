import {
  Client,
  Collection,
  Intents,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
} from 'discord.js'
import { readdirSync } from 'fs'
import path from 'path'
import { config } from 'dotenv'
import SelectMenus from './Interactions/SelectMenus'

export class Command {
  constructor() {
    this.name = ''
    this.description = ''
    this.defaultPermission = undefined
    this.type = 'CHAT_INPUT'
    this.options = []
  }

  execute(interaction) {}
}

export class mbprClient extends Client {
  constructor() {
    super({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES],
      partials: ['CHANNEL'],
    })
    this._commands = new Collection()
    this._commandDirectory = path.join(__dirname, '..', 'Commands')
  }

  /**
   * @private
   */
  _loadCommands() {
    const Directory = readdirSync(path.join(this._commandDirectory))
    for (const Folder of Directory) {
      const Dir2 = readdirSync(`${this._commandDirectory}/${Folder}`)
      for (const File of Dir2) {
        const Temp = require(`${this._commandDirectory}/${Folder}/${File}`)
        const modules = new Temp()
        this._commands.set(modules.name, modules)
        this.once('ready', () => {
          this.application?.commands.create({
            name: modules.name,
            description: modules.description,
            type: modules.type,
            options: modules.options,
            defaultPermission: modules.defaultPermission,
          })
        })
      }
    }
  }

  SendDMWithDeveloperForEmbed(embed) {
    this.users.cache.get(process.env.OWNER_ID).send({
      embeds: [embed],
    })
  }

  start() {
    config()
    let SupportContent
    this.login(process.env.TOKEN)
    this.on('ready', () => {
      console.log(`[Client] ${this.user.username}`)
      console.log('-------------------------')
    })
    process.on('uncaughtException', console.error)
    this._loadCommands()
    this.on('messageCreate', msg => {
      if (msg.author.bot || msg.channel.type !== 'DM') return
      SupportContent = msg.content
      msg.reply({
        embeds: [
          new MessageEmbed()
            .setAuthor({
              name: msg.author.tag,
              iconURL: msg.author.displayAvatarURL(),
            })
            .setTitle('지원')
            .setDescription('어느 항목으로 지원을 하실껀까요?'),
        ],
        components: [
          new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId('Doremi-select$support')
              .setOptions(
                {
                  label: '버그',
                  description:
                    'Doremi를 사용하면서 발생한 버그에 대해 문의하실 수 있어요.',
                  value: 'Doremi-support$bug',
                },
                {
                  label: '건의',
                  description:
                    'Doremi를 사용하면서 불편했던 점이나 추가 되면 좋을 꺼 같은 기능을 문의하실 수 있어요.',
                  value: 'Doremi-support$suggestion',
                },
                {
                  label: '기타',
                  description:
                    'Doremi를 사용하면서 궁금 했던 점을 문의하실 수 있어요.',
                  value: 'Doremi-support$other',
                }
              )
          ),
        ],
      })
    })
    this.on('interactionCreate', interaction => {
      if (interaction.isCommand()) {
        const Command = this._commands.get(interaction.commandName)

        if (!Command) return

        Command.execute(interaction)
      } else if (interaction.isSelectMenu()) {
        SelectMenus[interaction.values[0]].execute(interaction, SupportContent)
      }
    })
  }
}
