export async function listTypes(notion, blockId, type, list=[]) {
  const res = await notion.blocks.children.list({
    block_id: blockId,
  });
  for (let x of res.results) {
    if (x.type === type) list.push(x);
    list = list.concat(await listTypes(notion, x.id, type, list));
  }
  console.log(list);
  return list;
}