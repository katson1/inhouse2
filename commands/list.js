import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";
import Player from '../model/playermodel.js';
import Team1 from '../model/team1model.js';
import Team2 from '../model/team2model.js';
import emojis from '../utils/emojis.js';

const team1 = new Team1('mydb.sqlite');
const team2 = new Team2('mydb.sqlite');
const playerModel = new Player('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
        .setName("list")
        .setDescription("Lista usuários no canal 'lobby'"),

    async execute(interaction) {
        const guild = interaction.guild;
        const channelName = "lobby";
        let channel = null;
        for (const [chave, canal] of guild.channels.cache.entries()) {
            if (canal.type === 2 && canal.name.toLowerCase().includes(channelName.toLowerCase())) {
                channel = canal;
            }
        }

        if (!channel) {
            await interaction.reply({ content: "Canal com nome 'lobby' não encontrado! Crie um canal de voz com nome que contenha o nome **lobby** como por exemplo: \`lobby\`, \`Mix・Lobby\`, \`INHOUSE LOBBY\`!" });
            return;
        }

        const listEmbed = getEmbed();
        listEmbed.title = 'Player List';
        listEmbed.description = `Pick players by using \`/pick\` `;

        const teamOne = await team1.getTeam1();
        const teamTwo = await team2.getTeam2();

        const members = Array.from(channel.members.values()).map(member => ({
            id: member.user.id,
            globalName: member.user.globalName || member.user.username
        }));
        const players = [...teamOne, ...teamTwo].map(team => team.player);
        const filteredMembers = members.filter(member => !players.includes(member.id));

        if (filteredMembers.length < 1) {
            listEmbed.title = 'No players left to pick!';
            listEmbed.description = ``;

            await interaction.reply({ embeds: [listEmbed] });
            return;
        }

        listEmbed.footer = {
            text: `Total: ${filteredMembers.length}`
        }

        for (const member of filteredMembers) {
            const findUser = await playerModel.getPlayerByusername(member.id);
            if (findUser.length > 0) {
                const primaryEmoji = emojis[findUser[0].primary_role];
                const secondaryEmoji = findUser[0].secondary_role ? emojis[findUser[0].secondary_role] : '';
                
                listEmbed.fields.push({
                    name: `\`${findUser[0].mmr}\`${primaryEmoji}${secondaryEmoji} ${member.globalName}`,
                    value: ``,
                    inline: false
                });
            }
        }
        await interaction.reply({ embeds: [listEmbed] });
    }
};
