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
        .setName("roles")
        .setDescription("Show or change your roles!")
        .addStringOption(option =>
            option.setName('primary_role')
                .setDescription('Select your primary role.')
                .setRequired(false)
                .addChoices(
                    { name: 'Bruiser', value: 'bruiser' },
                    { name: 'Tank', value: 'tank' },
                    { name: 'Healer', value: 'healer' },
                    { name: 'Ranged Assassin', value: 'ranged' },
                    { name: 'Meele Assassin', value: 'meele' }
                ))
        .addStringOption(option =>
            option.setName('secondary_role')
                .setDescription('Change your second role.')
                .setRequired(false)
                .addChoices(
                    { name: `Bruiser`, value: 'bruiser' },
                    { name: `Tank`, value: 'tank' },
                    { name: `Healer`, value: 'healer' },
                    { name: `Ranged Assassin`, value: 'ranged' },
                    { name: `Meele Assassin`, value: 'meele' }
                )),

        async execute(interaction) {
            const primaryRole = interaction.options.getString('primary_role');
            const secondaryRole = interaction.options.getString('secondary_role');
        
            const embed = getEmbed();
            const userWhoInteract = interaction.guild.members.cache.get(interaction.user.id);
            const userUsername = userWhoInteract.user.username;
        
            const findUser = await playersql.getPlayerByusername(userUsername);
            if (findUser.length > 0) {
                let userPrimaryRole = findUser[0].primary_role;
                let userSecondaryRole = findUser[0].secondary_role;
                
                if (primaryRole || secondaryRole) {
                    if ((primaryRole && secondaryRole) && (primaryRole != secondaryRole)) {
                        await playersql.updatePlayerPrimaryRole(primaryRole, userUsername);
                        await playersql.updatePlayerSecondaryRole(secondaryRole, userUsername);
                    }
                    else if ((primaryRole && !secondaryRole) || (primaryRole == secondaryRole)) {
                        await playersql.updatePlayerPrimaryRole(primaryRole, userUsername);
                        await playersql.updatePlayerSecondaryRole(null, userUsername);
                    } 
                    else if (secondaryRole && !primaryRole) {
                        if (secondaryRole == userPrimaryRole) {
                            await playersql.updatePlayerPrimaryRole(userSecondaryRole, userUsername);
                            await playersql.updatePlayerSecondaryRole(secondaryRole, userUsername);
                        } else {
                            await playersql.updatePlayerSecondaryRole(secondaryRole, userUsername);
                        }
                    }    

                    const userUpdated = await playersql.getPlayerByusername(userUsername);
                    const primaryEmoji = emojis[userUpdated[0].primary_role];
                    const secondaryEmoji = userUpdated[0].secondary_role ? emojis[userUpdated[0].secondary_role] : '';
            
                    embed.title = `${userUsername},`;
                    embed.description = `\`Roles updated:\` ${primaryEmoji}${secondaryEmoji}`;
                } else {
                    const user = await playersql.getPlayerByusername(userUsername);
                    const primaryEmoji = emojis[user[0].primary_role];
                    const secondaryEmoji = user[0].secondary_role ? emojis[user[0].secondary_role] : '';

                    embed.title = `${userUsername},`;
                    embed.description = `\`Current roles:\` ${primaryEmoji}${secondaryEmoji}`;
                }
            } else {
                embed.title = `${userUsername}, you haven't joined yet, use \`/join\`!`;
            }
            interaction.reply({ embeds: [embed]});
        }
}
