import { SlashCommandBuilder } from "discord.js";

const images = [
    "https://blz-contentstack-images.akamaized.net/v3/assets/blt0e00eb71333df64e/blt9b50b8ceae7a8483/65cacbe7857c8c74b1990f7d/media_gallery_1.webp?",
    "https://blz-contentstack-images.akamaized.net/v3/assets/blt0e00eb71333df64e/blt06cd2eadefbbacf1/65cacbe7492c0f8557bb4062/media_gallery_2.webp?",
    "https://blz-contentstack-images.akamaized.net/v3/assets/blt0e00eb71333df64e/bltb7d581ff87a9230c/65cacbe788b8ab45d859c1c0/media_gallery_3.webp?",
    "https://blz-contentstack-images.akamaized.net/v3/assets/blt0e00eb71333df64e/blt688ca0a519faab47/65cacbe7af7bc95b49c94620/media_gallery_4.webp?",
    "https://blz-contentstack-images.akamaized.net/v3/assets/blt0e00eb71333df64e/blt6935b1ed03ecaab8/65cacbe7b3fe315681b54455/media_gallery_5.webp?",
    "https://blz-contentstack-images.akamaized.net/v3/assets/blt0e00eb71333df64e/bltd5e30354a77232df/65cacbe8653c6888ef99f116/media_gallery_7.webp?",
    "https://blz-contentstack-images.akamaized.net/v3/assets/blt0e00eb71333df64e/blt8ddd357385a0d5cb/65cacbe8d44e9b4cf0e43b5f/media_gallery_8.webp?",
    "https://blz-contentstack-images.akamaized.net/v3/assets/blt0e00eb71333df64e/blt211517a9020bf883/65cacbe8b3fe3182a9b54459/media_gallery_10.webp?",
    "https://blz-contentstack-images.akamaized.net/v3/assets/blt0e00eb71333df64e/blt94d55eea54a186a1/65cacbebe469d005498381ea/media_gallery_12.webp?"
];

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
