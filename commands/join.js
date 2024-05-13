import { SlashCommandBuilder } from 'discord.js';
import Player from '../model/playermodel.js';
import { getEmbed } from '../utils/embed.js';
import { createMatchController, createTablePlayer, createTableTeam1, createTableTeam2 } from '../database/db.js';
import emojis from '../utils/emojis.js';

const playersql = new Player('mydb.sqlite');

createTablePlayer();
createTableTeam1();
createTableTeam2();
createMatchController();

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
                    { name: 'Pro', value: 'pro' }))
        .addStringOption(option =>
            option.setName('primary_role')
                .setDescription('Select your primary role.')
                .setRequired(true)
                .addChoices(
                    { name: 'Bruiser', value: 'bruiser' },
                    { name: 'Tank', value: 'tank' },
                    { name: 'Healer', value: 'healer' },
                    { name: 'Ranged Assassin', value: 'ranged' },
                    { name: 'Meele Assassin', value: 'meele' }
                ))
        .addStringOption(option =>
            option.setName('secondary_role')
                .setDescription('Select your second role.')
                .setRequired(false)
                .addChoices(
                    { name: `Bruiser`, value: 'bruiser' },
                    { name: `Tank`, value: 'tank' },
                    { name: `Healer`, value: 'healer' },
                    { name: `Ranged Assassin`, value: 'ranged' },
                    { name: `Meele Assassin`, value: 'meele' }
                )),

        async execute(interaction) {
            const rank = interaction.options.getString('rank');
            const primaryRole = interaction.options.getString('primary_role');
            let secondaryRole = interaction.options.getString('secondary_role');
              
            let embed = getEmbed();
            const userToAdd = interaction.guild.members.cache.get(interaction.user.id);
            let userUsername = userToAdd.user.username;
            embed.title = `${userUsername} just joined inhouse!`;
        
            const primaryEmoji = emojis[primaryRole];
            const secondaryEmoji = secondaryRole ? emojis[secondaryRole] : '';
        
            embed.description = `rank: \`${rank}\` - ${primaryEmoji} ${secondaryRole ? secondaryEmoji : ''}`;
        
            const findUser = await playersql.getPlayerByusername(userUsername);
            if (findUser.length > 0) {
                console.log(findUser);
                const primaryEmoji = emojis[findUser[0].primary_role];
                const secondaryEmoji = emojis[findUser[0].second_role];
                
                embed.title = `${userUsername}, you have already joined:`;
                embed.description = `\`MMR ${findUser[0].mmr}\` - ${primaryEmoji} ${secondaryEmoji ? secondaryEmoji : ''}`;
            } else {
                let mmr;
                switch (rank) {
                    case 'gold':
                        mmr = 1700;
                        break;
                    case 'plat':
                        mmr = 1800;
                        break;
                    case 'diamond':
                        mmr = 1900;
                        break;
                    case 'master':
                        mmr = 2075;
                        break;
                    case 'pro':
                        mmr = 2150;
                        break;
                }
                if (mmr) {
                    await playersql.createPlayer(userUsername, mmr, primaryRole, secondaryRole);
                }
            }
            interaction.reply({ embeds: [embed]});
        }
}
