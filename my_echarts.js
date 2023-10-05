// 获取浴室数据
const getBathroomData = async (apiUrl) => {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
};

// 格式化时间数据
const formatTimeData = (data) => {
  return data.map(item => {
    const date = new Date(item.datetime);
    const formatter = new Intl.DateTimeFormat('en', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    });
    const formattedTime = formatter.format(date);
    return {
      used: item.used,
      datetime: formattedTime
    };
  });
};

// 渲染图表
const renderChart = (chartId, apiUrl, titleText) => {
  const chart = echarts.init(document.getElementById(chartId));

  getBathroomData(apiUrl)
    .then(data => {
      const formattedData = formatTimeData(data);
      const xAxisData = formattedData.map(item => item.datetime);
      const seriesData = formattedData.map(item => item.used);

      const option = {
        title: {
          text: titleText,
          left: 'center',
          textStyle: {
            fontSize: 16
          }
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          name: '时间',
          nameTextStyle: {
            fontSize: 14
          }
        },
        yAxis: {
          type: 'value',
          name: '在洗人数',
          nameTextStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            const data = params[0];
            const time = data.axisValue;
            const used = data.data;
            return `时间：${time}<br/>人数：${used}`;
          },
          axisPointer: {
            animation: false
          }
        },
        series: [{
          data: seriesData,
          type: 'line',
          smooth: true
        }]
      };

      chart.setOption(option);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
};

// 在页面加载完成后渲染中区男浴室图表
document.addEventListener('DOMContentLoaded', () => {
  const maleBathroomApiUrl = 'http://127.0.0.1:5000/get-bathroom-data-zq-female';
  const maleBathroomTitle = '中区男浴室在洗人数';
  renderChart('zqMaleBathroomChart', maleBathroomApiUrl, maleBathroomTitle);
});

// 在页面加载完成后渲染中区女浴室图表
document.addEventListener('DOMContentLoaded', () => {
  const femaleBathroomApiUrl = 'http://127.0.0.1:5000/get-bathroom-data-zq-male';
  const femaleBathroomTitle = '中区女浴室在洗人数';
  renderChart('zqFemaleBathroomChart', femaleBathroomApiUrl, femaleBathroomTitle);
});

// 在页面加载完成后渲染北区男浴室图表
document.addEventListener('DOMContentLoaded', () => {
  const bqMaleBathroomApiUrl = 'http://127.0.0.1:5000/get-bathroom-data-bq-female';
  const bqMaleBathroomTitle = '北区男浴室在洗人数';
  renderChart('bqMaleBathroomChart', bqMaleBathroomApiUrl, bqMaleBathroomTitle);
});
// 在页面加载完成后渲染北区女浴室图表
document.addEventListener('DOMContentLoaded', () => {
  const bqMaleBathroomApiUrl = 'http://127.0.0.1:5000/get-bathroom-data-bq-male';
  const bqMaleBathroomTitle = '北区女浴室在洗人数';
  renderChart('bqFemaleBathroomChart', bqMaleBathroomApiUrl, bqMaleBathroomTitle);
});
