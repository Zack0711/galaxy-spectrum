import { createActions } from 'redux-actions';

import getCSVData from '../services/getCSVData'
import { csvParse } from '../utilities/csv'

import {
  getList,
  getViewedID,
} from '../selectors/spectrum'

export const init = async (dispatch, getState) => {
  const list = getList(getState())
  if (!list.length) {
    await dispatch(fetchSpectrumList)
  }
}

export const UPDATE_SPECTRUM_LIST = 'UPDATE_SPECTRUM_LIST'
export const fetchSpectrumList = async (dispatch, getState) => {

  const list = await fetch(`./data/list.json`).then(rsp => rsp.json())
  const randomIndex = Math.floor(Math.random()*list.length)

  dispatch(updateViewedID(list[randomIndex]))
  dispatch({
    type: UPDATE_SPECTRUM_LIST,
    list,
  })
}

export const UPDATE_VIEWED_SPECTRUM = 'UPDATE_VIEWED_SPECTRUM'
export const updateViewedSpectrum = async (dispatch, getState) => {
  dispatch({
    type: UPDATE_VIEWED_SPECTRUM,
    data: null,
  })

  const id = getViewedID(getState())

  if(id) {
    const info = await fetch(`./data/${id}/info.json`).then(rsp => rsp.json())
    const data = await getCSVData(`./data/${id}/csvSpectrum.csv`)

    const spectrum = {
      id: info.id,
      subclass: info.subclass,
      redshift: info.redshift,
      data: data,
    }

    dispatch({
      type: UPDATE_VIEWED_SPECTRUM,
      data: {
        ...spectrum
      },
    })
  }

}

export const UPDATE_VIEWED_ID = 'UPDATE_VIEWED_ID'
export const updateViewedID = viewedID => ({
  type: UPDATE_VIEWED_ID,
  viewedID,  
})