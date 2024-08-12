import { SlashCommandBuilder } from "discord.js";
import Player from '../model/playermodel.js';
import { getEmbed } from "../utils/embed.js";
import Team1 from '../model/team1model.js';
import Team2 from '../model/team2model.js';
import Spec from '../model/specmodel.js';

export default {
    data: new SlashCommandBuilder()
        .setName("swap")
        .setDescription("Swap a player drafted for another!")
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

        const player1Name = player1.globalName || player1.username;
        const player2Name = player2.globalName || player2.username;

        if (await isSpectator(specsql, player1.id, player1Name, interaction) || 
            await isSpectator(specsql, player2.id, player2Name, interaction)) {
            return;
        }

        if (!await isRegistered(playersql, player1.id, player1Name, interaction) ||
            !await isRegistered(playersql, player2.id, player2Name, interaction)) {
            return;
        }

        if (!await isCaptain(user.id, team1, team2, interaction)) {
            return;
        }

        await swapPlayers(team1, team2, player1.id, player2.id, interaction, user);
    }
};

async function isSpectator(specsql, playerId, playerName, interaction) {
    const isSpec = await specsql.searchSpec(playerId);
    if (isSpec) {
        await interaction.reply({ content: `${playerName} is marked as a spectator and cannot be picked.`, ephemeral: true });
        return true;
    }
    return false;
}

async function isRegistered(playersql, playerId, playerName, interaction) {
    const isPlayer = await playersql.getPlayerByusername(playerId);
    if (!isPlayer) {
        await interaction.reply({ content: `${playerName} is not registered and cannot be selected`, ephemeral: true });
        return false;
    }
    return true;
}

async function isCaptain(userId, team1, team2, interaction) {
    const team1Cap = await team1.getTeam1Cap();
    const team2Cap = await team2.getTeam2Cap();

    if (userId !== team1Cap.player && userId !== team2Cap.player) {
        await interaction.reply({ content: `You are not a captain!`, ephemeral: true });
        return false;
    }
    return true;
}

async function swapPlayers(team1, team2, player1ID, player2ID, interaction, user) {
    const team1HasPlayer1 = await team1.isOnTeam1(player1ID);
    const team2HasPlayer2 = await team2.isOnTeam2(player2ID);

    if (team1HasPlayer1 && team2HasPlayer2) {
        await team1.changePlayer(player2ID, player1ID);
        await team2.changePlayer(player1ID, player2ID);
    } else if (await team1.isOnTeam1(player2ID) && await team2.isOnTeam2(player1ID)) {
        await team1.changePlayer(player1ID, player2ID);
        await team2.changePlayer(player2ID, player1ID);
    } else if (team1HasPlayer1) {
        await team1.changePlayer(player2ID, player1ID);
    } else if (team2HasPlayer2) {
        await team2.changePlayer(player1ID, player2ID);
    } else {
        await interaction.reply({ content: `The selected players are not on either team.`, ephemeral: true });
        return;
    }

    await interaction.reply({
        content: `${user.username} just swapped <@${player1ID}> for <@${player2ID}>. Use \`/teams\` to see the new teams.`,
    });
}
