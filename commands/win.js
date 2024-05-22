import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";
import Team1 from '../model/team1model.js';
import Team2 from '../model/team2model.js';

const team1 = new Team1('mydb.sqlite');
const team2 = new Team2('mydb.sqlite');

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

        const teamOne = team1.getTeam1();
        const teamTwo = team2.getTeam2();

        if (teamOne.lenght < 5) {
            winEmbed.title = 'Team 1 isnt complete!';
            await interaction.reply({ embeds: [winEmbed] });
            return;
        }

        if (teamTwo.lenght < 5) {
            winEmbed.title = 'Team 2 isnt complete!';
            await interaction.reply({ embeds: [winEmbed] });
            return;
        }

        if (winner == "team_1") {
            teamOne.forEach(player => {
                console.log(player);
            });
        }

        if (winner == "team_2") {
            teamTwo.forEach(player => {
                console.log(player);
            });
        }

        winEmbed.title = 'Winner setted sucessfuly!';
        await interaction.reply({ embeds: [winEmbed] });
    }
};
