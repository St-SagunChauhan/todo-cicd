import React from 'react';
import { Box } from '@material-ui/core';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

interface Props {
  title: any;
  series: ApexOptions['series'];
  categories: string[];
}

const DistortedChart = ({ title, series, categories }: Props) => {
  // Options for the chart
  const options: ApexCharts.ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false, // Set horizontal to false to display vertical bars
        distributed: true,
        columnWidth: '40%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories,
      labels: {
        rotate: -45, // Set the rotation angle (use negative value for counterclockwise rotation)
      },
    },
    legend: {
      position: 'top', // Set the legend position to "right"
    },
    title: {
      text: title,
      align: 'left',
      style: {
        color: '#444',
      },
    },
  };

  return (
    <Box>
      <ReactApexChart options={options} series={series} type="bar" height={350} width={750} />
    </Box>
  );
};

export default DistortedChart;
