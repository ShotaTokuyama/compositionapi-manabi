import { generatePlaygroundURL } from '~/utils/playground'

export function usePlaygroundUrl(code: string): string {
  return generatePlaygroundURL(code)
}
