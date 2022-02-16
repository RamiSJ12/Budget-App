const monthlyColumns = document.querySelector('.monthlyColumns')
const incomeInput = document.querySelector('[name="income"]')
const notesInput = document.querySelector('[name="notes"]')
const notebook = document.querySelector('.notebook')
const incomeAmountNumber = document.querySelector('.income')
const moneyLeft = document.querySelector('.money-left')
const totalExpenses = document.querySelector('.total-expenses')
const shoppingList = document.querySelectorAll('.list')
const inputsOfItems = document.querySelectorAll("input[data-item='item']")
const forms = document.querySelectorAll('form')
const totalSumSection = document.querySelector('.sum-section')
const notesButton = document.querySelector('.subheader_two h3')

const columnAmount = document.querySelectorAll('.amount')
const priceInputs = document.querySelectorAll("[name='sum']")

const FOOD = 'food'
const COFFEE_AND_OUT = 'coffee_and_out'
const TRAVEL = 'travel'
const SHOPPING = 'shopping'
const OTHER = 'other'

const user = {
  notes: [],
  income: 0,
  items: {
    [FOOD]: {
      list: [],
    },
    [COFFEE_AND_OUT]: {
      list: [],
    },
    [TRAVEL]: {
      list: [],
    },
    [SHOPPING]: {
      list: [],
    },
    [OTHER]: {
      list: [],
    },
  },
}

let columnsTotal = {
  [FOOD]: 0,
  [COFFEE_AND_OUT]: 0,
  [TRAVEL]: 0,
  [SHOPPING]: 0,
  [OTHER]: 0,
}

function salaryAmount(e) {
  user.income += parseFloat(e.currentTarget.value)

  incomeAmountNumber.textContent = user.income.toFixed(2)
  e.currentTarget.value = ''

  localStorage.setItem('Income', JSON.stringify(user.income))
  sumAllColumns(columnsTotal)
}

function valueOfItemPrice(e) {
  e.preventDefault()

  const el = e.currentTarget.querySelector('[name="sum"]')
  const attr = el.dataset.name
  const price = parseFloat(el.value)
  const name = document.getElementById(`${attr}`).value
  const paragraph = document.querySelector(`[data-name=${attr}]`)

  if (price > 0) {
    columnsTotal[attr] += price
    paragraph.textContent = columnsTotal[attr].toFixed(2)

    addItemToList(price, name, attr)
    displayTheList(user.items)
    sumAllColumns(columnsTotal)
  }
  this.reset()
}

function sumAllColumns(objectOfSum) {
  const total = Object.values(objectOfSum).reduce((acc, cur) => {
    return acc + cur
  }, 0)

  countMoneyLeft(user.income, total)
}

function countMoneyLeft(income, allExpences) {
  moneyLeft.textContent = (income - allExpences).toFixed(2)
  localStorage.setItem('Balance', (income - allExpences).toFixed(2))

  totalExpenses.textContent = allExpences.toFixed(2)
  localStorage.setItem('Total', JSON.stringify(allExpences.toFixed(2)))
}

function addItemToList(price, name, attribute) {
  const key = Object.keys(user.items).filter((key) => key === attribute)

  user.items[key].list.push({
    price,
    name,
  })
  addToLocalStorage(user.items)
}

function displayTheList(columns) {
  Object.entries(columns).forEach(([key, { list: valuesList }]) => {
    const list = document.querySelector(`ul[data-name=${key}]`)

    if (valuesList.length) {
      const html = valuesList.map(generateListHTML)
      const reversedList = html.reverse().join('')

      list.classList.add('open')
      list.innerHTML = reversedList
    } else {
      list.classList.remove('open')
      list.innerHTML = ``
    }
  })
}

function generateListHTML({ name, price }, id) {
  return `
    <li class="item shopping-item">
        <span data-delete="${id}" data-value=${price} class='delete'>x</span>
        <span>${name}</span>
        <span>${price} pln</span>
    </li>  
    `
}

function deleteItem(deletedValue, id, list) {
  const key = Object.keys(user.items).filter((key) => key === list.dataset.name)

  const newValue = user.items[key].list.filter((_, i) => i !== parseFloat(id))
  user.items[key].list = newValue

  updateAmount(list, deletedValue)
  displayTheList(user.items)
  addToLocalStorage(user.items)
}

function updateAmount(list, deletedValue) {
  const { name } = list.dataset
  const paragraph = document.querySelector(`[data-name=${name}]`)

  columnsTotal[name] -= deletedValue
  paragraph.textContent = columnsTotal[name].toFixed(2)

  sumAllColumns(columnsTotal)
}

function addToLocalStorage(columns) {
  Object.entries(columns).forEach(([key]) =>
    localStorage.setItem(`column - ${key}`, JSON.stringify(columns[key].list))
  )
}

function restoreFromLocalStorage(columns) {
  Object.entries(columns).forEach(([key, values]) => {
    if (key) {
      const items = JSON.parse(localStorage.getItem(`column - ${key}`)) || []

      columns[key].list.push(...items)
      displayTheList(columns)
    }

    const paragraph = document.querySelector(`[data-name=${key}]`)
    const sum = values.list.reduce((acc, curr) => acc + curr.price, 0)

    columnsTotal[key] += sum
    paragraph.textContent = columnsTotal[key].toFixed(2)
  })

  user.income = JSON.parse(localStorage.getItem('Income')) || 0
  incomeAmountNumber.textContent = parseFloat(user.income).toFixed(2)

  user.notes = JSON.parse(localStorage.getItem('Notebook')) || []
  displayNotes()

  sumAllColumns(columnsTotal)
}

function addToNotebook(e) {
  const el = e.currentTarget.value
  user.notes.push(el)
  displayNotes()
  localStorage.setItem('Notebook', JSON.stringify(user.notes))
  e.currentTarget.value = ''
}

function displayNotes() {
  notebook.innerHTML = user.notes
    .map((item, id) => {
      return `
      <li class="notebook__note">
        <div class="notebook__note_button" data-delete='${id}'>x</div>
        <p>${item}</p>
      </li>
    `
    })
    .join('')
}

function deleteNote(id) {
  user.notes = user.notes.filter((_, i) => i !== id)
  localStorage.setItem('Notebook', JSON.stringify(user.notes))

  displayNotes()
}

function openNotes() {
  monthlyColumns.classList.toggle('mobile_monthlyColumns-transform')
  totalSumSection.classList.toggle('mobile_monthlyColumns-transform')
  notesInput.classList.toggle('mobile_closedNotes')
  notebook.classList.toggle('mobile_closedNotes')
}

notesButton.addEventListener('click', openNotes)

forms.forEach((form) => form.addEventListener('submit', valueOfItemPrice))

notebook.addEventListener('click', function (e) {
  const id = parseInt(e.target.dataset.delete)
  if (!e.target.matches('div')) return
  deleteNote(id)
})

incomeInput.addEventListener('change', salaryAmount)
notesInput.addEventListener('change', addToNotebook)

shoppingList.forEach((list) => {
  list.addEventListener('click', (e) => {
    const id = e.target.dataset.delete
    const chosenValue = parseFloat(e.target.dataset.value)
    if (id) {
      deleteItem(chosenValue, id, list)
    }
  })
})

restoreFromLocalStorage(user.items)
displayTheList(user.items)
