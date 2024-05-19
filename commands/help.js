import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Info about commands!"),

    async execute(interaction) {
        const helpEmbed = getEmbed();
        helpEmbed.title = 'Commands:';
        helpEmbed.fields.push(
            {
                name: `**/join**`,
                value: `Join and register as a player in the inhouse.
                A player can starts with:
                            \`Gold\`: 1700 MMR
                            \`Platinum\`: 1800 MMR
                            \`Diamond\`: 1900 MMR
                            \`Master\`: 2075 MMR
                            \`Pro\`: 2150 MMR`,
                inline: true,
            },
            {
                name: ``,
                value: `**options**:

- \`rank:\` select your current skill rank. (required)
- \`primary_role\` - choose your primary_role. (required)
- \`secondary_role\` - choose your secondary_role. (optional)`,
                inline: true,
            },
            {
                name: `**/list**`,
                value: `List players in the lobby channel who is not a captain or already picked.`,
                inline: false,
            },
            {
                name: `**/captains**`,
                value: `Choose two random captains from lobby channel.`,
                inline: false,
            },
            {
                name: `**/clear**`,
                value: `Clear teams and captains.`,
                inline: false,
            },
            {
                name: `**/pick**`,
                value: `A captain can pick a player from the lobby channel who is not a captain or already picked.`,
                inline: false,
            },
            {
                name: `**/win**`,
                value: `Select winner team.`,
                inline: false,
            },
            {
                name: `**/leaderboard**`,
                value: `Shows leaderboard.`,
                inline: false,
            },
            {
                name: `**/roles**`,
                value: `Display your current roles, or allows you to update your roles by selecting new options:
                If you set only primary_role, it will update the primary_role and erase secondary_role.
                If you set both primary_role and secondary_role, it will update both.
                If you set only secondary_role it will update only secondary_role.
                If you dosnt set any, it will show your currents roles.
                `,
                inline: true,
            },
            {
                name: ``,
                value: `**options**:

- \`primary_role\` - update your primary_role. (optional)
- \`secondary_role\` - update your secondary_role. (optional)`,
                inline: true,
            },
            {
                name: `**/help**`,
                value: `Display the description of the commands.`,
                inline: false,
            }
        );
        await interaction.reply({ embeds: [helpEmbed] });
    }
};
