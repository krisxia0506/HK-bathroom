// 获取图书馆数据
const getLibData = async (apiUrl) => {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
};
// 格式化时间数据
const formatTimeData = (data) => {
    return data.map(item => {
        const { available, used, not_signed_in, datetime } = item;
        const date = new Date(item.datetime);
        const formatter = new Intl.DateTimeFormat('en', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC'
        });
        const formattedTime = formatter.format(date);
        return {
            available,
            used,
            not_signed_in,
            datetime: formattedTime
        };
    });
};


// 渲染图表
const renderChart = (chartId, apiUrl, titleText) => {
    const chart = echarts.init(document.getElementById(chartId));

    getLibData(apiUrl)
        .then(data => {
            const formattedData = formatTimeData(data);
            const xAxisData = formattedData.map(item => item.datetime);
            const availableData = formattedData.map(item => item.available);
            const usedData = formattedData.map(item => item.used);
            const notSignedInData = formattedData.map(item => item.not_signed_in);
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
                    name: '人数',
                    nameTextStyle: {
                        fontSize: 14
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        return `时间: ${params[0].axisValue}<br/>
                        当前可用: ${params[0].data}<br/>
                        已使用: ${params[1].data}<br/>
                        未签到: ${params[2].data}`;
                    }
                },
                legend: {
                    data: ['当前可用', '已使用', '未签到'], // 图例中显示的数据系列名称
                    top: 30, // 图例显示在标题的下方
                },
                
                series: [
                    {
                      name: '当前可用',
                      type: 'line',
                      data: availableData,
                    },
                    {
                      name: '已使用',
                      type: 'line',
                      data: usedData,
                    },
                    {
                      name: '未签到',
                      type: 'line',
                      data: notSignedInData,
                    }
                  ]
            };

            chart.setOption(option);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
};


// 在页面加载完成后渲染图书馆人数图表
document.addEventListener('DOMContentLoaded', () => {
    const maleBathroomApiUrl = 'http://127.0.0.1:64535/get_lib_data';
    const maleBathroomTitle = '华北科技学院图书馆在馆人数';
    renderChart('libChart', maleBathroomApiUrl, maleBathroomTitle);
});