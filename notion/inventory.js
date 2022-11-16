import dotenv from 'dotenv';
import { Client } from "@notionhq/client"

dotenv.config();
const notion = new Client({ auth: process.env.NOTION_KEY });
const inventID = process.env.INVENTORY_DB_ID;

const separator = {
  type: 'text',
  text: { content: ', ', link: null},
  annotations: { bold: false, code: false, color: 'default', italic: 'false', strikethrough: false, underline: false },
  plain_text: ', ',
  href: null
}

function getValuesArray(res, prop) {
  return res.properties[prop].rollup.array.reduce((prev,curr) => {
    return prev.concat(curr.rich_text.filter(x => x.plain_text !== ', '))},
    []
  )
}

function interleave(arr, sep) {
  return [].concat(...arr.map(n => [n, sep])).slice(0, -1)
}

function unique(value, index, self) {
  return self.indexOf(value) === index;
}

async function inventoryManagerCore() {
  const response = await notion.databases.query({
    database_id: inventID,
    filter: {
      property: 'Mods',
      relation: {
        is_not_empty: true
      }
    }
  });
  for (const res of response.results) {
    const base = getValuesArray(res, "Base Damage Effects").concat(getValuesArray(res, "Mods Damage Effects"));
    const remmods = getValuesArray(res, "Removed Damage Effects");
    const basemods = base.filter(unique);
    console.log(basemods);
    console.log(remmods);
  }
}

export default function inventoryManager() {
  setInterval(inventoryManagerCore,5000)
}
