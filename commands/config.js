import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";
import { createMatchController, createTablePlayer, createTableTeam1, createTableTeam2 } from '../database/db.js';

createTablePlayer();
createTableTeam1();
createTableTeam2();

export default {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Configura o bot inicialmente"),

    async execute(interaction) {
        const exampleEmbed = getEmbed();
        exampleEmbed.title = 'The bot was configured!';
        await interaction.reply({ embeds: [exampleEmbed] });
    }
};
