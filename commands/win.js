import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";
import Player from '../model/playermodel.js';
import Team1 from '../model/team1model.js';
import Team2 from '../model/team2model.js';

const team1 = new Team1('mydb.sqlite');
const team2 = new Team2('mydb.sqlite');
const playerModel = new Player('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
        .setName("win")
        .setDescription("Designates a team as winner!")
        .addStringOption(option =>
            option.setName('winner')
                .setDescription('Select the winner.')
                .setRequired(true)
                .addChoices(
                    { name: 'Team 1', value: 'team_1' },
                    { name: 'Team 2', value: 'team_2' })),

    async execute(interaction) {
        const winEmbed = getEmbed();
        const winner = interaction.options.getString('winner');

        const teamOne = await team1.getTeam1();
        const teamTwo = await team2.getTeam2();        
        
        if (teamOne.length < 5) {
            winEmbed.title = 'Team 1 isn\'t complete!';
            await interaction.reply({ embeds: [winEmbed] });
            return;
        }

        if (teamTwo.length < 5) {
            winEmbed.title = 'Team 2 isn\'t complete!';
            await interaction.reply({ embeds: [winEmbed] });
            return;
        }

        if (winner == "team_1") {
            for (const player of teamOne) {
                await playerModel.updatePlayerWinStats(player.player);
            }
            for (const player of teamTwo) {
                await playerModel.updatePlayerLoseStats(player.player);
            }
        }

        if (winner == "team_2") {
            for (const player of teamTwo) {
                await playerModel.updatePlayerWinStats(player.player);
            }
            for (const player of teamOne) {
                await playerModel.updatePlayerLoseStats(player.player);
            }
        }

        await team1.clearTeam1();
        await team2.clearTeam2();

        winEmbed.title = 'Winner set successfully!';
        await interaction.reply({ embeds: [winEmbed] });
    }
};
