import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

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

import ChartWrapper from '../components/chart-wrapper'
import Chart from '../components/chart/composition.jsx'
import Progress from '../components/progress/index.jsx'
import DropdownMenu from '../components/dropdown-menu/index.jsx'

import { genEnergyDensityDataSet } from '../utilities/formula'
import { redshiftCalibration } from '../utilities/redshift'

import { element } from '../element.js'

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
    paddingRight: theme.spacing(4),
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
  }
}))

const elementOption = element.list.map( d => ({ label: d, value: d}))

const DEFAULT_STATE = {
  spectrum: 0,
  spCount: 0,
  element: 0,
  elCount: 0,
}

const arrangeSPectrumData = (list, key) => {
  let min = Infinity
  let max = 0
  const data = {}

  list.forEach( d => {
    const wavelength = Math.floor(d.Wavelength)
    const dataDensity = d[key] || 0

    if(!data[wavelength]) data[wavelength] = { ...DEFAULT_STATE, wavelength: wavelength }

    //const count = 

    let {
      count,
      density,
    } = data[wavelength][type]

    data[wavelength]['spectrum'] = {
      count: count + 1,
      density: (density * count + dataDensity) / (count + 1)
    }

    if(min > wavelength) min = wavelength
    if(max < wavelength) max = wavelength

  })

  data['min'] = min
  data['max'] = max
  return data
}


const SpectrumComposition= () => {
  const classes = useStyles()
  const spectrumData = useSelector(getViewed)
  const defaultAnswer = useSelector(getDefaultAnswer) 

  const history = useHistory()
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)
  const [selectedElement, setSelectedElement] = useState(element.list[0])
  const [elementData, setElementData] = useState([])
  const [redshift, setRedshift] = useState(0)
  const [elementList, setElementList] = useState([])

  const elementComposition = [ 'H', 'O_I', 'O_II', 'He' ]

  const isFetching = useSelector(getIsFetching)

  useEffect(() => {
    if(spectrumData.redshift){
      const redshift = Number(spectrumData.redshift.split(' ')[0])
      const selectedElementData = element.data[selectedElement]
      setElementData(
        selectedElementData.map(d => ({
          ...d,
          Wavelength: redshiftCalibration(d.Wavelength, redshift)
        }))
      )
      setRedshift(redshift)
    }
  }, [spectrumData])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleElementChange = option => {
    const newElementData = element.data[option.value]

    setElementData(
      newElementData.map(d => ({
        ...d,
        Wavelength: redshiftCalibration(d.Wavelength, redshift)
      }))
    )
    setSelectedElement(option.value)
  }

  const handleElementSelect = val => () => {
    const eleIndex = elementList.indexOf(val)
    if(eleIndex > -1){
      setElementList(elementList.filter(d => d !== val))
    }else{
      setElementList([...elementList, val])      
    }
  }

  const handleElementUnselect = val => () => {
    setElementList(elementList.filter(d => d !== val))    
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
            恆星的成分組成
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
                spectrumData={spectrumData}
                type="composition"
                elementData={elementData}
                selectedElement={selectedElement}
              />
            </ChartWrapper>
          </Paper>
          {
            elementList.length > 0 && (
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                已選擇元素：
                {
                  elementList.map(ele => <Chip
                    color="primary"
                    variant="outlined"
                    onDelete={handleElementUnselect(ele)}
                    classes={{ root: classes.chip }}
                    key={ele}
                    label={ele}
                  />)
                }
              </Grid>
            )
          }
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Typography align="left" color="textSecondary">
              比對元素圖譜，找出該星體組成成分
            </Typography>
            <DropdownMenu
              list={elementOption}
              label={selectedElement}
              onMenuClick={handleElementChange}
              buttonVariant="outlined"
            />
            <Typography align="left" color="textSecondary">
               選擇此元素
            </Typography>
            <FormControlLabel
              classes={{
                root: classes.checkForm
              }}
              control={
                <Checkbox
                  checked={elementList.indexOf(selectedElement) > -1}
                  onChange={handleElementSelect(selectedElement)}
                  value="checkedB"
                  color="primary"
                />
              }
            />
            <Button 
              disabled={elementList.length === 0}
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
      {
        spectrumData.subclass && (
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Typography align="left" color="textSecondary" >
                  恆星的成分為：
                </Typography>
                {
                  elementComposition.map(ele => <Chip
                    color="primary"
                    classes={{ root: classes.chip }}
                    key={ele}
                    label={ele}
                  />)
                }
                <Divider classes={{ root: classes.divider }}/>
                <Typography align="left" color="textSecondary" >
                  你的答案：
                </Typography>
                {
                  elementList.map(ele => <Chip
                    color="primary"
                    variant="outlined"
                    classes={{ root: classes.chip }}
                    key={ele}
                    label={ele}
                  />)
                }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                關閉
              </Button>
            </DialogActions>
          </Dialog>
        )
      }
    </>
  )
}

export default SpectrumComposition