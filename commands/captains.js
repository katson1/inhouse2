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
        var channel = null;
        for (const [chave, canal] of guild.channels.cache.entries()) {
            if (canal.type === 2 && canal.name === channelName) {
                channel = (canal);
            }
        }

        if (!channel) {
            await interaction.reply("Canal lobby não encontrado!");
            return;
        }

        const members = Array.from(channel.members.values()).map(member => member.user.username);
        const caps = sortCaps(members);
        const exampleEmbed = getEmbed();
        var fp = null;
        var other = null;
        let cap1 = await playersql.getPlayerByusername(caps[0]);
        let cap2 = await playersql.getPlayerByusername(caps[1]);
        if (members.length < 1) {
            exampleEmbed.title = 'There is no sufficient player on the lobby channel!';
            await interaction.reply({ embeds: [exampleEmbed] });
            return;
        }
        const pickInprogress = await team1.getTeam1();

        if(pickInprogress.length > 1){
            exampleEmbed.title = 'One has already picked a player, use \`/clear\`';
            await interaction.reply({ embeds: [exampleEmbed] });
            return;
        }
        await team1.clearTeam1();
        await team2.clearTeam2();
        if (cap1[0].mmr > cap2[0].mmr) {
            fp = cap2;
            other = cap1;
            await team1.insertPlayerOnTeam1(cap2[0].username);
            await team2.insertPlayerOnTeam2(cap1[0].username);
        } else {
            fp = cap1;
            other = cap2;
            await team1.insertPlayerOnTeam1(cap1[0].username);
            await team2.insertPlayerOnTeam2(cap2[0].username);
        }
        exampleEmbed.title = 'Captains for next lobby:';
        exampleEmbed.fields.push(
            {
                name: '',
                value: `**${fp[0].username}** (first pick)` || "Nenhum usuário no canal",
                inline: false,
            },
            {
                name: '',
                value: `**${other[0].username}**` || "Nenhum usuário no canal",
                inline: false,
            }
        );

        await interaction.reply({ embeds: [exampleEmbed] });
    }
};

function sortCaps(array) {
    let sorted = array.sort(() => 0.5 - Math.random());

    return sorted.slice(0, 2);
}