import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'
import Button from '@material-ui/core/Button'

import {
  ComposedChart,
  ScatterChart,
  Bar,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Scatter,
  LabelList,
  ResponsiveContainer,
} from 'recharts'

import union from 'lodash/union'

import DotMarkDialog from '../dot-mark-dialog/index.jsx'

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const useStyles = makeStyles(theme => ({
  chart: {
    height: '480px',
    position: 'relative',
    '& .recharts-responsive-container': {
      position: 'absolute',      
    }
  },
  hideXAxisChart: {
    '& .recharts-cartesian-axis': {
      opacity: 0,
    }
  },
  elementChart: {
    '& .recharts-cartesian-axis': {
      opacity: 0,
    }
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
  clearAllDotsBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
}))

const dotsRefetence = {
  list: [],
  dot: {},
}

const Chart = props => {
  const {
    type,
    spectrumData,
    selectedElement,
    elementData = [],
    t,
  } = props;

  const classes = useStyles()
  const [dataList, setDataList] = useState([])
  const [marks, setMarks] = useState([])
  const [dataLimit, setDataLimit] = useState({min: 0, max: 20000})
  const [activePayload, setActivePayload] = useState({})
  const [maxDensity, setMaxDensity] = useState(0)
  const [markDots, setMarkDots] = useState({
    list: [],
    dots: {},
  })

  const [value, setValue] = useState([0, 20000])
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const [open, setOpen] = useState(false)
  const handleChartClick = () => {
    const dots = {
      ...markDots.dots,
    }

    if (!dots[activePayload.Wavelength]) {
      dots[activePayload.Wavelength] = {
        element: `${selectedElement}-${activePayload.Wavelength}`,
        ...activePayload,
      }
    } else {

      const element = dots[activePayload.Wavelength].element.split('-')[0]

      if ( element === selectedElement ) {
        delete dots[activePayload.Wavelength]
      }
    }

    const list = Object.keys(dots).map( key => dots[key])
    setMarkDots({
      list,
      dots
    })
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleFormatter = (value, name, props) => {
    setActivePayload(props.payload)
    //activePayload = props.payload
    return [value, name]
  }

  const renderLabel = props => {
   const {
      x, y, width, height, value, index
    } = props;

    const [
      element,
      wavelength,
    ] = value.split('-')

    const yEVal = y > 35 ? 25 : -30
    const yWVal = y > 35 ? 10 : -15

    return element === selectedElement ? (
      <g>
        <text x={x + width / 2} y={y - yEVal} fill="#f00" textAnchor="middle" dominantBaseline="middle">
          {element}
        </text>
        <text x={x + width / 2} y={y - yWVal} fill="#333" textAnchor="middle" dominantBaseline="middle">
          {wavelength}
        </text>        
      </g>
    ) : null
  }

  const clearAllMarkDots = () => {
    setMarkDots({
      list: [],
      dots: {}
    })    
  }

  useEffect(() => {
    if(spectrumData.data){
      const min = spectrumData.data[0].Wavelength
      const max = spectrumData.data[spectrumData.data.length - 2].Wavelength

      let maxDensity = 0

      const interval = (max - min)/5
      const marks = []

      for(let i = 0; i <= 5; i++){
        const value = i < 5 ? min + interval * i : max
        marks.push({
          value,
          label: value.toFixed(3),          
        })          
      }

      spectrumData.data.forEach( d => {
        if(d['BestFit'] > maxDensity) maxDensity = d['BestFit']
      })

      setMaxDensity(maxDensity)
      setDataLimit({ min, max})
      setValue([min, max])
      setDataList(spectrumData.data)
      setMarks(marks)
    }
  }, [spectrumData])

  return (
    <>
      <div className={classes.chart}>
        <ResponsiveContainer width="100%" height={480} className={classes.elementChart}>
          <ComposedChart data={elementData}>
            <XAxis 
              dataKey="Wavelength"
              type="number"
              allowDecimals={false}
              allowDataOverflow={true}
              domain={[value[0], value[1]]}
            />
            <YAxis 
              yAxisId="left"
              type="number"
              tick={false}
              domain={[0, 'dataMax']}
              label={{ value: 'Energy Density', angle: -90}}
              allowDataOverflow={true}
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="energyDensity" 
              dot={false} 
              isAnimationActive={false}
              stroke="#f00"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={480} className={classes.hideXAxisChart}>
          <ScatterChart>
            <XAxis 
              type="number" 
              dataKey="Wavelength" 
              allowDataOverflow={true}
              domain={[value[0], value[1]]}
            />
            <YAxis type="number" dataKey="BestFit" domain={[0, maxDensity]} />
            <Scatter data={markDots.list} fill="#8884d8" isAnimationActive={false}>
              <LabelList 
                dataKey="element" 
                position="top" 
                offset={10}
                content={renderLabel} 
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={480}>
          <ComposedChart data={dataList} onClick={handleChartClick}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="Wavelength"
              type="number"
              allowDecimals={false}
              allowDataOverflow={true}
              tick={false}
              domain={[value[0], value[1]]}
            />
            <YAxis 
              yAxisId="left"
              type="number"
              tick={false}
              domain={[0, 'dataMax']}
              label={{ value: 'Energy Density', angle: -90}}
              allowDataOverflow={true}
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="BestFit" 
              dot={false} 
              isAnimationActive={false}
            />
            <Tooltip formatter={handleFormatter} />
          </ComposedChart>
        </ResponsiveContainer>
        <Button 
          className={classes.clearAllDotsBtn}
          onClick={clearAllMarkDots}
          disabled={markDots.list.length === 0}
          variant="contained" 
          color="primary"
        >
          清除標記
        </Button>
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
      <DotMarkDialog
        open={open}
        onClose={handleClose}
      />
    </>
  )
}

export default Chart;