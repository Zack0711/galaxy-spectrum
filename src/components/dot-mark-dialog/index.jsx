import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const useStyles = makeStyles(theme => ({
}))

const DotMarkDialog = props => {
  const {
    open,
    onClose,
  } = props;

  const classes = useStyles()

  useEffect(() => {
  }, [])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        編輯標記資料
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
        XD
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          關閉
        </Button>
      </DialogActions>
    </Dialog>      
  )
}

export default DotMarkDialog;