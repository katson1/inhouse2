import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";
import Player from '../model/playermodel.js';
import emojis from '../utils/emojis.js';

const playerModel = new Player('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
        .setName("myrank")
        .setDescription("Shows your current rank position."),

    async execute(interaction) {
        await interaction.deferReply();

        const leaderboardEmbed = getEmbed();
        leaderboardEmbed.title = '🏆 - Your position:';

        const user = interaction.user;
        const userID = user.id;
        const guild = interaction.guild;

        try {
            const member = await guild.members.fetch(userID);
            if (!member) {
                leaderboardEmbed.title = '🏆 - Not found:';
                leaderboardEmbed.fields.push({
                    name: `You are not in the server:`,
                    value: `Please join the server to see your rank.`,
                    inline: true
                });
                await interaction.editReply({ embeds: [leaderboardEmbed] });
                return;
            }

            const allPlayers = await playerModel.getAllPlayerByTopMMR();
            const filteredPlayers = [];

            for (const player of allPlayers) {
                try {
                    await guild.members.fetch(player.username);
                    filteredPlayers.push(player);
                } catch (error) {
                    console.log(`Player not in guild: ${player.username}`);
                }
            }

            const playerIndex = filteredPlayers.findIndex(player => player.username === userID);
            if (playerIndex === -1) {
                leaderboardEmbed.title = '🏆 - Not found:';
                leaderboardEmbed.fields.push({
                    name: `You are not in the inhouse rankings:`,
                    value: `Use \`/join\` to participate.`,
                    inline: true
                });
            } else {
                const player = filteredPlayers[playerIndex];
                const primaryEmoji = emojis[player.primary_role];
                const secondaryEmoji = player.secondary_role ? emojis[player.secondary_role] : '';
                const winRate = calculateWinRate(player);

                leaderboardEmbed.fields.push({
                    name: `${playerIndex + 1} - \`${player.mmr}\` ${primaryEmoji}${secondaryEmoji}${member.user.globalName || member.user.username}`,
                    value: `${player.win} **W** - ${player.lose} **L**\n**Win**%:   ${winRate}\n**Games:** ${player.games}`,
                    inline: true
                });
            }

            await interaction.editReply({ embeds: [leaderboardEmbed] });
        } catch (error) {
            leaderboardEmbed.title = '🏆 - Not found:';
            leaderboardEmbed.fields.push({
                name: `You are not in the server:`,
                value: `Please join the server to see your rank.`,
                inline: true
            });
            await interaction.editReply({ embeds: [leaderboardEmbed] });
        }
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