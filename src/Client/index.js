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
import { Koreanbots } from 'koreanbots'

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
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MEMBERS,
      ],
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
    let id
    this.login(process.env.TOKEN)
    this.on('ready', () => {
      console.log(`[Client] Bot Name ${this.user.username}`)
      console.log(`[Client] Version ${require('../../package.json').version}`)
      console.log('-------------------------')
      this.user.setActivity({ name: '/도움말', type: 'LISTENING' })
      if (!process.env.KRBOTS_TOKEN) {
        console.error('Koreanbots TOKEN is Null')
      } else {
        const KRBots = new Koreanbots({
          api: {
            token: process.env.KRBOTS_TOKEN,
          },
          clientID: this.user.id,
        })

        KRBots.mybot
          .update({
            servers: this.guilds.cache.size,
          })
          .then(res =>
            console.log(
              `서버 수 업데이트 완료\n 반환된 정보: ${JSON.stringify(res)}`
            )
          )
          .catch(console.error)
        setInterval(() =>
          KRBots.mybot
            .update({
              servers: this.guilds.cache.size,
            })
            .then(res =>
              console.log(
                `서버 수 업데이트 완료\n 반환된 정보: ${JSON.stringify(res)}`
              )
            ).catch(console.error)
        )
      }
    })

    process.on('uncaughtException', console.error)
    this._loadCommands()
    this.on('messageCreate', msg => {
      if (msg.author.bot) return
      if (msg.channel.type === 'DM') {
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
      }
    })
    this.on('interactionCreate', interaction => {
      if (interaction.isCommand()) {
        const Command = this._commands.get(interaction.commandName)

        id = interaction.user.id

        if (!Command) return

        Command.execute(interaction)
      } else if (interaction.isSelectMenu()) {
        if (interaction.customId.startsWith('Doremi-select$support')) {
          SelectMenus[interaction.customId].execute(interaction, SupportContent)
        } else {
          SelectMenus[interaction.customId].execute(interaction, id)
        }
      }
    })
  }
}
