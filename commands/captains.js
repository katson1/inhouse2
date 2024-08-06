import { SlashCommandBuilder } from "discord.js";
import { getEmbed } from "../utils/embed.js";
import Player from '../model/playermodel.js';
import Team1 from '../model/team1model.js';
import Team2 from '../model/team2model.js';
import Spec from '../model/specmodel.js'; // Importar o modelo de especs
import emojis from '../utils/emojis.js';

const playersql = new Player('mydb.sqlite');
const team1 = new Team1('mydb.sqlite');
const team2 = new Team2('mydb.sqlite');
const specsql = new Spec('mydb.sqlite'); // Criar instância do modelo de especs

export default {
    data: new SlashCommandBuilder()
        .setName("captains")
        .setDescription("Seleciona dois capitães")
        .addUserOption(option =>
            option.setName('captain1')
                .setDescription('Primeiro capitão')
                .setRequired(false))
        .addUserOption(option =>
            option.setName('captain2')
                .setDescription('Segundo capitão')
                .setRequired(false)),

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

        const manualCaptain1 = interaction.options.getUser('captain1');
        const manualCaptain2 = interaction.options.getUser('captain2');

        let caps;

        if (manualCaptain1 && manualCaptain2) {
            const cap1InChannel = members.find(member => member.id === manualCaptain1.id);
            const cap2InChannel = members.find(member => member.id === manualCaptain2.id);

            const isSpec1 = await specsql.searchSpec(manualCaptain1.id);
            const isSpec2 = await specsql.searchSpec(manualCaptain2.id);

            if (isSpec1) {
                await interaction.reply({ content: `${manualCaptain1.username} é um espectador e não pode ser selecionado como capitão.`, ephemeral: true });
                return;
            }

            if (isSpec2) {
                await interaction.reply({ content: `${manualCaptain2.username} é um espectador e não pode ser selecionado como capitão.`, ephemeral: true });
                return;
            }

            if (!cap1InChannel) {
                await interaction.reply({ content: `Erro: ${manualCaptain1.username} não está no canal de voz.` });
                return;
            }
            if (!cap2InChannel) {
                await interaction.reply({ content: `Erro: ${manualCaptain2.username} não está no canal de voz.` });
                return;
            }

            caps = [cap1InChannel, cap2InChannel];
        } else if (manualCaptain1 || manualCaptain2) {
            await interaction.reply({ content: "Selecione dois capitães ou nenhum para seleção aleatória." });
            return;
        } else {
            if (members.length < 2) {
                await interaction.reply({ content: `Não há jogadores suficientes no canal do Lobby. \`Min: 2\`` });
                return;
            }

            const availableMembers = [];
            for (const member of members) {
                const isSpec = await specsql.searchSpec(member.id);
                if (!isSpec) {
                    availableMembers.push(member);
                }
            }

            if (availableMembers.length < 2) {
                await interaction.reply({ content: `Não há jogadores suficientes disponíveis para serem selecionados como capitães.` });
                return;
            }

            caps = sortCaps(availableMembers);
        }

        const cap1 = await playersql.getPlayerByusername(caps[0].id);
        const cap2 = await playersql.getPlayerByusername(caps[1].id);

        if (!cap1[0]) {
            await interaction.reply({ content:  `Erro: ${caps[0].globalName || caps[0].username}, foi selecionado como capitão, mas não está inscrito na inhouse. Use \`/captain\` novamente.` });
            return;
        }
        if (!cap2[0]) {
            await interaction.reply({ content: `Erro: ${caps[1].globalName || caps[1].username}, foi selecionado como capitão, mas não está inscrito na inhouse. Use \`/captain\` novamente.` });
            return;
        }

        const pickInprogress = await team1.getTeam1();
        if (pickInprogress.length > 1) {
            const captainsEmbed = getEmbed();
            captainsEmbed.title = 'One team has already picked a player, use `/clear` or `/win` (if a game just ended)';
            await interaction.reply({ embeds: [captainsEmbed] });
            return;
        }

        await team1.clearTeam1();
        await team2.clearTeam2();

        let firstPick, other;
        if (cap1[0].mmr < cap2[0].mmr) {
            firstPick = cap1[0];
            other = cap2[0];
        } else {
            firstPick = cap2[0];
            other = cap1[0];
        }
        await team1.insertPlayerOnTeam1(firstPick.username);
        await team2.insertPlayerOnTeam2(other.username);

        const primaryEmoji_fp = emojis[firstPick.primary_role];
        const secondaryEmoji_fp = firstPick.secondary_role ? emojis[firstPick.secondary_role] : '';

        const primaryEmoji_other = emojis[other.primary_role];
        const secondaryEmoji_other = other.secondary_role ? emojis[other.secondary_role] : '';

        const captainsEmbed = getEmbed();
        captainsEmbed.title = 'Captains for next lobby:';
        firstPick.globalName = getGlobalNameById(firstPick.username, caps);
        other.globalName = getGlobalNameById(other.username, caps);

        captainsEmbed.fields.push(
            {
                name: `${primaryEmoji_fp}${secondaryEmoji_fp} ${firstPick.globalName} (first pick)`,
                value: `MMR: \`${firstPick.mmr}\``,
                inline: false,
            },
            {
                name: `${primaryEmoji_other}${secondaryEmoji_other} ${other.globalName}`,
                value: `MMR: \`${other.mmr}\``,
                inline: false,
            }
        );

        await interaction.reply({ embeds: [captainsEmbed] });
    }
};

function sortCaps(array) {
    return array.sort(() => 0.5 - Math.random()).slice(0, 2);
}

function getGlobalNameById(playerId, list) {
    const player = list.find(p => p.id === playerId);
    return player ? player.globalName : 'Player not found';
}