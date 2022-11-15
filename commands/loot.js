import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_KEY });
const dbID = process.env.AMMUNITION_DB_ID;
const dice = [1,2,0,0,1,1];
const rarity = [
  { rarity : 0, number: 7 },
  { rarity : 1, number: 6 }, 
  { rarity : 2, number: 5 }, 
  { rarity : 3, number: 4 }, 
  { rarity : 4, number: 3 },
  { rarity : 5, number: 2 },
  { rarity : 6, number: 1 }
];

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
      let page;
      let objectsTab = [];

      for (let i = 0; i < pages.length; i++) {
        for (let j = 0; j < rarity.length; j++) {
          if (pages[i].properties.Rarity.number === rarity[j].rarity) {
            for (let k = 0; k < rarity[j].number; k++) {
              objectsTab.push(pages[i].properties.Nom.title[0].plain_text);
            }
          }
        }
      }
      
      function random_sort(a, b) {
        return Math.random() - 0.5;
      }

      const objectsTabRandom = objectsTab.sort(random_sort);
      const objectRandom = objectsTabRandom[Math.floor(Math.random() * objectsTabRandom.length)];

      for (let i = 0; i < pages.length; i++) {
        if (objectRandom === pages[i].properties.Nom.title[0].plain_text) {
          page = pages[i];
        }
      }
      
      // const page = pages[Math.floor(Math.random() * pages.length)];
      let quantityBonus = 0;

      for (let i = 0; i < page.properties.QuantityFoundRandom.number ; i++) {
        quantityBonus = quantityBonus + dice[Math.floor(Math.random() * 6)];
      }

      console.log(objectRandom);
      console.log(page);
      
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