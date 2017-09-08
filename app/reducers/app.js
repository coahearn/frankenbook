/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_APP_DATA_LOAD,
	GET_APP_DATA_SUCCESS,
	GET_APP_DATA_FAIL,
} from 'actions/app';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
	data: undefined,
	isLoading: false,
	error: undefined,
};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	case GET_APP_DATA_LOAD:
		return {
			data: undefined,
			loading: true,
			error: undefined,
		};
	case GET_APP_DATA_SUCCESS:
		return {
			data: {
				...action.result,
				userData: undefined,
			},
			loading: false,
			error: undefined,
		};
	case GET_APP_DATA_FAIL:
		return {
			data: undefined,
			loading: false,
			error: action.err,
		};
	default:
		return state;
	}
}
