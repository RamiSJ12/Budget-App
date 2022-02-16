const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function chart(item) {
  const pie = document.getElementById('pieChart').getContext('2d')
  pie.canvas.width = 250
  pie.canvas.height = 250
  const gradientFirst = pie.createLinearGradient(320, 50, 100, 0)
  gradientFirst.addColorStop(0, '#e0b0cf')
  gradientFirst.addColorStop(0.31, '#d5b2d3')
  gradientFirst.addColorStop(0.65, '#beb5db')
  gradientFirst.addColorStop(1, '#94bbe9')

  const pieChart = new Chart(pie, {
    responsive: true,
    type: 'doughnut',
    data: {
      labels: ['Food', 'Coffee and Out', 'Other', 'Shopping', 'Travelling'],
      datasets: [
        {
          hover: true,
          hoverBorderWidth: 5,
          hoverBorderColor: '#00000',
          fill: true,
          backgroundColor: [
            gradientFirst,
            gradientFirst,
            gradientFirst,
            gradientFirst,
            gradientFirst,
          ],
          borderColor: 'rgb(255, 99, 132)',
          data: [
            item.food,
            item.coffeeAndOut,
            item.other,
            item.shopping,
            item.travel,
          ],
        },
      ],
    },
    options: {
      title: {
        display: false,
        text: `${item['month']} ${item['year']}`,
      },
      legend: {
        display: false,
      },

      cutoutPercentage: 30,
      animation: {
        animateScale: true,
      },
    },
  })

  const bar = document.getElementById('barChart').getContext('2d')
  bar.canvas.width = 400
  bar.canvas.height = 400
  const barChart = new Chart(bar, {
    backgroundColor: 'rgb(255,255, 255)',
    responsive: true,
    type: 'bar',
    data: {
      labels: ['Food', 'Coffee and Out', 'Other', 'Shopping', 'Travelling'],
      datasets: [
        {
          label: `${item['month']} ${item['year']}`,
          data: [
            item.food,
            item.coffeeAndOut,
            item.other,
            item.shopping,
            item.travel,
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  })
}

const saveButton = document.querySelector('button')
const buttons = document.querySelector('.button_wrap')
const history = document.querySelector('.history')
const modalOuter = document.querySelector('.modal-outer')
const modalInner = document.querySelector('.modal-inner')
const validationModal = document.querySelector('.validation')
const validationModalInner = document.querySelector('.validation-inner')
const MODAL_TIMER = 2000
let savedMonth = []

const now = new Date()
const monthIndex = now.getMonth() - 1
const month = months[monthIndex]
const year = now.getFullYear()

function addMonth() {
  const item = {
    month,
    year,
    income: JSON.parse(localStorage.getItem('Income')),
    total: JSON.parse(localStorage.getItem('Total')),
    food: getTotal('food'),
    coffeeAndOut: getTotal('coffee_and_out'),
    other: getTotal('other'),
    shopping: getTotal('shopping'),
    travel: getTotal('travel'),
    balance: JSON.parse(localStorage.getItem('Balance')),
    notes: JSON.parse(localStorage.getItem('Notebook')),
  }
  savedMonth.push(item)
  history.innerHTML = savedMonth.map(generateMonthsHTML).join('')
  localStorage.clear()
  localStorage.setItem('history', JSON.stringify(savedMonth))
}

function getNotes(notes) {
  return notes
    .map(
      (item) => `
      <li>${item}</li>
    `
    )
    .join('')
}

function getTotal(columnName) {
  const arr = JSON.parse(localStorage.getItem(`column - ${columnName}`))
  if (!arr) return 0
  return arr.reduce((prev, next) => prev + next.price, 0).toFixed(2)
}

function generateMonthsHTML({ month, year }) {
  return `<li data-month="${month}">${month} ${year}</li>`
}

function showMonthAnalysis(item) {
  const notes =
    !item.notes || item.notes.length === 0
      ? ''
      : `<ul>Notes: ${getNotes(item.notes)}</ul>`

  modalInner.innerHTML = `
    <span class='close-button'>x</span>
    <div>
        <h3>${item['month']} ${item['year']}</h3>
        <p>Income for ${item['month']} ${item['year']}: ${item.income} pln</p>
        <p>Spent Total: ${item.total} pln</p>
    </div>
    <div>
    <p>Food: ${item.food} pln</p>
    <p>Coffe and Out: ${item.coffeeAndOut} pln</p>
    <p>Other: ${item.other} pln</p>
    <p>Shopping: ${item.shopping} pln</p>
    <p>Travel: ${item.travel} pln</p>
    </div>
    ${notes}
    <p>Balance: ${item.balance} pln</p>
    `
  chart(item)

  modalOuter.classList.add('open')
  modalInner.classList.add('open')
  history.classList.add('visibility')
  buttons.classList.add('visibility')

  modalInner
    .querySelector('.close-button')
    .addEventListener('click', (e) =>
      removeClassesHandler(
        e,
        [buttons, history, modalInner, modalOuter],
        ['visibility', 'visibility', 'open', 'open']
      )
    )
}

function removeClassesHandler(e, elements, classes) {
  if (e.currentTarget === e.target || e.key === 'Escape') {
    elements.forEach((el, id) => el.classList.remove(classes[id]))
  }
}

function restoreFromLocalStorage() {
  savedMonth = JSON.parse(localStorage.getItem('history')) || []
  history.innerHTML = savedMonth.map(generateMonthsHTML).join('')
}

function validation() {
  const warningText = validationModalInner.querySelector(
    '.validation-inner_warning p'
  )
  const confirm = validationModalInner.querySelector(
    '.validation-inner_confirm'
  )
  const yesBtn = validationModalInner.querySelector('.yes_button')
  const noBtn = validationModalInner.querySelector('.no_button')

  warningText.textContent = `Are you ready to save month ${month} ${year} ? All data will be reset after you confirm`
  validationModal.classList.add('open')
  history.classList.add('visibility')

  yesBtn.addEventListener('click', () => {
    validationModalInner
      .querySelector('.validation-inner_warning')
      .classList.add('close')

    addMonth()
    confirm.classList.add('open')

    setTimeout(function () {
      validationModal.classList.remove('open')
      history.classList.remove('visibility')
      confirm.classList.remove('open')
    }, MODAL_TIMER)
  })

  noBtn.addEventListener('click', (e) =>
    removeClassesHandler(e, [history, validationModal], ['visibility', 'open'])
  )

  // We use window inside because validation modal is only avaible inside
  window.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      removeClassesHandler(
        e,
        [history, validationModal],
        ['visibility', 'open']
      )
    }
  })
}

function checkForMonth() {
  savedMonth.length === 0 || savedMonth[savedMonth.length - 1].month !== month
    ? validation()
    : alert('Oops this month has already been saved')
}

saveButton.addEventListener('click', () =>
  localStorage.getItem('Income')
    ? checkForMonth()
    : alert(
        "You don't have any data or income in your budget. You can't save this month"
      )
)

history.addEventListener('click', function (e) {
  savedMonth.forEach((month, id) => {
    const { month: monthName } = month
    if (monthName === e.target.dataset.month) {
      showMonthAnalysis(month)
    }
  })

  window.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      removeClassesHandler(
        e,
        [buttons, history, modalInner, modalOuter],
        ['visibility', 'visibility', 'open', 'open']
      )
    }
  })
})

modalOuter.addEventListener('click', (e) =>
  removeClassesHandler(
    e,
    [buttons, history, modalInner, modalOuter],
    ['visibility', 'visibility', 'open', 'open']
  )
)

validationModal.addEventListener('click', (e) =>
  removeClassesHandler(e, [history, validationModal], ['visibility', 'open'])
)

restoreFromLocalStorage()
