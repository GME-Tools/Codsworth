import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('character')
    .setDescription('Character sheet management')
    /*.addSubcommand(subcommand => 
      subcommand
        .setName("create")
        .setDescription("Attach a new character sheet to the current user")
        .addStringOption(option => option.setName("Name").setDescription("Character Name").setRequired(true)))*/,
  execute: async (interaction) => {
    console.log(interaction)
    //await interaction.reply("Character created")
  }
}