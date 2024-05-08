import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";
import Player from '../model/playermodel.js';
import Team1 from '../model/team1model.js';
import Team2 from '../model/team2model.js';
import MatchController from '../model/matchcontroller.js';

const playersql = new Player('mydb.sqlite');
const team1 = new Team1('mydb.sqlite');
const team2 = new Team2('mydb.sqlite');
const match = new MatchController('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
        .setName("captains")
        .setDescription("Seleciona dois capitães"),

    async execute(interaction) {
        const guild = interaction.guild;
        const channelName = "lobby";
        const channel = guild.channels.cache.find(channel => channel.name === channelName);

        if (!channel) {
            await interaction.reply({ content: "Canal 'lobby' não encontrado!", ephemeral: true });
            return;
        }

        console.log(global.channelMembers);
        // Obtém os membros do canal 'lobby' do mapa
        const members = global.channelMembers.get(channel.id) || [];
        console.log(members);

        if (members.length < 2) {
            await interaction.reply({ content: "Não há jogadores suficientes no canal 'lobby'.", ephemeral: true });
            return;
        }

        const caps = sortCaps(members);
        let cap1 = await playersql.getPlayerByusername(caps[0]);
        let cap2 = await playersql.getPlayerByusername(caps[1]);

        const pickInprogress = await team1.getTeam1();
        if (pickInprogress.length > 0) {
            const exampleEmbed = getEmbed();
            exampleEmbed.title = 'One team has already picked a player, use `/clear`';
            await interaction.reply({ embeds: [exampleEmbed] });
            return;
        }

        await team1.clearTeam1();
        await team2.clearTeam2();

        let fp, other;
        if (cap1[0].mmr > cap2[0].mmr) {
            fp = cap2;
            other = cap1;
        } else {
            fp = cap1;
            other = cap2;
        }
        await team1.insertPlayerOnTeam1(fp[0].username);
        await team2.insertPlayerOnTeam2(other[0].username);

        const exampleEmbed = getEmbed();
        exampleEmbed.title = 'Captains for next lobby:';
        exampleEmbed.fields.push(
            {
                name: '',
                value: `**${fp[0].username}** (first pick)` || "No user in the channel",
                inline: false,
            },
            {
                name: '',
                value: `**${other[0].username}**` || "No user in the channel",
                inline: false,
            }
        );

        await interaction.reply({ embeds: [exampleEmbed] });
    }
};

function sortCaps(array) {
    return array.sort(() => 0.5 - Math.random()).slice(0, 2);
}
