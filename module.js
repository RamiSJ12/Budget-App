export const months = [
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

export function chart(item) {
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
