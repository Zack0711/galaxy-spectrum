import Immutable from 'immutable';
import union from 'lodash/union'
import { handleActions } from 'redux-actions';

const initState = {
  list: [],
  selected: {},
  viewedID: null,
  viewed: {},
  isFetching: false,
  addDialogOpen: false,
  addSpectrumResult: {
    error: false,
    success: false,
    message: '',
  },
  defaultAnswer: {},
}

const spectrumReducer = handleActions({
  UPDATE_SPECTRUM_LIST: (state, payload) => {
    return({
      ...state,
      list: payload.list,
    })    
  },
  UPDATE_VIEWED_SPECTRUM: (state, payload) => {
    return({
      ...state,
      viewed: {
        ...payload.data
      }
    })
  },
  UPDATE_VIEWED_ID: (state, payload) => {
    return({
      ...state,
      viewedID: payload.viewedID,
    })
  },
}, initState)

export default spectrumReducer