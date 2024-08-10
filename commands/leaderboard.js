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
        await interaction.deferReply();

        const leaderboardEmbed = getEmbed();
        leaderboardEmbed.title = '🏆 - Leaderboard';

        const guild = interaction.guild;
        const list = await playerModel.getPlayerByTopMMR();
        var position = 0;
        for (const player of list) {
            position += 1;
            try {
                const member = await guild.members.fetch(player.username);
                const globalName = member.nickname || member.user.globalName || member.user.username;
                const primaryEmoji = emojis[player.primary_role];
                const secondaryEmoji = player.secondary_role ? emojis[player.secondary_role] : '';
                const winRate = calculateWinRate(player);

                leaderboardEmbed.fields.push({
                    name: `${position} - \`${player.mmr}\` ${globalName}\u200b \n${primaryEmoji} ${secondaryEmoji}`,
                    value: `${player.win} **W** - ${player.lose} **L**\n**Win**%:   ${winRate}\n**Games:** ${player.games}\n \u200b`,
                    inline: true
                });
            } catch (error) {
                position -= 1;
                console.error(`Could not fetch member for user ID: ${player.username}`);
            }
        }

        await interaction.editReply({ embeds: [leaderboardEmbed] });
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