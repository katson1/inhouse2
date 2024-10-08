import { SlashCommandBuilder } from "discord.js";
import Player from '../model/playermodel.js';
import { getEmbed } from "../utils/embed.js";
import Team1 from '../model/team1model.js';
import Team2 from '../model/team2model.js';
import Spec from '../model/specmodel.js';

export default {
    data: new SlashCommandBuilder()
        .setName("pick")
        .setDescription("Add a player!")
        .addUserOption(option =>
            option.setName('player')
                .setDescription('Add the player!')
                .setRequired(true)),

    async execute(interaction) {
        const playersql = new Player('mydb.sqlite');
        const team1 = new Team1('mydb.sqlite');
        const team2 = new Team2('mydb.sqlite');
        const specsql = new Spec('mydb.sqlite');

        var teamReady = false;

        const guild = interaction.guild;
        const channelName = "lobby";
        var channel = null;
        const user = interaction.user.id;
        const playerUser = interaction.options.getUser('player');
        const player = playerUser.username;
        const playerID = playerUser.id;

        const isSpec = await specsql.searchSpec(playerID);
        if (isSpec) {
            await interaction.reply({ content: `${playerUser.username} is marked as a spectator and cannot be picked.`, ephemeral: true });
            return;
        }

        const result = await playersql.getPlayerByusername(player);

        for (const [chave, canal] of guild.channels.cache.entries()) {
            if (canal.type === 2 && canal.name.toLowerCase().includes(channelName.toLowerCase())) {
                channel = canal;
            }
        }

        if (!channel) {
            await interaction.reply({ content: "Canal com nome 'lobby' não encontrado! Crie um canal de voz com nome que contenha o nome **lobby** como por exemplo: `lobby`, `Mix・Lobby`, `INHOUSE LOBBY`!" });
            return;
        }

        const pickEmbed = getEmbed();

        const members = Array.from(channel.members.values()).map(member => ({
            username: member.user.username,
            nickname: member.nickname || member.user.globalName || member.user.username,
        }));

        const teamOne = await team1.getTeam1();
        const teamTwo = await team2.getTeam2();

        const playerAlreadyPickedTeam1 = teamOne.some(jogador => jogador.player === playerID);
        const playerAlreadyPickedTeam2 = teamTwo.some(jogador => jogador.player === playerID);

        const team1Cap = await team1.getTeam1Cap();
        const team2Cap = await team2.getTeam2Cap();

        if (user !== team1Cap.player && user !== team2Cap.player) {
            await interaction.reply({ content: `You are not a captain!`, ephemeral: true });
            return;
        }

        if (teamTwo.length === 5) {
            await interaction.reply({ content: `Game already started!`, ephemeral: true });
            return;
        }

        let message = '';

        const member = members.find(m => m.username === player);
        if (member) {
            if (playerAlreadyPickedTeam1 || playerAlreadyPickedTeam2) {
                await interaction.reply({ content: `${member.nickname} has already been picked.`, ephemeral: true });
                return;
            } else {
                if (teamOne.length > teamTwo.length) {
                    if (user !== team2Cap.player) {
                        await interaction.reply({ content: `Isn't your time to pick!`, ephemeral: true });
                        return;
                    }
                    await team2.insertPlayerOnTeam2(playerID);

                    const updatedTeam2 = await team2.getTeam2(); 
                    if (updatedTeam2.length === 5) {
                        teamReady = true;
                    }
                } else {
                    if (user !== team1Cap.player) {
                        await interaction.reply({ content: `Isn't your time to pick!`, ephemeral: true });
                        return;
                    }
                    await team1.insertPlayerOnTeam1(playerID);
                }

                if (!teamReady) {
                    pickEmbed.title = `<@${user}> picked: ${member.nickname}`;
                    message = `<@${user}> picked: ${member.nickname}`;
                } else {
                    message = `<@${user}> picked: ${member.nickname}`;
                    pickEmbed.title = "Teams ready!";
                    const updatedTeam1 = await team1.getTeam1WithPlayers();
                    const updatedTeam2 = await team2.getTeam2WithPlayers();
                    const team1MMR = await team1.getTeam1MMR();
                    const team2MMR = await team2.getTeam2MMR();

                    const formattedTeam1MMR = formatMMR(team1MMR.mmr);
                    const formattedTeam2MMR = formatMMR(team2MMR.mmr);

                    pickEmbed.fields.push(
                        { name: `Team 1 \u200B - \u200B (\`${formattedTeam1MMR}\`)`, value: updatedTeam1.map(jogador => `<@${jogador.player}>`).join('\n'), inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name: `Team 2 \u200B - \u200B (\`${formattedTeam2MMR}\`)`, value: updatedTeam2.map(jogador => `<@${jogador.player}>`).join('\n'), inline: true },
                    );
                }
            }
        } else {
            pickEmbed.title = `<@${playerID}> isn't on the lobby channel`;
            message = `<@${playerID}> isn't on the lobby channel`;
        }

        if (!teamReady) {
            await interaction.reply({ content: message });
        } else {
            await interaction.reply({ content: message });
            await interaction.followUp({ embeds: [pickEmbed] });
        }
    }
};

function calculateWinRate(player) {
    if (player.games === 0) {
        return "0%";
    }

    const winRate = (player.win / player.games) * 100;
    return winRate.toFixed(2) + '%';
}


function formatMMR(mmr) {
    return Number.isInteger(mmr) ? mmr.toString() : mmr.toFixed(2);
}