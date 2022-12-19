import { SlashCommandBuilder } from 'discord.js';
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const command = {
  data: new SlashCommandBuilder()
    .setName('image')
    .setDescription('Image generation')
    .addStringOption(option =>
      option.setName("prompt")
        .setDescription("Describe the image you want")
        .setRequired(true)),
  execute: async (interaction) => {
    const text = interaction.options.getString("prompt");
    await interaction.reply('...');
    
    try {
      const response = await openai.createImage({
        prompt: text,
        n: 1,
        size: "1024x1024",
      });

      if (response.status === 200) {
        return await interaction.editReply("*Prompt: " + text + "*\n" + response.data.data[0].url);
      }
      else {
        return await interaction.editReply("Désolé, une erreur s'est produite")
      }  
    } catch(error) {
      return await interaction.editReply("Désolé, une erreur s'est produite")
    }

    
 }
}
