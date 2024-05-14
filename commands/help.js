import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Info about commands!"),

    async execute(interaction) {
        const exampleEmbed = getEmbed();
        exampleEmbed.title = 'Commands:';
        exampleEmbed.fields.push(
            {
                name: `/join`,
                value: `Join to the inhouse.
                A player can starts with:
                            \`Gold\`: 1700 MMR
                            \`Platinum\`: 1800 MMR
                            \`Diamond\`: 1900 MMR
                            \`Master\`: 2075 MMR
                            \`Pro\`: 2150 MMR
                            Note: To qualify as a \`pro\`, you must meet one of the following criteria: win at least one major tournament, achieve victories in two or more amateur tournaments, or participate in over four playoff tournaments!`,
                inline: false,
            },
            {
                name: `/list`,
                value: `Lists all players in lobby channel`,
                inline: false,
            },
            {
                name: `/captains`,
                value: `Choose random captains.`,
                inline: false,
            },
            {
                name: `/clear`,
                value: `Clear teams and captains.`,
                inline: false,
            },
            {
                name: `/pick`,
                value: `A captain can pick a player from the lobby channel.`,
                inline: false,
            },
            {
                name: `/win`,
                value: `Select team winner.`,
                inline: false,
            },
            {
                name: `/leaderboard`,
                value: `Shows leaderboard.`,
                inline: false,
            },
            {
                name: `/help`,
                value: `Shows the description of the commands.`,
                inline: false,
            },
            {
                name: ``,
                value: ``,
                inline: false,
            }
        );
        await interaction.reply({ embeds: [exampleEmbed] });
    }
};
