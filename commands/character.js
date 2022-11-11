import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_KEY });
const charID = process.env.CHARACTER_DB_ID;

export const command = {
  data: new SlashCommandBuilder()
    .setName('character')
    .setDescription('Character sheet management')
    .addSubcommand(subcommand => 
      subcommand
        .setName('create')
        .setDescription('Attach a new character sheet to the current user')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Character Name')
            .setRequired(true)
        )
    ),
  execute: async (interaction) => {
    const uid = interaction.user.id;
    
    console.log(interaction)
    await interaction.reply("Character created")
  }
}