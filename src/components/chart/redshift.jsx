import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'
import Chip from '@material-ui/core/Chip'

import {
  ComposedChart,
  Bar,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Scatter,
  ScatterChart,
  ResponsiveContainer,
  LabelList,
  BarChart,
} from 'recharts'

import union from 'lodash/union'

import { elementMeasurement } from '../../element'
import { redshiftCalibration } from '../../utilities/redshift'

const restElement = {
  list: [],
  data: {},
}

elementMeasurement.list.forEach( d => {
  restElement.list = union(restElement.list, elementMeasurement.data[d])
  elementMeasurement.data[d].forEach( wave => {
    restElement.data[`${wave}`] = d
  })
})

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const useStyles = makeStyles(theme => ({
  chart: {
    height: '480px',
    position: 'relative',
    '& .recharts-responsive-container': {
      position: 'absolute',      
    },
  },
  elementMenu:{
    position: 'absolute',
    top: 0,
    right: -96,
  },
  elementMenuWrapper: {
    width: 96,
    margin: '0 auto'
  },
  chip: {
    margin: '4px 8px',
    display: 'flex',
  },
  hideXAxisChart: {
    '& .recharts-cartesian-axis': {
      opacity: 0,
    }
  },
  'elementChart': {
    '& text': {
      fill: '#f00',
    },
  },
  sliderRoot:{
    width: 'calc(100% - 70px)',
    marginLeft: 70,
  },
  thumb: {
    height: 18,
    width: 18,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    marginTop: -9,
    marginLeft: -9,
    '&:focus,&:hover,&$active': {
      boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  valueLabel: {
    left: 'calc(-50% + 11px)',
    top: -22,
    '& *': {
      background: 'transparent',
      color: '#000',
    },
  },  
}))

const Chart = props => {
  const {
    type,
    chartData,
    elementData = [],
    t,
  } = props;

  const classes = useStyles()

  const [marks, setMarks] = useState([])
  const [element, setElement] = useState('')
  const [dataLimit, setDataLimit] = useState({min: 0, max: 20000})
  const [value, setValue] = useState([0, 20000])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const renderLabel = props => {
   const {
      x, y, width, height, value, index
    } = props;

    const values = value.split('-')

    const elementLabel = values[0]
    const wavelength = values[1]
    const eleIndex = values[2]

    const yVal = (index%2 - 0.5)*2 * 36

    return elementLabel === element ? (
      <g>
        <text x={x + width / 2} y={y + yVal + height / 2} fill="#fff" textAnchor="middle" dominantBaseline="middle">
          {elementLabel}
        </text>
        <text x={x + width / 2} y={y + yVal + height / 2 + 18} fill="#fff" textAnchor="middle" dominantBaseline="middle">
          {wavelength}
        </text>
      </g>
    ) : null
  }

  const handleElementClick = ele => () => {
    const option = elementData.option.data[ele]
    const marked = elementData.marked[ele]

    let min = option[0]
    let max = option[option.length - 1]

    option.forEach( d => {
      min = d < min ? d : min
      max = d > max ? d : max
    })

    marked.forEach( d => {
      min = d < min ? d : min
      max = d > max ? d : max
    })

    min = Math.floor(min - 100) < dataLimit.min ? dataLimit.min : Math.floor(min - 100)
    max = Math.floor(max + 100) > dataLimit.max ? dataLimit.max : Math.floor(max + 100)

    setValue([min, max])
    setElement(ele)
  }

  useEffect(() => {
    const min = chartData.limitX[0]
    const max = chartData.limitX[1]

    const interval = (max - min)/5
    const marks = []

    for(let i = 0; i <= 5; i++){
      const value = i < 5 ? min + interval * i : max
      marks.push({
        value,
        label: value.toFixed(3),          
      })          
    }

    setDataLimit({ min, max})
    setValue([min, max])
    setMarks(marks)

  }, [chartData])

  useEffect(() => {
    setElement(elementData.option.list[0])
  }, [elementData])

  return (
    <>
      <div className={classes.chart}>
        <ResponsiveContainer width="100%" height={480} className={`${classes.hideXAxisChart} ${classes.elementChart}`}>
          <BarChart data={elementData.bar}>
            <XAxis 
              type="number" 
              dataKey="wavelength" 
              allowDataOverflow={true}
              domain={[value[0], value[1]]}
            />
            <YAxis type="number" domain={[0, 'dataMax']} />
            <Bar dataKey="density" fill="#82ca9d" barSize={1}>
              <LabelList 
                dataKey="label"
                position="center"
                content={renderLabel} 
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={480} className={classes.hideXAxisChart}>
          <ScatterChart>
            <XAxis 
              type="number" 
              dataKey="Wavelength" 
              allowDataOverflow={true}
              domain={[value[0], value[1]]}
            />
            <YAxis type="number" dataKey="BestFit" domain={[0, chartData.maxY]} />
            <Scatter data={chartData.elements} fill="#8884d8" isAnimationActive={false}>
              <LabelList dataKey="element" position="top" offset={10}/>
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={480}>
          <ComposedChart data={chartData.list} >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="Wavelength"
              type="number"
              allowDecimals={false}
              allowDataOverflow={true}
              tick={false}
              domain={[value[0], value[1]]}
              unit="cm"
            />
            <YAxis 
              yAxisId="left"
              type="number"
              tick={false}
              domain={[0, chartData.maxY]}
              label={{ value: 'Energy Density', angle: -90}}
              allowDataOverflow={true}
              dataKey="BestFit"
              unit="cm"
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="BestFit" 
              dot={false}
              isAnimationActive={false}
            />
            <Tooltip />
          </ComposedChart>
        </ResponsiveContainer>
        <div className={classes.elementMenu}>
          <div className={classes.elementMenuWrapper}>
            { elementData.option.list.map( d => <Chip
                onClick={handleElementClick(d)}
                classes={{ root: classes.chip }}
                color="primary"
                variant={ d === element ? 'default' : 'outlined'}
                key={d}
                label={d}
              />)
            }
          </div>
        </div>
      </div>
      <Slider
        min={dataLimit.min}
        max={dataLimit.max}
        value={value}
        onChange={handleChange}
        classes={{
          root: classes.sliderRoot,
          thumb: classes.thumb, // class name, e.g. `classes-nesting-root-x`
          valueLabel: classes.valueLabel, // class name, e.g. `classes-nesting-label-x`
        }}
        marks={marks}
        valueLabelDisplay="on"
        aria-labelledby="range-slider"
      />
    </>
  )
}

export default Chart;