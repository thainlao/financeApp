import React from 'react';
import { useAppSelector } from '../../../src/store/hoocs';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartData,
} from 'chart.js';
import '../styles/donat.css';
import { IFinance, FinanceType, IUser } from '../../../shared/utils/types';

ChartJS.register(ArcElement, Tooltip, Legend);

const Donat: React.FC = () => {
    const userFinances: IFinance[] = useAppSelector((state: any) => state.userFinance.userFinances);

    const prepareChartData = (finances: IFinance[]): ChartData<'pie'> => {
        const typesTotalPrice = finances.reduce((acc: Record<FinanceType, number>, finance) => {
            const latestUpdate = finance.monthly_updates.length > 0
                ? finance.monthly_updates[finance.monthly_updates.length - 1].price
                : finance.started_price;
            acc[finance.type] = (acc[finance.type] || 0) + latestUpdate;
            return acc;
        }, {} as Record<FinanceType, number>);

        const data = {
            labels: Object.keys(typesTotalPrice),
            datasets: [{
                data: Object.values(typesTotalPrice),
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
            }]
        };

        return data;
    };

    const chartData = prepareChartData(userFinances);

    return (
        <div className="donat">
            <div className="chart-container">
                <Pie data={chartData} />
            </div>
        </div>
    );
}

export default Donat;
