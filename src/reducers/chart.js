import Immutable from 'immutable';
import union from 'lodash/union'
import { handleActions } from 'redux-actions';

const initState = {
  spectrum: {
    list: [],
    data: {},
    selected: null
  },
}

const chartReducer = handleActions({
  UPDATE_CHART_DATA: (state, payload) => {
  	const spectrum = {
  		list: union(state.spectrum.list, payload.list),
  		data: {
  			...state.spectrum.data,
  			...payload.data,
  		}
  	}
	  return({
	  	...state,
	  	spectrum,
	  })  	
	},
  SELECT_SPECTRUM: (state, payload) => ({
    ...state,
    spectrum: {
      ...state.spectrum,
      selected: payload.target,
    }
  })
}, initState)

export default chartReducer