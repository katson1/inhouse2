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
            achievementsEmbed.title = '🎯  Achievements';
            achievementsEmbed.description = 'We are working on it, soon we will also have achievements in the inhouse bot!';
            if (player) {
                const globalName = player.globalName;
                achievementsEmbed.title = `🎯  ${globalName} achievements`;
                console.log(player);
            } else {
                
            }
             interaction.reply({ embeds: [achievementsEmbed] } );
        }
}
