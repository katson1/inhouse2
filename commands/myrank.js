import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";
import Player from '../model/playermodel.js';
import emojis from '../utils/emojis.js';

const playerModel = new Player('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
        .setName("myrank")
        .setDescription("Shows your current rank postition."),

    async execute(interaction) {
        const leaderboardEmbed = getEmbed();
        leaderboardEmbed.title = '🏆 - Your position:';
        const user = interaction.user.username;
        const userID = interaction.user.id;
        const userGlobalName = interaction.user.globalName;
        const list = await playerModel.getPlayerByUsernameWithRank(userID);
        const player = list[0]
        if (player) {
            const primaryEmoji = emojis[player.primary_role];
            const secondaryEmoji = player.secondary_role ? emojis[player.secondary_role] : '';
            const winRate = calculateWinRate(player);

            leaderboardEmbed.fields.push({
                name: `${player.position} - \`${player.mmr}\` ${primaryEmoji}${secondaryEmoji}${userGlobalName}`,
                value: `${player.win} **W** - ${player.lose} **L**\n**Win**%:   ${winRate}\n**Games:** ${player.games}`,
                inline: true
            });
        } else {
            leaderboardEmbed.title = `🏆 - We couldn't find you:`;
            leaderboardEmbed.fields.push({
                name: `You have not joinned the inhouse:`,
                value: `Use \`/join\``,
                inline: true
            });
        }

        await interaction.reply({ embeds: [leaderboardEmbed] });
    }
};

function calculateWinRate(player) {
    if (player.games === 0) {
        return "0%";
    }
    
    const winRate = (player.win / player.games) * 100;
    if (winRate % 1 === 0) {
        return winRate + '%';
    } else {
        return winRate.toFixed(2) + '%';
    }
}
