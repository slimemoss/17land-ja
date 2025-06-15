import * as z from "zod"

export const DatumSchema = z.object({
    "name": z.string(),
    "url": z.string(),
})
export type Datum = z.infer<typeof DatumSchema>

export const SetDataSchema = z.object({
    "data": z.array(DatumSchema),
    "scryfall_card_count": z.number(),
});
export type Sample = z.infer<typeof SetDataSchema>


export async function fetchSetData(code: string) {
  const url = "https://raw.githubusercontent.com/slimemoss/lands17-ja-set-data/refs/heads/publish/public_data/" + code.toLowerCase() + ".json"
  const resp = await fetch(url)
  const jsonData = await resp.json()
  return SetDataSchema.parse(jsonData).data
}


export const imageUrlDatabase = new class {
  imageUrls: {[key: string]: string} = {}
  fetched = new Set<string>()

  constructor() {}

  async update(expansion: string) {
    if(this.fetched.has(expansion)) {
      return
    }
    this.fetched.add(expansion)
    const data = await fetchSetData(expansion)
    this.imageUrls = {
      ...this.imageUrls,
      ...data.reduce((acc, item) => {
	acc[item.name] = item.url;
	return acc;
      }, {} as Record<string, string>)}

    const multi = Object.keys(data)
          .filter(key => key.includes(' // '))
          .reduce((prev, curr) => {
            return {...prev, [curr.split(' // ')[0]]: data[curr]}
          }, {} as Record<string, string>)
    this.imageUrls = {...this.imageUrls, ...multi}
  }

  has(name: string) {
    return name in this.imageUrls
  }

  url(name: string) {
    return this.imageUrls[name] ?? "https://backs.scryfall.io/small/5/9/597b79b3-7d77-4261-871a-60dd17403388.jpg?1665006177"
  }
}
