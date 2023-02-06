const { exec } = require('child_process')
const fs = require('fs').promises
const readline = require('readline')
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const runCommand = cmd => new Promise((resolve, reject) =>
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      reject(error)
    } else {
      resolve(stdout)
    }
  })
)

const yellow = str => `\x1b[33m${str}\x1b[0m`
const grey = str => `\x1b[90m${str}\x1b[0m`
const dim = str => `\x1b[2m${str}\x1b[0m`


const ask = (question, isValidAnswer, invalidAnswerErrorMsg) => (defaultValue='') => {
  const askOnce = () => new Promise((resolve, reject) => {
    rl.question(question + '\n' + (defaultValue ? grey(`(${defaultValue}) `) : ''), (answer) => {
      if (defaultValue && !answer) {
        resolve(defaultValue)
        return
      }
      if (isValidAnswer(answer)) {
        resolve(answer)
      } else {
        reject()
      }
    })
  })
    .catch(() => {
      console.log(invalidAnswerErrorMsg)
      return askOnce()
    })

  return askOnce()
}

const log = (fn, msg) => () => (console.log(msg), fn())

const isString = str => typeof str === 'string'
const isKebabCase = str => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(str)
const toEnglish = str => str.replace(/[^a-zA-Z0-9 ]/g, '')

const askTitle = ask(yellow('What is the title of the post?'), isString, 'Invalid title.')
const askFileName = ask(yellow('What is the file name of the post?'), isKebabCase, 'Invalid title.')

const toKebabCase = str => str.toLowerCase().replace(/ /g, '-').replace(/'/g, '')

const toPostDirectory = name => `content/blog/${name}`
const createPostDirectory = name => () => fs.mkdir(toPostDirectory(name))

const fillPost = (fileName, title, date) => () => fs.writeFile(
  `${toPostDirectory(fileName)}/index.md`,
  `---
title: ${title}
date: "${date}"
description:
tags:
---
`
)

const copy = (src, dst) => () => runCommand(`cp -a ${src}/. ${dst}`)

const logDuration = (fn, format) => async () => {
  const startTime = new Date().getTime()
  await fn()
  const endTime = new Date().getTime()
  console.log(format(endTime - startTime))
}

const main = logDuration(
  async () => {
    const title = await askTitle()

    const defaultFileName = toKebabCase(toEnglish(title))
    const fileName = await askFileName(defaultFileName)
    const date = new Date().toISOString()
    await log(createPostDirectory(fileName), dim(`Creating post directory: ${toPostDirectory(fileName)} ...`))()
    await log(copy('scripts/templates', toPostDirectory(fileName)), dim(`Copying template files ...`))()
    await log(fillPost(fileName, title, date), dim(`Filling post ...`))()
    rl.close()
  },
  duration => dim(`Done in ${duration}ms.`)
)

main()