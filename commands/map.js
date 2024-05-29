import { SlashCommandBuilder } from "discord.js";
import { images } from '../utils/images.js';

let lastTwoMaps = [];
let lastMessageId = null;

export default {
    data: new SlashCommandBuilder()
        .setName("map")
        .setDescription("Sugere um mapa aleatório para jogo!"),

    async execute(interaction) {

        let randomImage;
        do {
            randomImage = images[Math.floor(Math.random() * images.length)];
        } while (lastTwoMaps.includes(randomImage));

        lastTwoMaps.push(randomImage);
        if (lastTwoMaps.length > 2) {
            lastTwoMaps.shift(); 
        }

        if (lastMessageId) {
            try {
                const channel = interaction.channel;
                const lastMessage = await channel.messages.fetch(lastMessageId);
                await lastMessage.delete();
            } catch (error) {
                console.error('Error deleting the last message:', error);
            }
        }

        const message = await interaction.reply({ content: `${randomImage}`, fetchReply: true });
        
        lastMessageId = message.id;

        await message.react('👍');
        await message.react('👎');
    }
};