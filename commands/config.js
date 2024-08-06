import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";
import { createTablePlayer, createTableSpec, createTableTeam1, createTableTeam2 } from '../database/db.js';

createTablePlayer();
createTableTeam1();
createTableTeam2();
createTableSpec();

export default {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Configura o bot inicialmente"),

    async execute(interaction) {
        const configEmbed = getEmbed();
        configEmbed.title = 'The bot was configured!';
        await interaction.reply({ embeds: [configEmbed] });
    }
};
