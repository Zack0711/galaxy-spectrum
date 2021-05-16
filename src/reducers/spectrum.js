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
  START_FETCHING: state => ({
    ...state,
    isFetching: true,
  }),
  STOP_FETCHING: state => ({
    ...state,
    isFetching: false,
  }),
  OPEN_ADD_DIALOG: state => ({
    ...state,
    addDialogOpen: true,
  }),
  CLOSE_ADD_DIALOG: state => ({
    ...state,
    addDialogOpen: false,
  }),
  UPDATE_SPECTRUM_LIST: (state, payload) => {
    return({
      ...state,
      list: payload.list,
    })    
  },
  UPDATE_DEFAULT_ANSWER: (state, payload) => {
    return({
      ...state,
      defaultAnswer: payload.defaultAnswer,
    })    
  },
  UPDATE_EDITED_SPECTRUM: (state, payload) => {
    return({
      ...state,
      selected: {
        ...payload.data
      }
    })
  },
  UPDATE_ADD_SPECTRUM_RESULT: (state, payload) => {
    return({
      ...state,
      addSpectrumResult: {
        ...state.addSpectrumResult,
        ...payload.result,
      }
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