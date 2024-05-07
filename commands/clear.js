import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";
import Team1 from '../model/team1model.js';
import Team2 from '../model/team2model.js';

const team1 = new Team1('mydb.sqlite');
const team2 = new Team2('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Limpa os times!"),

    async execute(interaction) {

        await team1.clearTeam1();
        await team2.clearTeam2();

        const exampleEmbed = getEmbed();
        exampleEmbed.title = 'The teams and captains was cleared!';

        await interaction.reply({ embeds: [exampleEmbed] });
    }
};
