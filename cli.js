#!/usr/bin/env node
const program = require('commander')
const api = require('./index')
const pkg = require('./package.json')

program
  .version(pkg.version)
program
  .command('add')
  .description('add a task')
  .action((...args) => {
    api.add(args.slice(0, -1).join(' ')).then(() => console.log('添加成功'))
  })
program
  .command('clear')
  .description('clear all tasks')
  .action(() => {
    api.clear().then(() => console.log('清除完毕'))
  })

program.parse(process.argv)

if (process.argv.length === 2) void api.showAll()