import { SlashCommandBuilder } from "discord.js";
import Team1 from '../model/team1model.js';
import Team2 from '../model/team2model.js';
import { getEmbed } from "../utils/embed.js";

export default {
    data: new SlashCommandBuilder()
        .setName("teams")
        .setDescription("Mostra os times atuais."),

    async execute(interaction) {
        const team1 = new Team1('mydb.sqlite');
        const team2 = new Team2('mydb.sqlite');

        const updatedTeam1 = await team1.getTeam1WithPlayers();
        const updatedTeam2 = await team2.getTeam2WithPlayers();
        const team1MMR = await team1.getTeam1MMR();
        const team2MMR = await team2.getTeam2MMR();

        const teamsEmbed = getEmbed();
        teamsEmbed.title = "Times atuais:";
        teamsEmbed.fields.push(
            { name: `Team 1 \u200B - \u200B (\`${team1MMR.mmr}\`)`, value: updatedTeam1.map(jogador => `<@${jogador.player}>`).join('\n'), inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: `Team 2 \u200B - \u200B (\`${team2MMR.mmr}\`)`, value: updatedTeam2.map(jogador => `<@${jogador.player}>`).join('\n'), inline: true },
        );

        await interaction.reply({ embeds: [teamsEmbed] });
    }
};
