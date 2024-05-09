import { SlashCommandBuilder } from "discord.js";
import Player from '../model/playermodel.js';
import { getEmbed } from "../utils/embed.js";
import Team1 from '../model/team1model.js';
import Team2 from '../model/team2model.js';
import MatchController from '../model/matchcontroller.js';

const playersql = new Player('mydb.sqlite');
const team1 = new Team1('mydb.sqlite');
const team2 = new Team2('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
    .setName("pick")
    .setDescription("Add a player!")
    .addUserOption(option =>
        option.setName('player')
            .setDescription('Add the player!')
            .setRequired(true)),

        async execute(interaction) {
        const guild = interaction.guild;
        const channelName = "lobby";
        var channel = null;
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

        const exampleEmbed = getEmbed();

        const members = Array.from(channel.members.values()).map(member => member.user.username);

        const teamOne = await team1.getTeam1();
        const teamTwo = await team2.getTeam2();

        console.log(teamOne, teamTwo);

        if (members.includes(player)) {
            exampleEmbed.title = `${user} picked: ${player}`;
        } else {
            exampleEmbed.title = `${player} isnt on the lobby channel`;
        }

        await interaction.reply({ embeds: [exampleEmbed] });
    }
}
