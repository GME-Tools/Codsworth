import { SlashCommandBuilder } from 'discord.js';
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
let buffer=[];

export const command = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Chat with Codsworth')
    .addStringOption(option =>
      option.setName("prompt")
        .setDescription("What you say to Codsworth")
        .setRequired(true)),
  execute: async (interaction) => {
    await interaction.reply('...');
    const text = interaction.options.getString("prompt");
    buffer.push({role: "user", content: text});
    if (buffer.length > 10) buffer.shift();
  
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: buffer
      });
    
      if (response.status === 200) {
        const res = response.data.choices[0].message;
        buffer.push(res);
        if (buffer.length > 10) buffer.shift();
        return await interaction.editReply("*Prompt: " + text + "*\n" + res.content);
      }
      else {
        return await interaction.editReply("Désolé, une erreur s'est produite")
      }
    } catch (error) {
      return await interaction.editReply("Désolé, une erreur s'est produite")
    }
 }
}
