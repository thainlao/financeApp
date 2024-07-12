import React from 'react';
import { useAppSelector } from '../../../src/store/hoocs';
import { IFinance } from '../../../shared/utils/types';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/graph.css';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graph: React.FC = () => {
    const userFinances: IFinance[] = useAppSelector((state: any) => state.userFinance.userFinances);

    const financeData = userFinances.map((finance) => {
        const latestUpdate = finance.monthly_updates.length > 0
            ? finance.monthly_updates[finance.monthly_updates.length - 1].price
            : finance.started_price;
        return {
            type: finance.type,
            price: latestUpdate,
        };
    });

    const financeTypes = [...new Set(financeData.map((data) => data.type))];

    const financeTypesCount = financeTypes.map((type) => {
        return financeData.filter((data) => data.type === type).reduce((sum, data) => sum + data.price, 0);
    });

    const data = {
        labels: financeTypes,
        datasets: [
            {
                label: 'Total Price by Type',
                data: financeTypesCount,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ]
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Distribution of Finance Types by Total Price',
            },
        },
    };

    return (
        <div className="graph-container">
            <h2>Finance Types Distribution by Total Price</h2>
            <Bar data={data} options={options} />
        </div>
    );
}

export default Graph;
