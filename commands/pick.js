import { SlashCommandBuilder } from "discord.js";
import Player from '../model/playermodel.js';
import { getEmbed } from "../utils/embed.js";


const playersql = new Player('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
    .setName("addplayer")
    .setDescription("Add a player!")
    .addUserOption(option =>
        option.setName('player')
            .setDescription('Add the player!')
            .setRequired(true)),

        async execute(interaction) {

        const user = interaction.user.username;
        const player = interaction.options.getUser('player').username;
        const result = await playersql.getPlayerByusername(player);

        for (const [chave, canal] of guild.channels.cache.entries()) {
            if (canal.type === 2 && canal.name === channelName) {
                channel = (canal);
            }
        }

        if (!channel) {
            await interaction.reply("Canal não encontrado!");
            return;
        }

        const members = Array.from(channel.members.values()).map(member => member.user.username);
        if (members.includes(player)) {
            const exampleEmbed = getEmbed();
            exampleEmbed.title = `${user} picked: ${player}`;
        } else {
            const exampleEmbed = getEmbed();
            exampleEmbed.title = `${player} isnt on the lobby channel`;
        }
    }
}
