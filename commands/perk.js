import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_KEY });
const dbID = process.env.PERK_DB_ID;

export const command = {
  data: new SlashCommandBuilder()
    .setName('perk')
    .setDescription('View details on perks and traits')
    .addStringOption(option =>
      option.setName("name")
        .setDescription("Name of the trait or perk")
        .setRequired(true)),
  execute: async (interaction) => {
    const name = interaction.options.getString("name");
    const response = await notion.databases.query({
      database_id: dbID,
      filter: {
        property: 'Nom',
        title: {
          equals: name
        }
      }
    });
    if (response.results.length == 0) {
      const embed = new EmbedBuilder()
        .setTitle('Perk & Traits')
        .setDescription(name + " Perk or Trait not found")
      await interaction.reply({embeds: [embed]})
    }
    else {
      const page = response.results[0];
      console.log(page.properties.Ranks);
      const embed = new EmbedBuilder()
        .setTitle(name)
        .setDescription(page.properties.Description.rich_text[0].plain_text)
        .setThumbnail(page.cover[page.cover.type].url)
        .addFields(
          {name: "Ranks", value: page.properties.Ranks.number.toString(), inline: true},
          {name: "Level", value: page.properties.Level.number.toString(), inline: true},
        )
      await interaction.reply({embeds: [embed]})
    }
  }
}