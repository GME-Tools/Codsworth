import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_KEY });
const dbID = process.env.AMMUNITION_DB_ID;
const dice = [1,2,0,0,1,1];

export const command = {
  data: new SlashCommandBuilder()
    .setName('loot')
    .setDescription('Loot objects'),
  execute: async (interaction) => {
    const response = await notion.databases.query({
      database_id: dbID
    });
    if (response.results.length == 0) {
      const embed = new EmbedBuilder()
        .setTitle("Loot")
        .setDescription("Loot not found")
      await interaction.reply({embeds: [embed]})
    }
    else {
      const pages = response.results;
      let objectsTab = [];

      for (let i = 0; i < pages.length; i++) {
        if (pages[i].properties.Rarity.number === 0) {
          for (let j = 1; j <= 7; j++) {
            objectsTab.push(page.properties.Nom.title[i].plain_text);
          }
        }
      }
      
      const page = pages[Math.floor(Math.random() * pages.length)];
      let quantityBonus = 0;

      for (let i = 0; i < page.properties.QuantityFoundRandom.number ; i++) {
        quantityBonus = quantityBonus + dice[Math.floor(Math.random() * 6)];
      }

      console.log(objectsTab);
      
      const embed = new EmbedBuilder()
        .setTitle(page.properties.Nom.title[0].plain_text)
.setThumbnail(page.cover[page.cover.type].url)
        .addFields(
          {name: "Quantity", value: page.properties.QuantityFoundFixed.number.toString() + " + " + quantityBonus.toString(), inline: true}
        )
      await interaction.reply({embeds: [embed]})
    }
  }
}