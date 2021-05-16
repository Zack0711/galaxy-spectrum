import React from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import Progress from '../progress/index.jsx'

const FormDialog = props => {
  const {
    title,
    open,
    children,
    onClose,
    onConfirm,
    disabled,
    isFetching,
    className,
  } = props

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title" >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent style={{position: 'relative', minHeight: '60px', minWidth: '240px'}}>
        { isFetching && <Progress/> }
        { children }
      </DialogContent>
      <DialogActions>
        {
          onConfirm && (
            <Button onClick={onConfirm} variant="contained" color="primary" disabled={isFetching}>
              確定
            </Button>
          )
        }
        <Button onClick={onClose} color="primary" disabled={isFetching}>
          取消
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FormDialog
