import { SlashCommandBuilder } from 'discord.js';
import Player from '../model/playermodel.js';
import { getEmbed } from '../utils/embed.js';
import { createTablePlayer, createTableTeam1, createTableTeam2 } from '../database/db.js';
import emojis from '../utils/emojis.js';

const playersql = new Player('mydb.sqlite');

createTablePlayer();
createTableTeam1();
createTableTeam2();

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
            const userID = userWhoInteract.user.id;
            const userGlobalName = userWhoInteract.user.globalName;
        
            const findUser = await playersql.getPlayerByusername(userID);
            if (findUser.length > 0) {
                let userPrimaryRole = findUser[0].primary_role;
                let userSecondaryRole = findUser[0].secondary_role;
                
                if (primaryRole || secondaryRole) {
                    if ((primaryRole && secondaryRole) && (primaryRole != secondaryRole)) {
                        await playersql.updatePlayerPrimaryRole(primaryRole, userID);
                        await playersql.updatePlayerSecondaryRole(secondaryRole, userID);
                    }
                    else if ((primaryRole && !secondaryRole) || (primaryRole == secondaryRole)) {
                        await playersql.updatePlayerPrimaryRole(primaryRole, userID);
                        await playersql.updatePlayerSecondaryRole(null, userID);
                    } 
                    else if (secondaryRole && !primaryRole) {
                        if (secondaryRole == userPrimaryRole) {
                            await playersql.updatePlayerPrimaryRole(userSecondaryRole, userID);
                            await playersql.updatePlayerSecondaryRole(secondaryRole, userID);
                        } else {
                            await playersql.updatePlayerSecondaryRole(secondaryRole, userID);
                        }
                    }    

                    const userUpdated = await playersql.getPlayerByusername(userID);
                    const primaryEmoji = emojis[userUpdated[0].primary_role];
                    const secondaryEmoji = userUpdated[0].secondary_role ? emojis[userUpdated[0].secondary_role] : '';
            
                    embed.title = `${userGlobalName},`;
                    embed.description = `\`Roles updated:\` ${primaryEmoji}${secondaryEmoji}`;
                } else {
                    const user = await playersql.getPlayerByusername(userID);
                    const primaryEmoji = emojis[user[0].primary_role];
                    const secondaryEmoji = user[0].secondary_role ? emojis[user[0].secondary_role] : '';

                    embed.title = `${userGlobalName},`;
                    embed.description = `\`Current roles:\` ${primaryEmoji}${secondaryEmoji}`;
                }
            } else {
                embed.title = `${userGlobalName}, you haven't joined yet, use \`/join\`!`;
            }
            interaction.reply({ embeds: [embed], ephemeral: true} );
        }
}
