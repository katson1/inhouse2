import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";
import Player from '../model/playermodel.js';
import Team1 from '../model/team1model.js';
import Team2 from '../model/team2model.js';
import emojis from '../utils/emojis.js';

const team1 = new Team1('mydb.sqlite');
const team2 = new Team2('mydb.sqlite');
const playerModel = new Player('mydb.sqlite');
const teamOne = await team1.getTeam1();
const teamTwo = await team2.getTeam2();

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
        
        const exampleEmbed = getEmbed();
        exampleEmbed.title = 'Player List';
        exampleEmbed.description = `Pick players by using \`/pick\` `;

        const members = Array.from(channel.members.values()).map(member => member.user.username);
        const players = [...teamOne, ...teamTwo].map(team => team.player);
        const filteredMembers = members.filter(member => !players.includes(member));

        for (const playerFromLobby of filteredMembers) {
            const findUser = await playerModel.getPlayerByusername(playerFromLobby);
            if (findUser.length > 0) {
                const primaryEmoji = emojis[findUser[0].primary_role];
                const secondaryEmoji = findUser[0].secondary_role ? emojis[findUser[0].secondary_role] : '';
                
                exampleEmbed.fields.push({
                    name: `\`${findUser[0].mmr}\`${primaryEmoji}${secondaryEmoji} ${playerFromLobby}`,
                    value: ``,
                    inline: false
                });
            }
        }

        await interaction.reply({ embeds: [exampleEmbed] });
    }
};
