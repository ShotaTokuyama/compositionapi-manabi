import { strToU8, zlibSync, strFromU8 } from 'fflate'

function utoa(data: string): string {
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return btoa(binary)
}

export function generatePlaygroundURL(sfcCode: string): string {
  const files = { 'App.vue': sfcCode }
  return `https://play.vuejs.org/#${utoa(JSON.stringify(files))}`
}
