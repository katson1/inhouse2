import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";
import Player from '../model/playermodel.js';
import emojis from '../utils/emojis.js';

const playerModel = new Player('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Shows players leaderboard."),

    async execute(interaction) {
        const leaderboardEmbed = getEmbed();
        leaderboardEmbed.title = '🏆 - Leaderboard';

        const list = await playerModel.getPlayerByTopMMR();

        list.forEach(player => {
            const primaryEmoji = emojis[player.primary_role];
            const secondaryEmoji = player.secondary_role ? emojis[player.secondary_role] : '';

            leaderboardEmbed.fields.push({
                name: `${player.rowid} - \`${player.mmr}\` ${primaryEmoji}${secondaryEmoji}${player.username}\u200b \u200b \u200b \u200b`,
                value: `Wins: ${player.win}\nLosses: ${player.lose}\nGames: ${player.games}`,
                inline: true
            });
        });
        await interaction.reply({ embeds: [leaderboardEmbed] });
    }
};
