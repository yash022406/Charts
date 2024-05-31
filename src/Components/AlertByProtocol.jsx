import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AlertByInterface = ({ data }) => {
  const [chartData, setChartData] = useState(null); // Initialize as null

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      // Prepare data for the chart
      const categoryCounts = data.reduce((acc, currentItem) => {
        if (currentItem.in_iface) {
          const category = currentItem.proto;
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += 1;
        }
        return acc;
      }, {});

      // Filter entries with more than 1 frequency
      const filteredCounts = Object.keys(categoryCounts)
        .filter(key => categoryCounts[key] > 0)
        .reduce((acc, key) => {
          acc[key] = categoryCounts[key];
          return acc;
        }, {});

      // Format data for Chart.js
      const formattedChartData = {
        labels: Object.keys(filteredCounts),
        datasets: [
          {
            label: 'Number of Alerts',
            data: Object.values(filteredCounts),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };

      setChartData(formattedChartData);
    }
  }, [data]);

  if (!chartData) {
    // Render a loading indicator or message until chartData is ready
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col w-full items-center'>
      <h2 className='font-bold text-3xl my-6'>Alerts by type of Interface</h2>
      <div className='md:w-[60%] w-[80%] mt-4'>
      <Bar data={chartData} />
      </div>
    </div>
  );
};

export default AlertByInterface;
