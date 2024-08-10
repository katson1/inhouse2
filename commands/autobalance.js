import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";
import Player from '../model/playermodel.js';
import Spec from '../model/specmodel.js';
import emojis from '../utils/emojis.js';

const playerModel = new Player('mydb.sqlite');
const specsql = new Spec('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
        .setName("autobalance")
        .setDescription("Cria um lobby balanceado"),

    async execute(interaction) {
        const guild = interaction.guild;
        const channelName = "lobby";
        let channel = null;
        
        for (const [chave, canal] of guild.channels.cache.entries()) {
            if (canal.type === 2 && canal.name.toLowerCase().includes(channelName.toLowerCase())) {
                channel = canal;
                break;
            }
        }

        if (!channel) {
            await interaction.reply({ content: "Canal com nome 'lobby' não encontrado! Crie um canal de voz com nome que contenha o nome **lobby** como por exemplo: `lobby`, `Mix・Lobby`, `INHOUSE LOBBY`!" });
            return;
        }

        const members = Array.from(channel.members.values()).map(member => ({
            id: member.user.id,
            globalName: member.user.globalName || member.user.username
        }));

        const filteredMembers = [];
        for (const member of members) {
            const isSpec = await specsql.searchSpec(member.id);
            if (!isSpec) {
                const findUser = await playerModel.getPlayerByusername(member.id);
                if (findUser.length > 0) {
                    const playerData = findUser[0];
                    filteredMembers.push({
                        ...playerData,
                        globalName: member.globalName
                    });
                }
            }
        }

        console.log(filteredMembers);

        const listEmbed = getEmbed();
        listEmbed.title = 'teste';
        // listEmbed.description = `Players currently in the lobby:`;

        // filteredMembers.forEach(member => {
        //     const primaryEmoji = emojis[member.primary_role];
        //     const secondaryEmoji = member.secondary_role ? emojis[member.secondary_role] : '';
        //     listEmbed.fields.push({
        //         name: `\`${member.mmr}\`${primaryEmoji}${secondaryEmoji} ${member.globalName}`,
        //         value: `ID: ${member.id}, Wins: ${member.win}, Losses: ${member.lose}, Games: ${member.games}`,
        //         inline: false
        //     });
        // });

        listEmbed.footer = {
            text: `Total: ${filteredMembers.length}`
        }

        await interaction.reply({ embeds: [listEmbed] });
    }
};