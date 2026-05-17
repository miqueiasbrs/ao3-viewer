import { renderChapterPage } from '../../modules/services/template-service.js'
import { ObsidianUtils } from '../../utils/obsidian-utils.js'
import type { RouteHandler } from '../types.js'
import { notFoundHandler } from './not-found-handler.js'

export const chaptersHandler: RouteHandler = (req, res) => {
  const encodedChapter = req.url?.split('/').pop()
  if (!encodedChapter) return notFoundHandler(req, res)

  try {
    const chapterName = Buffer.from(encodedChapter, 'base64url').toString('utf-8')
    const rawContent = ObsidianUtils.readMDFileContent(chapterName, process.env.OBSIDIAN_VAULT_PATH ?? '')

    const chapters = ObsidianUtils.listMDFilesInDirectory(process.env.OBSIDIAN_VAULT_PATH ?? '')
    const idx = chapters.indexOf(chapterName)
    const prevChapter = idx > 0 ? chapters[idx - 1] : undefined
    const nextChapter = idx < chapters.length - 1 ? chapters[idx + 1] : undefined

    const convertedContent = parseMDContentToHTML(rawContent)
    const html = renderChapterPage(
      chapterName.replace('.md', ''),
      `<h1>${chapterName.replace('.md', '')}</h1>`.concat(convertedContent),
      prevChapter,
      nextChapter
    )
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    res.end(html)
  } catch {
    return notFoundHandler(req, res)
  }
}

function parseMDContentToHTML(mdContent: string) {
  return mdContent
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => {
      if (line === '---') return '<div class="el-hr"><hr /></div>'

      return `<div class="el-p"><p dir="auto">${line
        .replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1</strong>')
        .replace(/_([^_]+)_|\*([^*]+)\*/g, '<em>$1</em>')}</p></div>`
    })
    .join('\n')
}
