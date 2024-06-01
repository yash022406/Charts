// src/LineChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const LineChart = ({ data }) => {
  const [chartData, setChartData] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    try {
      if (data && Array.isArray(data) && data.length > 0) {
        // Prepare data for the chart
        const alertCountsByIP = data.reduce((acc, currentItem) => {
          const { src_ip } = currentItem;
          if (!acc[src_ip]) {
            acc[src_ip] = 0;
          }
          acc[src_ip] += 1;
          return acc;
        }, {});

        // Filter data to include only those with frequency > 4
        const filteredCountsByIP = Object.keys(alertCountsByIP)
          .filter(ip => alertCountsByIP[ip] > 1)
          .reduce((acc, ip) => {
            acc[ip] = alertCountsByIP[ip];
            return acc;
          }, {});

        if (Object.keys(filteredCountsByIP).length === 0) {
          setError('No source IPs with frequency greater than 4');
        } else {
          // Format data for Chart.js
          const formattedChartData = {
            labels: Object.keys(filteredCountsByIP),
            datasets: [
              {
                label: 'Number of Alerts by Source IP',
                data: Object.values(filteredCountsByIP),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
              },
            ],
          };

          setChartData(formattedChartData);
        }
      } else {
        setError('No valid data provided');
      }
    } catch (err) {
      setError(`Error processing data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [data]); // Dependency array ensures effect runs when data changes


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
    <div className='w-full flex flex-col h-[100vh] items-center'>
      <h2 className='font-bold text-3xl my-6'>Alerts by Source IP</h2>
      <div className='md:w-[80%] w-[95%] mt-4'>
      <Line 
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
      <p className='w-[80%] mt-2 p-2 border rounded-lg'>The above graph shows different number of alert thrown by a particular Source IP Address. With the help of this data we can say that the IP Address 8.42.77.171 is either a potential attacker to our firewall or can be a known IP address requesting for some data. Frequent requests from a single source IP in a firewall could suggest legitimate traffic, malicious activity like DDoS attacks, misconfigurations, network scanning, or automated bot activity.</p>
    </div>
  );
};

export default LineChart;
