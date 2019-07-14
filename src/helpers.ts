import { parse } from "url";

export const inProd = process.env['NODE_ENV'] === 'production'
export const hash = (): string =>
  new Array(5)
    .fill(0)
    .reduce(
      (acc: string) =>
        (acc += Math.floor(Math.random() * 999 + 999).toString(16)),
      ''
    )

const rGetExt = new RegExp("\.(jpeg|jpg|tiff|gif|bmp|png|webp|svg|svgz)", "i")
export const ext = (url: string) => {
  const matches = rGetExt.exec(url)
  if(matches) return matches[1]
  else {
    debugger
    return "jpg"
  }
}

export const filterReps = <T>(arr: T[]): T[] => {
  const out: T[] = []
  for(const x of new Set(arr).values()) {
    out.push(x)
  }
  return out
}