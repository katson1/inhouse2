import { SlashCommandBuilder } from "discord.js";
import Player from '../model/playermodel.js';
import { getEmbed } from "../utils/embed.js";
import Team1 from '../model/team1model.js';
import Team2 from '../model/team2model.js';
import MatchController from '../model/matchcontroller.js';

const playersql = new Player('mydb.sqlite');
const team1 = new Team1('mydb.sqlite');
const team2 = new Team2('mydb.sqlite');

export default {
    data: new SlashCommandBuilder()
        .setName("pick")
        .setDescription("Add a player!")
        .addUserOption(option =>
            option.setName('player')
                .setDescription('Add the player!')
                .setRequired(true)),

    async execute(interaction) {
        const guild = interaction.guild;
        const channelName = "lobby";
        var channel = null;
        const user = interaction.user.username;
        const player = interaction.options.getUser('player').username;
        const result = await playersql.getPlayerByusername(player);

        for (const [chave, canal] of guild.channels.cache.entries()) {
            if (canal.type === 2 && canal.name === channelName) {
                channel = (canal);
            }
        }

        if (!channel) {
            await interaction.reply("Canal não encontrado!");
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

        if(user == team1Cap.player || user == team2Cap.player){
            await interaction.reply(`You are not a captain!`);
            return;
        }

        if (members.includes(player)) {
            if (playerAlreadyPickedTeam1 || playerAlreadyPickedTeam2) {
                await interaction.reply(`${player} has already been picked`);
                return;
            } else {
                if (teamOne.lenght > teamTwo.lenght) {
                    if (user == team1Cap.player) {
                        await interaction.reply({ content: `Isn't your time to pick!`, ephemeral: true });
                        return;
                    }
                    team2.insertPlayerOnTeam2(player);

                    updatedTeam2 = await team2.getTeam2(); 
                    if (updatedTeam2.lenght == 5) {
                        await interaction.reply(`Teams reeeeeeeeaaaaaaaaaaaaady baby!!!!!!!!!!!!!!!`);
                        return;
                    }
                } else if (teamOne.lenght == teamTwo.lenght) {
                    if (user == team2Cap.player) {
                        await interaction.reply({ content: `Isn't your time to pick!`, ephemeral: true });
                        return;
                    }
                    team1.insertPlayerOnTeam1(player)
                }
                pickEmbed.title = `${user} picked: ${player}`;
            }
        } else {
            pickEmbed.title = `${player} isn't on the lobby channel`;
        }

        await interaction.reply({ embeds: [pickEmbed] });
    }
}
