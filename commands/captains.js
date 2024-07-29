import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";
import Player from '../model/playermodel.js';
import Team1 from '../model/team1model.js';
import Team2 from '../model/team2model.js';
import emojis from '../utils/emojis.js';

const playersql = new Player('mydb.sqlite');
const team1 = new Team1('mydb.sqlite');
const team2 = new Team2('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
        .setName("captains")
        .setDescription("Seleciona dois capitães"),

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

        const members = Array.from(channel.members.values()).map(member => ({
            id: member.user.id,
            globalName: member.user.globalName || member.user.username
        }));

        if (members.length < 2) {
            await interaction.reply({ content: `Não há jogadores suficientes no canal do Lobby. \`Min: 2\`` });
            return;
        }

        const caps = sortCaps(members);
        const cap1 = await playersql.getPlayerByusername(caps[0].id);
        const cap2 = await playersql.getPlayerByusername(caps[1].id);

        if (!cap1[0]) {
            await interaction.reply({ content:  `Erro: ${caps[0].globalName}, foi selecionado como capitão, mas não está inscrito na inhouse. Use \`/captain\` novamente.` });
            return;
        } 
        if (!cap2[0]) {
            await interaction.reply({ content: `Erro: ${caps[1].globalName}, foi selecionado como capitão, mas não está inscrito na inhouse. Use \`/captain\` novamente.` });
            return;
        }

        const pickInprogress = await team1.getTeam1();
        if (pickInprogress.length > 1) {
            const captainsEmbed = getEmbed();
            captainsEmbed.title = 'One team has already picked a player, use `/clear`';
            await interaction.reply({ embeds: [captainsEmbed] });
            return;
        }

        await team1.clearTeam1();
        await team2.clearTeam2();

        let fp, other;
        if (cap1[0].mmr > cap2[0].mmr) {
            fp = cap2[0];
            other = cap1[0];
        } else {
            fp = cap1[0];
            other = cap2[0];
        }
        await team1.insertPlayerOnTeam1(fp.username);
        await team2.insertPlayerOnTeam2(other.username);
        
        const primaryEmoji_fp = emojis[fp.primary_role];
        const secondaryEmoji_fp = fp.secondary_role ? emojis[fp.secondary_role] : '';
                
        const primaryEmoji_other = emojis[other.primary_role];
        const secondaryEmoji_other = other.secondary_role ? emojis[other.secondary_role] : '';

        const captainsEmbed = getEmbed();
        captainsEmbed.title = 'Captains for next lobby:';
        captainsEmbed.fields.push(
            {
                name: `\`${fp.mmr}\` ${primaryEmoji_fp}${secondaryEmoji_fp} ${caps[0].globalName} (first pick)`,
                value: '',
                inline: false,
            },
            {
                name: `\`${other.mmr}\` ${primaryEmoji_other}${secondaryEmoji_other} ${caps[1].globalName}`,
                value: '',
                inline: false,
            }
        );

        await interaction.reply({ embeds: [captainsEmbed] });
    }
};

function sortCaps(array) {
    return array.sort(() => 0.5 - Math.random()).slice(0, 2);
}
