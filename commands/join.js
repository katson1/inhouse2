import { SlashCommandBuilder } from 'discord.js';
import Player from '../model/playermodel.js';
import { getEmbed } from '../utils/embed.js';
import { createTablePlayer } from '../database/db.js';

const playersql = new Player('mydb.sqlite');

createTablePlayer();

export default {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Shows player rankings!")
        .addStringOption(option =>
            option.setName('rank')
                .setDescription('Select your rank.')
                .setRequired(true)
                .addChoices(
                    { name: 'Gold', value: 'gold' },
                    { name: 'Platinum', value: 'plat' },
                    { name: 'Diamond', value: 'diamond' },
                    { name: 'Master', value: 'master' },
                    { name: 'Pro', value: 'pro' })),

    async execute(interaction){
        const option = interaction.options.getString('rank');
        let embed = getEmbed();
        const userToAdd = interaction.guild.members.cache.get(interaction.user.id);
        let userUsername = userToAdd.user.username;
        embed.title = `${userUsername} joinned inhouse: ${option}`;
        const findUser = await playersql.getPlayerByusername(userUsername);
        if (findUser) {
            embed.title = `${userUsername} is joinned: \`MMR ${findUser[0].mmr}\``;
        } else {
            switch (option) {
                case 'gold':
                    await playersql.createPlayer(userUsername, 1700);
                    break;
                case 'plat':
                    await playersql.createPlayer(userUsername, 1800);
                    break;
                case 'diamond':
                    await playersql.createPlayer(userUsername, 1900);
                    break;
                case 'master':
                    await playersql.createPlayer(userUsername, 2075);
                    break;
                case 'pro':
                    await playersql.createPlayer(userUsername, 2150);
                    break;
            }
        }
        interaction.reply({ embeds: [embed]});
    }
}
