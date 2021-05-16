import get from 'lodash/get'

export const getList = state => get(state, 'spectrum.list', [])

export const getSelected = state => get(state, 'spectrum.selected', {})

export const getViewed = state => get(state, 'spectrum.viewed', {})

export const getViewedID = state => get(state, 'spectrum.viewedID', null)

export const getIsFetching = state => get(state, 'spectrum.isFetching', false)

export const getIsAddDialogOpen = state => get(state, 'spectrum.addDialogOpen', false)

export const getIsAddSpectrumResult = state => get(state, 'spectrum.addSpectrumResult', {})

export const getDefaultAnswer = state => get(state, 'spectrum.defaultAnswer', {})
