import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
    indexAxis: 'y' as const,
    elements: {
        bar: {
            borderWidth: 2,
        },
    },
    responsive: true,
    plugins: {
        legend: {
            display: false,
            position: 'right' as const,
        },
        title: {
            display: false,
            text: 'Chart.js Horizontal Bar Chart',
        },
        chartAreaBorder: {
            borderColor: 'red',
            borderWidth: 2,
            borderDash: [5, 5],
            borderDashOffset: 2,
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
};

const labels = ['January', 'February', 'March', 'April', 'May'];

export const data = {
    labels,
    datasets: [
        {
            labels,
            data: [500, 300, 375, 250, 100],
            borderColor: 'rgb(135, 208, 104)',
            backgroundColor: [
                '#2b8337',
                'rgba(135, 208, 104, 0.2)',
                'rgba(135, 208, 104, 0.4)',
                'rgba(135, 208, 104, 0.55)',
                'rgba(135, 208, 104, 0.75)',
                'rgba(135, 208, 104, 0.9)',
            ],
        }
    ],
};

export default function ChartHorizontalBar() {
    return <Bar options={options} data={data} />
}