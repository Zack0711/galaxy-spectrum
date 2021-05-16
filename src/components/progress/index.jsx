import React from 'react';

import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  progress: {
    margin: theme.spacing(2),
  },
}))

const Progress = props => {

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress className={classes.progress} />
    </div>
  )
}

export default Progress
