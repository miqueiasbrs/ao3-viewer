import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ObsidianUtils } from '../../utils/obsidian-utils.js'

const currentFile = fileURLToPath(import.meta.url)
const currentDir = dirname(currentFile)
const projectRoot = resolve(currentDir, '../../../')

const layoutTemplatePath = resolve(projectRoot, 'templates/layout.html')
const homePageTemplatePath = resolve(projectRoot, 'templates/pages/home.html')
const notFoundPageTemplatePath = resolve(projectRoot, 'templates/pages/not-found.html')
const chapterPageTemplatePath = resolve(projectRoot, 'templates/pages/chapters.html')

export const renderTemplate = (template: string, data: Record<string, string>) => {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => {
    return data[key] ?? ''
  })
}

export const renderDefaultLayout = (data: Record<string, string> = {}) => {
  const layoutTemplate = readFileSync(layoutTemplatePath, 'utf8')

  data.chapters = ObsidianUtils.listMDFilesInDirectory(process.env.OBSIDIAN_VAULT_PATH ?? '')
    .map((i) => `<option value="${Buffer.from(i).toString('base64url')}">${i}</option>`)
    .join('')
  return renderTemplate(layoutTemplate, data)
}

export const renderHomePage = () => {
  const homePageTemplate = readFileSync(homePageTemplatePath, 'utf8')
  return renderDefaultLayout({
    title: 'Home',
    content: homePageTemplate
  })
}

export const renderNotFoundPage = () => {
  const notFoundPageTemplate = readFileSync(notFoundPageTemplatePath, 'utf8')
  return renderDefaultLayout({
    title: 'Page Not Found',
    content: notFoundPageTemplate
  })
}

export const renderChapterPage = (title: string, content: string, prevChapter?: string, nextChapter?: string) => {
  const chapterPageTemplate = readFileSync(chapterPageTemplatePath, 'utf8')
  return renderDefaultLayout({
    title,
    content: renderTemplate(chapterPageTemplate, {
      content
    }),
    prevChapter: prevChapter ? Buffer.from(prevChapter).toString('base64url') : '',
    nextChapter: nextChapter ? Buffer.from(nextChapter).toString('base64url') : '',
    disabledPrev: prevChapter ? '' : 'disabled',
    disabledNext: nextChapter ? '' : 'disabled'
  })
}
