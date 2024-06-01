import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AlertDestination = ({ data }) => {
  const [chartData, setChartData] = useState(null); // Initialize as null

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      // Prepare data for the chart
      const categoryCounts = data.reduce((acc, currentItem) => {
        if (currentItem.dest_port) {
          const category = currentItem.dest_port;
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += 1;
        }
        return acc;
      }, {});

      // Filter entries with more than 1 frequency
      const filteredCounts = Object.keys(categoryCounts)
        .filter(key => categoryCounts[key] > 1)
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
    <div className='flex flex-col w-full h-[100vh] items-center'>
      <h2 className='font-bold text-3xl my-6'>Alerts by Destination Port</h2>
      <div className='md:w-[60%] w-[80%] mt-4'>
      <Bar data={chartData}
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
      <p className='border rounded-lg p-2 mt-2 w-[80%]'>The above graph depicts the most common destination ports involved in security alert. <br />As we can see that a high concentration of alerts targeting specific port 1433 could suggest attempts to exploit database vulnerabilities. <br /> It typically indicates potential targeted attacks or scanning activities specifically aimed at Microsoft SQL Server databases, as port 1433 is the default port for this service.</p>
    </div>
  );
};

export default AlertDestination;
