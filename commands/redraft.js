import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";
import Team1 from '../model/team1model.js';
import Team2 from '../model/team2model.js';

const team1 = new Team1('mydb.sqlite');
const team2 = new Team2('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
        .setName("redraft")
        .setDescription("Limpa os times e mantem os capitães!"),

    async execute(interaction) {

        const user = interaction.user.username;

        const team1Cap = await team1.getTeam1Cap();
        const team2Cap = await team2.getTeam2Cap();

        if (user != team1Cap.player && user != team2Cap.player) {
            await interaction.reply(`Only a captain can use \`/redraft\`!`);
            return;
        }

        await team1.redraftTeam1();
        await team2.redraftTeam2();

        const redraftEmbed = getEmbed();
        redraftEmbed.title = 'The teams was cleared!';

        await interaction.reply({ embeds: [redraftEmbed] });
    }
};
