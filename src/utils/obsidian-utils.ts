import { readdirSync, readFileSync } from 'node:fs'

export const ObsidianUtils = {
  listMDFilesInDirectory: (directoryPath: string): string[] => {
    const files = readdirSync(directoryPath)
    return files.filter((file) => file.endsWith('.md'))
  },

  readMDFileContent: (filename: string, directoryPath: string): string => {
    return readFileSync(directoryPath.concat('/', filename), 'utf8')
  }
}
