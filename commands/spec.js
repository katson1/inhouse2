import { SlashCommandBuilder } from 'discord.js';
import Spec from '../model/specmodel.js';
import { createTableSpec } from '../database/db.js';

const specsql = new Spec('mydb.sqlite');

createTableSpec();

export default {
    data: new SlashCommandBuilder()
        .setName("spec")
        .setDescription("Set or remove yourself as spectator!"),


        async execute(interaction) {             
            const userID = interaction.user.id;

            let contentReply;
            
            let isSpec = await specsql.searchSpec(userID);

            if (!isSpec) {
                contentReply = `You have been added as a spectator.`
                await specsql.addAsSpec(userID);
            } else {
                contentReply = `You have been removed as a spectator.`
                await specsql.removeAsSpec(userID);
            }

            await interaction.reply({ content: contentReply, ephemeral: true });
        }
}
