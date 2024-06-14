import { SlashCommandBuilder } from 'discord.js';
import Player from '../model/playermodel.js';
import { getEmbed } from '../utils/embed.js';
import { createTablePlayer, createTableTeam1, createTableTeam2 } from '../database/db.js';
import emojis from '../utils/emojis.js';

const playersql = new Player('mydb.sqlite');

createTablePlayer();
createTableTeam1();
createTableTeam2();

export default {
    data: new SlashCommandBuilder()
        .setName("achievements")
        .setDescription("Show all achievements or your achievements!")
        .addUserOption(option =>
            option.setName('player')
                .setDescription('Select a player!')
                .setRequired(false)),

        async execute(interaction) {
            const player = interaction.options.getUser('player');
            const achievementsEmbed = getEmbed();
            achievementsEmbed.color = 0xFF6961;
            achievementsEmbed.title = '🎯  Achievements:';
            achievementsEmbed.description = '(beta test* - still not working properly*)';
            if (player) {
                const globalName = player.globalName;
                achievementsEmbed.title = `🎯  ${globalName} achievements`;
                console.log(player);
            } else {
                achievementsEmbed.fields.push({
                    name: `<:beata1x1:1248394639850078260> - Beta tester`,
                    value: `Join Inhouse during the beta test version. \`(0 members)\``,
                    inline: false
                },
                {
                    name: `<:top1:1248406549018443939> - #1`,
                    value: `Reach the top of the leaderboard once. \`(0 members)\``,
                    inline: false
                },
                {
                    name: `💡 - Helper`,
                    value: `Suggest an improvement for the bot using **/suggest**. \`(0 members)\``,
                    inline: false
                },
                {
                    name: `Winner:`,
                    value: `🥉 - Level 1 - Win 10 games or more. \`(0 members)\`\n🥈 - Level 2 - Win 25 games or more. \`(0 members)\`\n🥇 - Level 3 - Win 50 games or more. \`(0 members)\`\n⭐ - Level 4 - Win 100 games or more. \`(0 members)\``,
                    inline: false
                },
                {
                    name: `Gamer:`,
                    value: `♟️ - Level 1 - Play 20 games or more. \`(0 members)\`\n🕹️ - Level 2 - Play 50 games or more. \`(0 members)\`\n🎮 - Level 3 - Play 100 games or more. \`(0 members)\``,
                    inline: false
                }
            );
            }
             interaction.reply({ embeds: [achievementsEmbed] } );
        }
}
