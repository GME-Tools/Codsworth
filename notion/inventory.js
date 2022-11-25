import dotenv from 'dotenv';
import { Client } from "@notionhq/client"

dotenv.config();
const notion = new Client({ auth: process.env.NOTION_KEY });
const inventID = process.env.INVENTORY_DB_ID;

const separator = {
  type: 'text',
  text: { content: ', ', link: null},
  annotations: { bold: false, code: false, color: 'default', italic: false, strikethrough: false, underline: false },
  plain_text: ', ',
  href: null
}

function getValuesArray(res, prop) {
  return res.properties[prop].rollup.array.reduce((prev,curr) => {
    return prev.concat(curr.rich_text.filter(x => x.plain_text !== ', '))},
    []
  )
}

function interleave(arr) {
  return [].concat(...arr.map(n => [n, separator])).slice(0, -1)
}

function unique(value, index, self) {
  return self.findIndex(v => (v.plain_text === value.plain_text) || (v.plain_text.includes('Piercing') && value.plain_text.includes('Piercing'))) === index
}

function uniqueNoPierc(value, index, self) {
  return self.findIndex(v => (v.plain_text === value.plain_text) && !v.plain_text.includes('Piercing')) === index
}

function countPiercing(prev, curr) {
  return prev + (curr.plain_text.includes("Piercing")?parseInt(curr.plain_text.split(' ')[1]):0)
}

async function aggregateProperties(res, suffix) {
  const base = getValuesArray(res, "Base " + suffix).concat(getValuesArray(res, "Mods " + suffix));
  const basepierc = base.reduce(countPiercing, 0);
  const basemods = base.filter(unique);

  const remmods = getValuesArray(res, "Removed " + suffix);
  const rempierc = remmods.reduce(countPiercing, 0);
    
  let finalmods;
  const finalpierc = basepierc - rempierc;
  if (finalpierc === 0) finalmods = basemods.filter(el => unique(el, -1, remmods));
  else {
    finalmods = basemods.filter(el => uniqueNoPierc(el, -1, remmods));
    const index = finalmods.findIndex(el => el.plain_text.includes("Piercing"));
    if (index >= 0) {
      finalmods[index].plain_text = "Piercing " + finalpierc;
      finalmods[index].text.content = "Piercing " + finalpierc;
    }
  }

  return interleave(finalmods);    
}

async function inventoryManagerCore() {
  console.log("Updating ...");
  const response = await notion.databases.query({
    database_id: inventID,
    filter: {
      property: "Tags",
      rollup:{
        any: { multi_select: { contains: "Weapon" } }
      }
    }
  });

  for (const res of response.results) {
    const deprops = await aggregateProperties(res,"Damage Effects");
    const qprops = await aggregateProperties(res,"Qualities");
    
    await notion.pages.update({
      page_id: res.id,
      properties: {
        "Damage Effects": {rich_text: deprops},
        "Qualities": {rich_text: qprops}
      }
    });
  }
  console.log("Done");
}

export default function inventoryManager() {
  setInterval(inventoryManagerCore,5000)
}
