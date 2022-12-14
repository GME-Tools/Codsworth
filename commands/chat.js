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
    buffer.push(text);
    if (buffer.length > 10) buffer.shift();
    
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: buffer.join('\n'),
        temperature: 0.7,
        max_tokens: 2048,
        n: 1
      });
    
      if (response.status === 200) {
        const res = response.data.choices[0].text;
        buffer.push(res);
        if (buffer.length > 10) buffer.shift();
        return await interaction.editReply("*Prompt: " + text + "*\n" + res);
      }
      else {
        return await interaction.editReply("Désolé, une erreur s'est produite")
      }
    } catch (error) {
      return await interaction.editReply("Désolé, une erreur s'est produite")
    }
 }
}
