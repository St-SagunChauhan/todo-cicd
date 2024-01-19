import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface Props {
  title?: string;
  labels?: string[];
  data?: any[];
}

const DonutChart: React.FC<Props> = ({ title, labels, data }) => {
  // Options for the donut chart
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels,
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        },
      },
    },
    legend: {
      position: 'right',
    },
    title: {
      text: title,
      align: 'left',
      style: {
        color: '#444',
      },
    },
  };

  // Series data for the donut chart
  const series: ApexCharts.ApexOptions['series'] = data;

  return (
    <div>
      <ReactApexChart options={options} series={series} type="donut" height={350} />
    </div>
  );
};

export default DonutChart;
