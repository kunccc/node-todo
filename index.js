const db = require('./db')
const inquirer = require('inquirer')

module.exports.add = async (title) => {
  const list = await db.read()
  list.push({title, done: false})
  await db.write(list)
}

module.exports.clear = async () => {
  await db.write([])
}

const done = (list, index) => {
  list[index].done = true
  void db.write(list)
}
const notDone = (list, index) => {
  list[index].done = false
  void db.write(list)
}
const rename = (list, index) => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: '新的标题',
        default: list[index].title
      }
    ]).then(answer3 => {
    list[index].title = answer3.title
    void db.write(list)
  })
}
const remove = (list, index) => {
  list.splice(index, 1)
  void db.write(list)
}
const askForAction = (list, index) => {
  const actions = {done, notDone, rename, remove}
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: '请选择操作',
        choices: [
          {name: '已完成', value: 'done'},
          {name: '未完成', value: 'notDone'},
          {name: '重命名', value: 'rename'},
          {name: '删除', value: 'remove'},
          {name: '退出', value: 'quit'}
        ]
      },
    ]).then(answer2 => actions[answer2.action](list, index))
}
const createTask = list => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: '输入任务标题'
      }
    ]).then(answer4 => {
    list.push({title: answer4.title, done: false})
    void db.write(list)
  })
}
const showTasks = list => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'index',
        message: '请选择你想操作的任务',
        choices: [...list.map((task, index) => {
          return {name: `${task.done ? '[x]' : '[_]'} ${index + 1} - $${task.title}`, value: index.toString()}
        }), {name: '+ 创建任务', value: '-2'}, {name: '退出', value: '-1'}]
      },
    ])
    .then(answer => {
      const index = parseInt(answer.index)
      if (answer.index >= 0) askForAction(list, index)
      else if (index === -2) createTask(list)
    })
}

module.exports.showAll = async () => {
  const list = await db.read()
  showTasks(list)
}