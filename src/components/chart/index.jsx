import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles'

import {
  ComposedChart,
  Bar,
  Area,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from 'recharts'

import { getChartData } from '../../actions/chart';
import { getViewed } from '../../selectors/spectrum'

const useStyles = makeStyles(theme => ({
  chart: {
    height: '480px',
  },
}))

const light = [
 { Wavelength: 3800, energyDensity: 100 },
 { Wavelength: 7400, energyDensity: 100 },
]

const dataLimitCheck = (type, data=[]) => {
  const dataLength = data.length
  return (
    type === 'temperature'
    ? { min: 0, max:  20000}
    : {
      min: (data && dataLength > 0) ? data[0].Wavelength : 'dataMin',
      max: (data && dataLength > 0) ? data[dataLength - 2].Wavelength : 'dataMax',
    })
}

const Chart = props => {
  const {
    type,
    spectrumData,
    elementData = [],
    planckData,
    t,
  } = props;

  const classes = useStyles()
  const [dataLimit, setDataLimit] = useState(dataLimitCheck(type))
  const [elementLimit, setElementLimit] = useState([0, 'dataMax'])

  useEffect(() => {
  }, [elementData])

  return (
    <div className={classes.chart}>
    {
      spectrumData && (
        <ResponsiveContainer width="100%" height={480}>
          <ComposedChart>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7F007F" stopOpacity={0.8}/>
                <stop offset="16.67%" stopColor="#0000FF" stopOpacity={0.8}/>
                <stop offset="33.33%" stopColor="#00FFFF" stopOpacity={0.8}/>
                <stop offset="50%" stopColor="#00FF00" stopOpacity={0.8}/>
                <stop offset="66.67%" stopColor="#FFFF00" stopOpacity={0.8}/>
                <stop offset="83.33%" stopColor="#FF7F00" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#FF0000" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="Wavelength"
              type="number"
              allowDecimals={false}
              allowDataOverflow={true}
              domain={[dataLimit.min, dataLimit.max]}
            />
            <YAxis 
              yAxisId="left"
              type="number"
              tick={false}
              domain={[0, 'dataMax']}
              label={{ value: 'Energy Density', angle: -90}}
              allowDataOverflow={true}
            />
            <YAxis 
              hide={true}
              domain={[0, 'dataMax']}
              yAxisId="right" 
            />
            <YAxis 
              hide={true}
              domain={[0, 'dataMax']}
              yAxisId="light" 
            />
            <Area 
              yAxisId="light" 
              type="monotone" 
              data={light} 
              dataKey="energyDensity" 
              stroke="#8884d8" 
              fill="url(#colorUv)"
              isAnimationActive={false}
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              data={spectrumData.data} 
              dataKey="BestFit" 
              dot={false} 
              isAnimationActive={false}
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              data={planckData} 
              dataKey="energyDensity" 
              dot={false} 
              activeDot={false}
              isAnimationActive={false}
              stroke="#82ca9d"
            />
          </ComposedChart>
        </ResponsiveContainer>
      )
    }
    </div>
  )
}

export default Chart;