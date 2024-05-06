import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";
import Player from '../model/playermodel.js';

export default {
    data: new SlashCommandBuilder()
        .setName("list")
        .setDescription("Lista usuários no canal 'lobby'"),

    async execute(interaction) {
        const guild = interaction.guild;
        const channelName = "lobby";
        var channel = null;
        for (const [chave, canal] of guild.channels.cache.entries()) {
            if (canal.type === 2 && canal.name === channelName) {
                channel = (canal);
            }
        }

        if (!channel) {
            await interaction.reply("Canal não encontrado!");
            return;
        }

        const members = Array.from(channel.members.values()).map(member => member.user.username).join(', ');
        const exampleEmbed = getEmbed();
        exampleEmbed.title = 'Usuários no canal lobby:';
        exampleEmbed.fields.push(
            {
                name: "Usuários",
                value: members || "Nenhum usuário no canal",
                inline: false,
            }
        );

        await interaction.reply({ embeds: [exampleEmbed] });
    }
};
