import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Casualties Over Time',
    },
  },
};

const calculateCasualties = (peopleAffected: number): number => {
  return peopleAffected / 10;
};

const defaultData = [
  calculateCasualties(20000),
  calculateCasualties(40000),
  calculateCasualties(60000),
  calculateCasualties(80000),
  calculateCasualties(100000),
  calculateCasualties(170000),
  calculateCasualties(130000),
];

type LineChartProps = {
  inputData?: number[];
  day?: number;
};

export function LineChart({ inputData = defaultData, day = 1 }: LineChartProps) {
  const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  const [chartData, setChartData] = useState({
    labels,
    datasets: [
      {
        label: 'Casualties',
        data: inputData,
        borderColor: 'rgb(0, 151, 255)',
        backgroundColor: 'rgba(0, 151, 255, 0.5)',
      },
    ],
  });

  useEffect(() => {
    // Update chart when inputData or day changes
    setChartData({
      labels,
      datasets: [
        {
          label: 'Casualties',
          data: inputData,
          borderColor: 'rgb(0, 151, 255)',
          backgroundColor: 'rgba(0, 151, 255, 0.5)',
        },
      ],
    });
  }, [inputData, day]);

  return <Line options={options} data={chartData} />;
}
