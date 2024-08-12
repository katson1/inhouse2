import { SlashCommandBuilder } from "discord.js";
import Player from '../model/playermodel.js';
import { getEmbed } from "../utils/embed.js";
import Team1 from '../model/team1model.js';
import Team2 from '../model/team2model.js';
import Spec from '../model/specmodel.js';

export default {
    data: new SlashCommandBuilder()
        .setName("swap")
        .setDescription("Swap a player drafted for other!")
        .addUserOption(option =>
            option.setName('player_1')
                .setDescription('The player to change.')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('player_2')
                .setDescription('The other player to change.')
                .setRequired(true)),

    async execute(interaction) {
        const playersql = new Player('mydb.sqlite');
        const team1 = new Team1('mydb.sqlite');
        const team2 = new Team2('mydb.sqlite');
        const specsql = new Spec('mydb.sqlite');

        const user = interaction.user;
        const player1 = interaction.options.getUser('player_1');
        const player2 = interaction.options.getUser('player_2');
        const player1ID = player1.id;
        const player2ID = player2.id;
        const player1Name = player1.globalName || player1.username;
        const player2Name = player2.globalName || player2.username;

        const player1IDisSpec = await specsql.searchSpec(player1ID);
        const player2IDisSpec = await specsql.searchSpec(player2ID);
        if (player1IDisSpec) {
            await interaction.reply({ content: `${player1Name} is marked as a spectator and cannot be picked.`, ephemeral: true });
            return;
        }
        if (player2IDisSpec) {
            await interaction.reply({ content: `${player2Name} is marked as a spectator and cannot be picked.`, ephemeral: true });
            return;
        }

        const isPlayer1 = await playersql.getPlayerByusername(player1ID);
        const isPlayer2 = await playersql.getPlayerByusername(player2ID);

        if (!isPlayer1) {
            await interaction.reply({ content: `${player1Name} is not registered and cannot be selected`, ephemeral: true });
            return;
        }
        if (!isPlayer2) {
            await interaction.reply({ content: `${player2Name} is not registered and cannot be selected`, ephemeral: true });
            return;
        }

        const team1Cap = await team1.getTeam1Cap();
        const team2Cap = await team2.getTeam2Cap();

        if (user.id !== team1Cap.player && user.id !== team2Cap.player) {
            await interaction.reply({ content: `You are not a captain!`, ephemeral: true });
            return;
        }

        if (await team1.isOnTeam1(player1ID) && await team1.isOnTeam1(player2ID)) {
            await interaction.reply({ content: `Both players are already on Team 1.`, ephemeral: true });
            return;
        } else if (await team2.isOnTeam2(player1ID) && await team2.isOnTeam2(player2ID)) {
            await interaction.reply({ content: `Both players are already on Team 2.`, ephemeral: true });
            return;
        } else if ((await team1.isOnTeam1(player1ID)) && (await team2.isOnTeam2(player2ID))) {
            await team1.changePlayer(player2ID, player1ID);
            await team2.changePlayer(player1ID, player2ID);
        } else if (((await team1.isOnTeam1(player2ID)) && (await team2.isOnTeam2(player1ID)))) {
            await team1.changePlayer(player1ID, player2ID);
            await team2.changePlayer(player2ID, player1ID);
        } else if (await team1.isOnTeam1(player1ID)) {
            await team1.changePlayer(player2ID, player1ID);
        } else if (await team2.isOnTeam2(player2ID)) {
            await team2.changePlayer(player1ID, player2ID);
        } else if (await team1.isOnTeam1(player2ID)) {
            await team1.changePlayer(player1ID, player2ID);
        } else if (await team2.isOnTeam2(player1ID)) {
            await team2.changePlayer(player2ID, player1ID);
        } else {
            await interaction.reply({ content: `The selected players are not on either team.`, ephemeral: true });
            return;
        }

        let message = `<@${user.id}> just swapped <@${player1ID}> for <@${player2ID}>. Use \`/teams\` to see new teams.`;
        await interaction.reply({ content: message });
    }   
};