import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Info about commands!"),

    async execute(interaction) {
        const helpEmbed = getEmbed();
        helpEmbed.title = 'Commands:';
        helpEmbed.footer.text = `\u200b
Developed by @katson (on Discord)`;
        helpEmbed.fields.push(
            {
                name: `**/join**`,
                value: `Join and register as a player in the inhouse.
                A player can starts with:
                            \`Gold\`: 1775 MMR
                            \`Platinum\`: 1875 MMR
                            \`Diamond\`: 1975 MMR
                            \`Master\`: 2075 MMR
                            \`Pro\`: 2150 MMR`,
                inline: true,
            },
            {
                name: ``,
                value: `**options**:

- \`rank:\` select your current skill rank. (required)
- \`primary_role\` - select your primary_role. (required)
- \`secondary_role\` - select your secondary_role. (optional)`,
                inline: true,
            },
            {
                name: `**/list**`,
                value: `List players in the lobby channel who is not a captain or already picked.`,
                inline: false,
            },
            {
                name: `**/captains**`,
                value: `Select two random captains from lobby channel.`,
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
                value: `Select winner team.
                You earn \`15 MMR\` points per win.
- If the team you defeated has 20% or more \`MMR\` than you, you receive \`17 MMR\` points.
- If the team you defeated has 10% to 20% more \`MMR\` than you, you receive \`16 MMR\` points.
**\`The opposite occurs if you lose.\`**
- If you have \`2500 MMR\` points or more, you will receive \`1 MMR\` point less.
- If you have \`2300 MMR\` points or more, you will receive \`2 MMR\` points less.
- If you have \`1800 MMR\` points or less, you will receive \`1 MMR\` point more.
- If you have \`1700 MMR\` points or less, you will receive \`2 MMR\` points more.
                `,
                inline: false,
            },
            {
                name: `**/leaderboard**`,
                value: `Shows leaderboard based on MMR.`,
                inline: false,
            },
            {
                name: `**/myrank**`,
                value: `Shows your leaderboard position based on MMR.`,
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
                name: `**/map**`,
                value: `Choose a random map to vote on and play!`,
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
