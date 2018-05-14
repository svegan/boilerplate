import PieChart from './pie-chart-engine';

const canvasContainer = document.getElementById('pie-chart');

const params = {
  total: 141,
  parts: [
    {
      color: '#5de100',
      size: 50
    },
    {
      color: '#baf300',
      size: 22
    },
    {
      color: '#3d9200',
      size: 69
    }
  ]
};

let currentPieChart = new PieChart(canvasContainer, params);

export const initPieChart = () => {
  if (currentPieChart) {
    currentPieChart.destroy();
  }

  currentPieChart = new PieChart(canvasContainer, params);
};
