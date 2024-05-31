// src/LineChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const AlertByTime = ({ data }) => {
  const [chartData, setChartData] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    try {
      if (data && Array.isArray(data) && data.length > 0) {
        // Aggregate data by hour
        const alertsByHour = data.reduce((acc, currentItem) => {
          const hour = new Date(currentItem.timestamp).getHours();
          if (!acc[hour]) {
            acc[hour] = 0;
          }
          acc[hour] += 1;
          return acc;
        }, {});

        // Ensure all 24 hours are represented
        for (let i = 0; i < 24; i++) {
          if (!alertsByHour[i]) {
            alertsByHour[i] = 0;
          }
        }

        // Format data for Chart.js
        const formattedChartData = {
          labels: Object.keys(alertsByHour).sort((a, b) => a - b),
          datasets: [
            {
              label: 'Number of Alerts',
              data: Object.values(alertsByHour),
              fill: false,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
            },
          ],
        };

        setChartData(formattedChartData);
      } else {
        setError('No valid data provided');
      }
    } catch (err) {
      setError(`Error processing data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [data]);




  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!chartData) {
    return <div>No data available</div>;
  }

  return (
    <div className='w-full flex flex-col items-center'>
      <h2 className='font-bold text-3xl my-6'>Alerts by Time</h2>
      <div className='md:w-[80%] w-[95%]'>
      <Line data={chartData} />
      </div>
      <p className='border rounded-lg p-2 mt-2 w-[80%]'>The above chart help identify trends and patterns in alert activity. Spikes in the number of alerts at certain times might correlate with specific events, such as a new attack wave or increased scanning activity. It can also help in understanding the time-based behavior of potential threats.
        <br /> As the above data is for approximately 4 hours, we have the number of alert for every hour depicted in the graph. In case, if we have a big data, then it can be used to predict alert timings for future to save resource or other purposes.</p>
    </div>
  );
};

export default AlertByTime;
