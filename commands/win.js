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

        if (team1.lenght < 5) {
            winEmbed.title = 'Team 1 isnt complete!';
            await interaction.reply({ embeds: [winEmbed] });
            return;
        }

        if (team2.lenght < 5) {
            winEmbed.title = 'Team 2 isnt complete!';
            await interaction.reply({ embeds: [winEmbed] });
            return;
        }

        if (winner == "team_1") {
            console.log("111111111111");
        }

        if (winner == "team_2") {
            console.log("222222");
        }

        winEmbed.title = 'Winner setted sucessfuly!';
        await interaction.reply({ embeds: [winEmbed] });
    }
};
