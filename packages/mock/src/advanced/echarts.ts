/**
 * npx ts-node .\src\index.ts
 * mock echarts配置项数据
 */
import { Random } from 'mockjs'
import { EChartOption } from 'echarts'

function lineRandomLength(dataFunc: (index: number) => unknown, minimal = 1, maximal = 4) {
  return Array.from({ length: Random.natural(minimal, maximal) }, (_, index) => dataFunc(index))
}
function barRandomLength(dataFunc: (index: number) => unknown, minimal = 1, maximal = 3) {
  return Array.from({ length: Random.natural(minimal, maximal) }, (_, index) => dataFunc(index))
}

const choice = Random.boolean()
const xType = choice ? 'category' : 'value'
const yType = choice ? 'value' : 'category'
const isCurve = Random.boolean()
const isArea = Random.boolean()
const axisPointerType = Random.boolean()
//true、false为圆角环形图
//true、true为南丁格尔玫瑰图
//false、false和false、true为基础饼状图
const isRounderCorner = Random.boolean()
const isRoseDiagram = Random.boolean()
const isRadius = Random.boolean()

export function mockEchartsOption(type: 'bar' | 'line' | 'pie'): EChartOption {
  if (type === 'line') {
    return {
      title: {
        text: '折线图'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      legend: {
        data: ['Line 1', 'Line 2', 'Line 3', 'Line 4']
      },
      //基础折线图(choice为true)
      //垂直折线图(choice为false)
      xAxis: {
        type: xType,
        boundaryGap: choice,
        axisLine: { onZero: false },
        data: Random.range(0, 700, 100) as unknown as number[]
      },
      yAxis: {
        type: yType,
        boundaryGap: choice,
        axisLine: { onZero: false },
        data: Random.range(0, 700, 100) as unknown as number[]
      },
      series: lineRandomLength((index: number) => ({
        //阶梯折现图
        step: !isArea,
        name: 'Line ' + (index + 1),
        data: [
          Random.integer(100 + index * 100, index * 100 + 200),
          Random.integer(100 + index * 100, index * 100 + 200),
          Random.integer(100 + index * 100, index * 100 + 200),
          Random.integer(100 + index * 100, index * 100 + 200),
          Random.integer(100 + index * 100, index * 100 + 200),
          Random.integer(100 + index * 100, index * 100 + 200),
          Random.integer(100 + index * 100, index * 100 + 200)
        ],
        type: 'line',
        stack: '总量',
        //基础平滑折线图
        smooth: !isCurve,
        //基础面积图
        areaStyle: { opacity: isArea ? 1 : 0 },
        emphasis: {
          focus: 'series'
        },
        //自定义折线图
        symbol: isCurve ? 'circle' : 'none',
        symbolSize: 5,
        showSymbol: isCurve
      }))
    }
  }
  if (type === 'bar') {
    return {
      legend: {
        data: ['Bar 1', 'Bar 2', 'Line 1']
      },
      title: {
        text: '柱状图',
        subtext: '自定义'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: axisPointerType ? 'shadow' : 'line'
        }
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      xAxis: [
        {
          type: xType,
          name: choice ? '' : '水量',
          axisLabel: {
            formatter: choice ? '{value}' : '{value} ml'
          },
          data: Random.range(0, 700, 100) as unknown as number[]
        }
      ],
      yAxis: [
        {
          type: yType,
          data: Random.range(0, 700, 100) as unknown as number[],
          name: choice ? '水量' : '',
          axisLabel: {
            formatter: choice ? '{value} ml' : '{value}'
          }
        }
      ],
      series: barRandomLength((index: number) => ({
        name: index < 2 ? 'Bar ' + (index + 1) : 'Line 1',
        type: index < 2 ? 'bar' : 'line',
        label: {
          show: true
        },
        data: [
          Random.integer(-50, 150),
          {
            value: Random.integer(-50, 200),
            itemStyle: {
              color: index < 2 ? (index < 1 ? '#a90000' : '#91cc75') : ''
            }
          },
          Random.integer(-100, 200),
          Random.integer(-150, 300),
          Random.integer(-30, 100),
          Random.integer(-100, 250),
          Random.integer(-200, 300)
        ]
      }))
    }
  }
  if (type === 'pie') {
    return {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveImage: { show: true }
        }
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: isRounderCorner
            ? isRoseDiagram
              ? [50, 250]
              : (['40%', '70%'] as unknown as number)
            : '50%',
          roseType: isRounderCorner ? (isRoseDiagram ? (isRadius ? 'radius' : 'area') : '') : '',
          data: [
            {
              value: Random.integer(1000, 1200),
              name: '搜索引擎'
            },
            {
              value: Random.integer(700, 800),
              name: '直接访问'
            },
            {
              value: Random.integer(550, 600),
              name: '邮件营销'
            },
            {
              value: Random.integer(450, 500),
              name: '联盟广告'
            },
            {
              value: Random.integer(250, 300),
              name: '视频广告'
            }
          ],
          itemStyle: {
            borderColor: isRounderCorner ? '#fff' : 'none',
            borderWidth: isRounderCorner ? 2 : 0,
            borderRadius: isRounderCorner ? 10 : 0
          },
          label: {
            show: isRounderCorner ? false : true
          },
          labelLine: {
            show: isRounderCorner ? false : true
          },
          emphasis: {
            itemStyle: {
              shadowBlur: isRounderCorner ? 0 : 10,
              shadowOffsetX: 0,
              shadowColor: isRounderCorner ? '' : 'rgba(0,0,0,0.5)'
            }
          }
        }
      ]
    }
  }
}
