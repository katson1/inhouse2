import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";
import Player from '../model/playermodel.js';
import Team1 from '../model/team1model.js';
import Team2 from '../model/team2model.js';

const team1 = new Team1('mydb.sqlite');
const team2 = new Team2('mydb.sqlite');
const playerModel = new Player('mydb.sqlite');

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

        const teamOne = await team1.getTeam1();
        const teamTwo = await team2.getTeam2();
        const team1MMR = await team1.getTeam1MMR();
        const team2MMR = await team2.getTeam2MMR();


        if (teamOne.length < 5) {
            winEmbed.title = 'Team 1 isn\'t complete!';
            await interaction.reply({ embeds: [winEmbed] });
            return;
        }

        if (teamTwo.length < 5) {
            winEmbed.title = 'Team 2 isn\'t complete!';
            await interaction.reply({ embeds: [winEmbed] });
            return;
        }

        if (winner == "team_1") {
            for (const player of teamOne) {
                let percentageDifference = ((player.mmr - team2MMR) / player.mmr) * 100;
                let winMMR = 15;
                if (percentageDifference < -10) {
                    winMMR = 16;
                }
                if (percentageDifference < -15) {
                    winMMR = 17;
                }
                if (percentageDifference > 15) {
                    winMMR = 14;
                }
                if (player.mmr > 2300) {
                    winMMR -= 1;
                }
                if (player.mmr > 2500) {
                    winMMR -= 1;
                }
                if (player.mmr < 1700) {
                    winMMR += 1;
                }
                if (player.mmr < 1800) {
                    winMMR += 1;
                }
                await playerModel.updatePlayerWinStats(winMMR, player.player);
            }
            for (const player of teamTwo) {
                let loseMMR = -15;
                let percentageDifference = ((player.mmr - team1MMR) / player.mmr) * 100;
                if (percentageDifference < -10) {
                    loseMMR = -16;
                }
                if (percentageDifference < -15) {
                    loseMMR = -17;
                }
                if (percentageDifference > 15) {
                    loseMMR = -14;
                }
                if (percentageDifference > 20) {
                    loseMMR = -13;
                }
                if (player.mmr > 2300) {
                    winMMR -= 1;
                }
                if (player.mmr > 2500) {
                    winMMR -= 1;
                }
                if (player.mmr < 1700) {
                    winMMR += 1;
                }
                if (player.mmr < 1800) {
                    winMMR += 1;
                }
                await playerModel.updatePlayerLoseStats(loseMMR, player.player);
            }
        }

        if (winner == "team_2") {
            for (const player of teamTwo) {
                let percentageDifference = ((player.mmr - team1MMR) / player.mmr) * 100;
                let winMMR = 15;
                if (percentageDifference < -10) {
                    winMMR = 16;
                }
                if (percentageDifference < -15) {
                    winMMR = 17;
                }
                if (percentageDifference > 15) {
                    winMMR = 14;
                }
                if (player.mmr > 2300) {
                    winMMR -= 1;
                }
                if (player.mmr > 2500) {
                    winMMR -= 1;
                }
                await playerModel.updatePlayerWinStats(winMMR, player.player);
            }
            for (const player of teamOne) {
                let percentageDifference = ((player.mmr - team2MMR) / player.mmr) * 100;
                let loseMMR = -15;
                if (percentageDifference < -10) {
                    loseMMR = -16;
                }
                if (percentageDifference < -15) {
                    loseMMR = -17;
                }
                if (percentageDifference > 15) {
                    loseMMR = -14;
                }
                if (percentageDifference > 20) {
                    loseMMR = -13;
                }
                if (player.mmr > 2300) {
                    winMMR -= 1;
                }
                if (player.mmr > 2500) {
                    winMMR -= 1;
                }
                await playerModel.updatePlayerLoseStats(loseMMR, player.player);
            }
        }

        await team1.clearTeam1();
        await team2.clearTeam2();

        winEmbed.title = 'Winner set successfully!';
        await interaction.reply({ embeds: [winEmbed] });
    }
};
