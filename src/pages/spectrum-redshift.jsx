import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import union from 'lodash/union'

import { makeStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'

import Slider from '@material-ui/core/Slider'
import Tooltip from '@material-ui/core/Tooltip'
import Chip from '@material-ui/core/Chip'

import Divider from '@material-ui/core/Divider';

import {
  useHistory,
} from "react-router-dom"

import {
  getViewed,
  getIsFetching,
  getDefaultAnswer,
} from '../selectors/spectrum'

import {
  updateViewedSpectrum,
} from '../actions'

import ChartWrapper from '../components/chart-wrapper'
import Chart from '../components/chart/redshift.jsx'
import Progress from '../components/progress/index.jsx'
import DropdownMenu from '../components/dropdown-menu/index.jsx'

import { elementMeasurement } from '../element'
import { redshiftCalibration, airToVac } from '../utilities/redshift'

const restElement = {
  list: [],
  data: {},
}

elementMeasurement.list.forEach( d => {
  restElement.list = union(restElement.list, elementMeasurement.data[d])
  elementMeasurement.data[d].forEach( wave => {
    const vacWave = Math.floor(airToVac(wave) * 10)/10
    restElement.data[`${vacWave}`] = d
  })
})

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper:{
    marginBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(12),
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    margin: theme.spacing(1),
  },
  checkForm: {
    margin: 0,
  },
  chip: {
    margin: '0 4px',
  },
  divider: {
    margin: '8px 0',
  },
  textField: {
    margin: '0 4px',
  },  
}))

const SpectrumRedshift= () => {
  const classes = useStyles()
  const spectrumData = useSelector(getViewed)
  const defaultAnswer = useSelector(getDefaultAnswer) 

  const history = useHistory()
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)
  const [inputWave, setInputWave] = useState({ rest: '', spectrum: '' })
  const [chartData, setChartData] = useState({ list: [], elements: [], maxY: 0, limitX: [0, 20000] })
  const [elementData, setElementData] = useState({ bar: [], option: { list: [], data: {}}})
  const [radialVelocity, setRadialVelocity] = useState(0)

  const isFetching = useSelector(getIsFetching)

  useEffect(() => {
    dispatch(updateViewedSpectrum)

    return () => {
      setElementData({ bar: [], option: { list: [], data: {}}})
      setChartData({ list: [], elements: [], maxY: 0, limitX: [0, 20000] })
    }
  }, [])

  useEffect(() => {
    if(spectrumData.data){
      const redshift = Number(spectrumData.redshift.split(' ')[0])
      const newChartData = { list: [], elements: [] }

      let maxY = 0
      let limitX = [Infinity, -Infinity]

      const maredElement = {}
      const elementOptions = {
        list: [],
        data: {},
      }

      spectrumData.data.forEach( d => {
        const wavelength = d.Wavelength
        if(wavelength){
          const restWave = Math.floor( wavelength / ( 1 + redshift) * 10 ) / 10
          let element = restElement.data[restWave] || restElement.data[restWave + 0.1] || restElement.data[restWave - 0.1] || null


          maxY = d.BestFit > maxY ? d.BestFit : maxY
          limitX[0] = wavelength < limitX[0] ? wavelength : limitX[0]
          limitX[1] = wavelength > limitX[1] ? wavelength : limitX[1]

          if(element){
            d.element = element
            if(!maredElement[element]) maredElement[element] = []

            maredElement[element].push(wavelength)
            newChartData.elements.push(d)
            if(!elementOptions.data[element]){
              elementOptions.list.push(element)
              elementOptions.data[element] = elementMeasurement.data[element]
            }
          }
          newChartData.list.push(d)
        }
      })

      elementOptions.list.sort()

      //const selected = elementOptions.list[0]
      const elementBarData = []

      elementOptions.list.forEach( d => {
        elementOptions.data[d].forEach( (wave, i) => {
          elementBarData.push({
            wavelength: wave,
            label: `${d}-${wave}-${i}`,
            density: 100,            
          })
        })
      })

      setElementData({ bar: elementBarData, option: elementOptions, marked: maredElement })
      setChartData({ ...newChartData, limitX, maxY: maxY*1.1})
    }
  }, [spectrumData])

  useEffect(() => {
    const {
      rest,
      spectrum,
    } = inputWave

    let radialV = 0

    if(rest && spectrum){
      const restWave = airToVac(rest)
      radialV = (spectrum - restWave) / restWave
    }

    setRadialVelocity(radialV)

  }, [inputWave])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = key => e => {
    setInputWave({...inputWave, [key]: e.target.value})
  }

  return(
    <>
      { isFetching && <Progress/> }    
      <AppBar position="static" color="default">
        <Toolbar variant="dense">
          <IconButton 
            edge="start" 
            className={classes.menuButton} 
            color="inherit" 
            aria-label="home"
            onClick={()=>{
              history.push('/')
            }}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            恆星的逕向速度
            {
              spectrumData.id && `(ID: ${spectrumData.id})`
            }
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Container maxWidth="lg" className={classes.container}>
          <Paper className={classes.paper}>
            <ChartWrapper>
              <Chart
                chartData = {chartData}
                elementData={elementData}
              />
            </ChartWrapper>
          </Paper>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <div className={classes.inputRow}>
              輸入靜止時波長:
              <TextField
                placeholder="Rest Wavelength"
                className={classes.textField}
                onChange={handleInputChange('rest')}
                value={inputWave.rest}
                margin="none"
              />
            </div>
            <div className={classes.inputRow}>
              輸入圖譜上波長:
              <TextField
                placeholder="Spectrum Wavelength"
                className={classes.textField}
                onChange={handleInputChange('spectrum')}
                value={inputWave.spectrum}
                margin="none"
              />
            </div>
            <div>
              逕向速度(z): {radialVelocity}
            </div>
            <Button 
              variant="contained" 
              color="primary" 
              className={classes.button} 
              onClick={handleClickOpen}
            >
              解答
            </Button>
          </Grid>
        </Container>
      </main>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <Typography align="left" color="textSecondary" >
              恆星的逕向速度(z)為：{ spectrumData.redshift }
            </Typography>
            <Divider classes={{ root: classes.divider }}/>
            <Typography align="left" color="textSecondary" >
              你的答案：{radialVelocity}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            關閉
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SpectrumRedshift