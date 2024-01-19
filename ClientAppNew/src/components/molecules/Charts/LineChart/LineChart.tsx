import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface Props {
  title?: string;
  series?: ApexOptions['series'];
  labels?: string[];
}

const LineChart: React.FC<Props> = ({ title, series, labels }) => {
  // Sample dynamic data for the line chart
  // const data = [10, 25, 30, 15, 20, 40];

  // Sample dynamic labels for the X-axis (replace this with your dynamic labels)
  // const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  // Options for the line chart
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
    },
    xaxis: {
      categories: labels,
    },
    stroke: {
      width: 2,
    },
    title: {
      text: title,
      align: 'left',
      style: {
        color: '#444',
      },
    },
  };

  // Series data for the line chart
  // const series: ApexCharts.ApexOptions['series'] = [
  //   {
  //     name: 'Dynamic Line',
  //     data: data,
  //   },
  // ];

  return (
    <div>
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default LineChart;
