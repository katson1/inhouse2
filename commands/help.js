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
                value: `Join and register as a player in the inhouse.`,
                inline: true,
            },
            {
                name: ``,
                value: `**options**:
- \`rank\`, \`primary_role\`, \`secondary_role\``,
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
                name: `**/redraft**`,
                value: `Clear teams but keep captains.`,
                inline: false,
            },
            {
                name: `**/pick**`,
                value: `A captain can select an available player from the lobby who isn't a captain.`,
                inline: true,
            },
            {
                name: ``,
                value: `**option**:
- \`player\``,
                inline: true,
            },
            {
                name: `**/map**`,
                value: `Choose a random map to vote on and play.`,
                inline: false,
            },
            {
                name: `**/win**`,
                value: `Select winner team.`,
                inline: true,
            },
            {
                name: ``,
                value: `**option**:
- \`winner (team)\``,
                inline: true,
            },
            {
                name: `**/leaderboard**`,
                value: `Shows leaderboard based on MMR.`,
                inline: false,
            },
            {
                name: `**/achievements**`,
                value: `List the achievements, or shows achievements of a player. (not working yet)`,
                inline: true,
            },
            {
                name: ``,
                value: `**option**:
- \`player\``,
                inline: true,
            },
            {
                name: `**/myrank**`,
                value: `Shows your leaderboard position based on MMR.`,
                inline: false,
            },
            {
                name: `**/roles**`,
                value: `Display your current roles, or allows you to update your roles.
                `,
                inline: true,
            },
            {
                name: ``,
                value: `**options**:
- \`primary_role\`, \`secondary_role\``,
                inline: true,
            },
            {
                name: `**/teams**`,
                value: `Show current teams.`,
                inline: false,
            },
            {
                name: `**/spec**`,
                value: `Set or unset yourself as a spectator.`,
                inline: false,
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
