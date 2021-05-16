import { createActions } from 'redux-actions';

import httpService from '../services/httpService'

import {
  csvParse
} from '../utilities/csv'

import {
  getList,
  getViewedID,
} from '../selectors/spectrum'

export const START_FETCHING = 'START_FETCHING'
export const STOP_FETCHING = 'STOP_FETCHING'
const fetchData = async (dispatch, fetch) => {
  dispatch({ type: START_FETCHING })
  const rsp = await httpService.sendRequest(fetch.method, fetch.config)
  dispatch({ type: STOP_FETCHING })
  return rsp
}

export const UPDATE_DEFAULT_ANSWER = 'UPDATE_DEFAULT_ANSWER'
export const fetchDefaultAnswer = async (dispatch, getState) => {
  const rsp = await fetchData(dispatch, { method: 'getDefaultAnswer', config:{}})
  const defaultAnswer = {}

  rsp.data.forEach( d => defaultAnswer[d.field] = d.answer)

  dispatch({
    type: UPDATE_DEFAULT_ANSWER,
    defaultAnswer,
  })
}

export const saveDefaultAnswer = values => async (dispatch, getState) => {
  /*
  const surfaceTemperature = '表面溫度為：{{t}} [br] Each spectral type is divided into 10 subclasses, A0, A1, A2, ...A9 etc. The spectral types and sub-classes represent a temperature sequence, from hotter (O stars) to cooler (M stars), and from hotter (subclass 0) to cooler (subclass 9).'
  */
  const rsp = await fetchData(dispatch, { 
    method: 'updateDefaultAnswer', 
    config:{ 
      data: {
        ...values
      },
    }
  })

  const defaultAnswer = {}
  rsp.data.forEach( d => defaultAnswer[d.field] = d.answer)
  dispatch({
    type: UPDATE_DEFAULT_ANSWER,
    defaultAnswer,
  })
}

export const UPDATE_SPECTRUM_LIST = 'UPDATE_SPECTRUM_LIST'
export const fetchSpectrumList = async (dispatch, getState) => {

  const rsp = await fetchData(dispatch, { method: 'getAllSpectrums', config:{}})
  dispatch({
    type: UPDATE_SPECTRUM_LIST,
    list: rsp.data,
  })
}

export const UPDATE_EDITED_SPECTRUM = 'UPDATE_EDITED_SPECTRUM'
export const fetchEditedSpectrumData = id => async (dispatch, getState) => {
  dispatch({
    type: UPDATE_EDITED_SPECTRUM,
    data: null,
  })
  const rsp = await fetchData(dispatch, { method: 'getSpectrum', config:{id}})
  const spectrum = {
    id: rsp.data.id,
    subclass: rsp.data.subclass,
    csvUrl: rsp.data.csv_link,
    reference: rsp.data.reference,
    redshift: rsp.data.redshift,
    redshiftText: rsp.data.redshift_text,
    surfaceTemperature: rsp.data.surface_temperature,
    elementComposition: rsp.data.element_composition,
    data: csvParse(rsp.data.data),
  }

  dispatch({
    type: UPDATE_EDITED_SPECTRUM,
    data: {
    	...spectrum
    },
  })
}

export const UPDATE_VIEWED_SPECTRUM = 'UPDATE_VIEWED_SPECTRUM'
export const updateViewedSpectrum = async (dispatch, getState) => {
  dispatch({
    type: UPDATE_VIEWED_SPECTRUM,
    data: null,
  })

  let id = getViewedID(getState())

  if(!id){
    let list = getList(getState())

    if(!list.length){
      //await dispatch(saveDefaultAnswer)
      await dispatch(fetchDefaultAnswer)
      await dispatch(fetchSpectrumList)
      list = getList(getState())
    }

    const randomIndex = Math.floor(Math.random()*list.length)
    id = list[randomIndex].id
  }

  const rsp = await fetchData(dispatch, { method: 'getSpectrum', config:{id}})
  const spectrum = {
    id: rsp.data.id,
    subclass: rsp.data.subclass,
    csvUrl: rsp.data.csv_link,
    reference: rsp.data.reference,
    redshift: rsp.data.redshift,
    surfaceTemperature: rsp.data.surface_temperature,
    elementComposition: rsp.data.element_composition,
    data: csvParse(rsp.data.data),
  }

  dispatch({
    type: UPDATE_VIEWED_SPECTRUM,
    data: {
      ...spectrum
    },
  })
}

export const UPDATE_VIEWED_ID = 'UPDATE_VIEWED_ID'
export const updateViewedID = viewedID => ({
  type: UPDATE_VIEWED_ID,
  viewedID,  
})

export const randomPickupID = async (dispatch, getState) => {
  const id = getViewedID(getState())
  if(!id){
    let list = getList(getState())

    if(!list.length){
      await dispatch(fetchDefaultAnswer)
      await dispatch(fetchSpectrumList)
      list = getList(getState())
    }

    const randomIndex = Math.floor(Math.random()*list.length)
    dispatch(updateViewedID(list[randomIndex].id))
  }
}


export const OPEN_ADD_DIALOG = 'OPEN_ADD_DIALOG'
export const openAddDialog = () => ({ type: OPEN_ADD_DIALOG})
export const CLOSE_ADD_DIALOG = 'CLOSE_ADD_DIALOG'
export const closeAddDialog = () => ({ type: CLOSE_ADD_DIALOG})

export const UPDATE_ADD_SPECTRUM_RESULT = 'UPDATE_ADD_SPECTRUM_RESULT'

export const addSpectrum = id => async (dispatch, getState) => {

  if(parseInt(id)){
    const rsp = await fetchData(dispatch, { method: 'addSpectrum', config:{ data: {id}} })
    if(rsp.message){
      dispatch({
        type: UPDATE_ADD_SPECTRUM_RESULT,
        result: {
          error: true,
          success: false,
          message: rsp.message,
        },
      })
    }else{
      dispatch({
        type: UPDATE_ADD_SPECTRUM_RESULT,
        result: {
          error: false,
          success: true,
          message: '',
        },
      })
    }  
  } else {
    dispatch({
      type: UPDATE_ADD_SPECTRUM_RESULT,
      result: {
        error: true,
        success: false,
        message: '請輸入數字',
      },
    })
  }
}

export const updateSpectrum = (id, values) => async (dispatch, getState) => {
  const rsp = await fetchData(dispatch, { 
    method: 'updateSpectrum', 
    config:{ 
      id,
      data: {
        ...values
      },
    }
  })
  console.log(rsp)
}

