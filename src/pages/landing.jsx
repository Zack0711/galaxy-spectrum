import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'

import ListAltIcon from '@material-ui/icons/ListAlt'
import DescriptionIcon from '@material-ui/icons/Description'

import {
  useHistory,
} from "react-router-dom"

import Progress from '../components/progress/index.jsx'

import {
  updateViewedID,
} from '../actions'

import {
  getList,
  getViewedID,
  getIsFetching,
} from '../selectors/spectrum'

import FormDialog from '../components/form-dialog/index.jsx'

const Copyright = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {'Copyright © '}
    <Link color="inherit" href="http://cwise.gise.ntnu.edu.tw/">
      cwise.gise.ntnu.edu.tw
    </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
)

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  main: {
    minHeight: 'calc(100vh - 116px)',
    position: 'relative',
  },
  button: {
    margin: theme.spacing(1),
  },  
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const cards = [1, 2, 3];

const Landing = () => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()

  const isFetching = useSelector(getIsFetching)
  const viewedID = useSelector(getViewedID)
  const list = useSelector(getList)

  const [listOpen, setListOpen] = useState(false)

  const handleListButtonClick = () => {
    setListOpen(true)
  }

  const closeList = () =>{
    setListOpen(false)    
  }

  const selectSpectrun = id => {
    dispatch(updateViewedID(id))
    setListOpen(false)    
  }

  return (
    <>
      <CssBaseline />
      <main className={classes.main}>
        { isFetching && <Progress/> }
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              光譜學習軟體
            </Typography>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Typography component="p" variant="body1" align="center" color="textPrimary">
                星體光譜ID：{viewedID}
              </Typography>
              <Button variant="contained" color="primary" className={classes.button} onClick={handleListButtonClick}>
                <ListAltIcon />
              </Button>
            </Grid>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              點擊以下單元進行
            </Typography>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardActionArea onClick={() => {history.push('/spectrum-temperature')}}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://media.apnarm.net.au/media/images/2019/01/17/b881764511z1_20190117092806_000g8c1cunjp2-0-l67ej4qv01hj7qv8nr2_ct1880x930.jpg"
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      恆星的等效溫度
                    </Typography>
                    <Typography>
                      由普朗克的輻射分佈曲線對照恆星總輻射量，找出恆星的等效溫度。
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardActionArea onClick={() => {history.push('/spectrum-composition')}}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://scx1.b-cdn.net/csz/news/800/2016/sofiaobserva.jpg"
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      恆星的成分組成
                    </Typography>
                    <Typography>
                      比對元素的光譜找出恆星的成分組成。
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardActionArea onClick={() => {history.push('/spectrum-redshift')}}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://www.physicsforums.com/attachments/thedynamicdu-png.190629/"
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      恆星的逕向速度
                    </Typography>
                    <Typography>
                      找出恆星的波長位移量，算出逕向速度。
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </main>
      <FormDialog 
        title={'選擇其他光譜資料'}
        open={listOpen} 
        onClose={closeList}  
        isFetching={isFetching}
      >
        <List>
          {
            list.map( d => (
              <ListItem 
                key={d.id} 
                onClick={() => selectSpectrun(d.id)} 
                selected={d.id === viewedID}
                button
              >
                <ListItemAvatar>
                  <Avatar>
                    <DescriptionIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={d.id}
                />
              </ListItem>
            ))
          }
        </List>
      </FormDialog>

      <footer className={classes.footer}>
        <Copyright />
      </footer>
    </>
  )  
}

export default Landing