export async function listTypes(notion, blockId, type, list=[]) {
  const res = await notion.blocks.children.list({
    block_id: blockId,
  });
  res.results.forEach(async x => {
    if (x.type === type) list.push(x);
    list = list.concat(await listTypes(notion, x.id, type, list));
  });
  return list;
}