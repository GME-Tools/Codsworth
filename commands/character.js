import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Client } from "@notionhq/client"
import { listTypes } from '../utils/notion_parser.js';

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
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('Display character sheet')
    ),
  execute: async (interaction) => {
    if (interaction.options.getSubcommand() === "create") {
      const uid = interaction.user.id;
      const response = await notion.databases.query({
        database_id: charID,
        filter: {
          property: 'ID',
          rich_text: {
            equals: uid
          }
        }
      });

      if (response.results.length > 0) {
        return await interaction.reply("A charater sheet is already attached to this user");
      }
  
      const create_response = await notion.pages.create({
        parent: {
          type: "database_id",
          database_id: charID
        },
        properties: {
          Nom: {title: [{text: {content: interaction.options.getString("name")}}]},
          ID: {rich_text: [{text: {content: uid}}]}
        }
      })
  
      return await interaction.reply("Character created");
    }

    if (interaction.options.getSubcommand() === 'view') {
      const uid = interaction.user.id;
      const response = await notion.databases.query({
        database_id: charID,
        filter: {
          property: 'ID',
          rich_text: {
            equals: uid
          }
        }
      });
      if (response.results.length === 0) {
        return await interaction.reply("No character sheet attached to this user, create one with /character create <name>");
      }
      
      const blockId = response.results[0].id;
      /*console.log(*/await listTypes(notion,blockId,'column')/*)*/
      /*const res = await notion.blocks.children.list({
        block_id: blockId,
      });
      res.results.filter(x => x.type === 'column_list').forEach(async x => {
        const res2 = await notion.blocks.children.list({
          block_id: x.id
        })
        res2.results.filter(x => x.type === 'column').forEach(async x => {
          const res3 = await notion.blocks.children.list({
            block_id: x.id
          });
          res3.results.filter(x => x.type === 'table').forEach(async x => {
            const res4 = await notion.blocks.children.list({
              block_id: x.id
            })
            res4.results.filter(x => x.type === 'table_row').forEach(async x => {
              console.log(x.table_row.cells)
            })
          })
        })
      });*/
    }
    return await interaction.reply("Rien à voir pour le moment");
  }
}