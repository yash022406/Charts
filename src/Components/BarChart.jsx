import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const PieChart = ({ data }) => {
  const [chartData, setChartData] = useState(null); // Initialize as null

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      // Prepare data for the chart
      const categoryCounts = data.reduce((acc, currentItem) => {
        if (currentItem.alert && currentItem.alert.category) {
          const category = currentItem.alert.category;
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += 1;
        }
        return acc;
      }, {});

      // Format data for Chart.js
      const formattedChartData = {
        labels: Object.keys(categoryCounts),
        datasets: [
          {
            label: 'Number of Alerts',
            data: Object.values(categoryCounts),
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',  // Red
              'rgba(54, 162, 235, 0.6)',  // Blue
              'rgba(255, 205, 86, 0.6)',  // Yellow
              'rgba(75, 192, 192, 0.6)',  // Teal
              'rgba(153, 102, 255, 0.6)', // Purple
            ],
            borderColor: 'rgba(255, 255, 255, 1)', // White
            borderWidth: 1,
          },
        ],
      };

      setChartData(formattedChartData);
    }
  }, [data]); // Dependency array ensures effect runs when data changes

  if (!chartData) {
    // Render a loading indicator or message until chartData is ready
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col w-full h-[100vh] items-center'>
      <h2 className='font-bold text-3xl my-6'>Alerts by Category</h2>
      <div className='md:w-[40%] w-[80%] mt-4'>
        <Pie 
          data={chartData}
          options={{
            
            scales: {
              x: {
                grid: {
                  color: '#6b6b6b',
                },
                ticks: {
                  color: '#6b6b6b',
                }
              },
              y: {
                grid: {
                  color: '#6b6b6b',
                },
                ticks: {
                  color: '#6b6b6b',
                }
              }
            }
          }}
        />
      </div>
      <p className='mt-2 p-2 border rounded-lg w-[80%]'>Categorizing alerts helps in understanding the nature of the threats. For example, a high number of "Potentially Bad Traffic" alerts could indicate network scans, while a large number of "Misc Attack" alerts could suggest infections. This information can guide prioritization of security responses and mitigation strategies. One can get the knowledge of threats to their network and can save it from damage in future.</p>
    </div>
  );
};

export default PieChart;
