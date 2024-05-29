import { SlashCommandBuilder } from "discord.js";
import Player from '../model/playermodel.js';
import { getEmbed } from "../utils/embed.js";
import Team1 from '../model/team1model.js';
import Team2 from '../model/team2model.js';

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

        var teamReady;

        const guild = interaction.guild;
        const channelName = "lobby";
        var channel = null;
        const user = interaction.user.username;
        const player = interaction.options.getUser('player').username;
        const result = await playersql.getPlayerByusername(player);

        var channel = null;
        for (const [chave, canal] of guild.channels.cache.entries()) {
            if (canal.type === 2 && canal.name.toLowerCase().includes(channelName.toLowerCase())) {
                channel = canal;
            }
        }

        if (!channel) {
            await interaction.reply({ content: "Canal com nome 'lobby' não encontrado! Crie um canal de voz com nome que contenha o nome **lobby** como por exemplo: \`lobby\`, \`Mix・Lobby\`, \`INHOUSE LOBBY\`!" });
            return;
        }

        const pickEmbed = getEmbed();

        const members = Array.from(channel.members.values()).map(member => member.user.username);

        const teamOne = await team1.getTeam1();
        const teamTwo = await team2.getTeam2();

        const playerAlreadyPickedTeam1 = teamOne.some(jogador => jogador.player === player);
        const playerAlreadyPickedTeam2 = teamTwo.some(jogador => jogador.player === player);

        const team1Cap = await team1.getTeam1Cap();
        const team2Cap = await team2.getTeam2Cap();

        if (user != team1Cap.player && user != team2Cap.player) {
            await interaction.reply(`You are not a captain!`);
            return;
        }

        if (teamTwo.length == 5) {
            await interaction.reply(`Game already start!`);
            return;
        }

        let message = '';

        if (members.includes(player)) {
            if (playerAlreadyPickedTeam1 || playerAlreadyPickedTeam2) {
                await interaction.reply(`${player} has already been picked`);
                return;
            } else {
                if (teamOne.length > teamTwo.length) {
                    if (user != team2Cap.player) {
                        await interaction.reply({ content: `Isn't your time to pick!`, ephemeral: true });
                        return;
                    }
                    await team2.insertPlayerOnTeam2(player);

                    const updatedTeam2 = await team2.getTeam2(); 
                    if (updatedTeam2.length == 5) {
                        teamReady = true;
                    }
                } else {
                    if (user != team1Cap.player) {
                        await interaction.reply({ content: `Isn't your time to pick!`, ephemeral: true });
                        return;
                    }
                    await team1.insertPlayerOnTeam1(player)
                }

                if (!teamReady) {
                    pickEmbed.title = `${user} picked: ${player}`;
                    message = `${user} picked: ${player}`;
                } else {
                    message = `${user} picked: ${player}`;
                    pickEmbed.title = "Teams ready!";
                    const updatedTeam1 = await team1.getTeam1();
                    const updatedTeam2 = await team2.getTeam2();

                    const team1MMR = await team1.getTeam1MMR();
                    const team2MMR = await team2.getTeam2MMR();

                    pickEmbed.fields.push(
                        { name: 'Team 1', value: updatedTeam1.map(jogador => jogador.player).join('\n'), inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },
                        { name: 'Team 2', value: updatedTeam2.map(jogador => jogador.player).join('\n'), inline: true },
                        { name: '', value: `**mmr: ** ${team1MMR.mmr}`, inline: true },
                        { name: '', value: `**mmr: ** ${team2MMR.mmr}`, inline: true }
                    );

                }
            }
        } else {
            pickEmbed.title = `${player} isn't on the lobby channel`;
            message = `${player} isn't on the lobby channel`;
        }

        if (!teamReady) {
            await interaction.reply(message);
        } else {
            await interaction.reply(message);
            await interaction.followUp({ embeds: [pickEmbed] });
        }
    }
}
