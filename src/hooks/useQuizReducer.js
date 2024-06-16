import { useReducer } from 'react';
const initialState = { questions: [], status: 'loading' };

function reducer(state, action) {
	switch (action.type) {
		case 'dataReceived':
			return {
				...state,
				questions: action.payload,
				status: 'ready',
			};
		case 'start':
			return {
				...state,
				status: 'active',
			};
		case 'dataFailed':
			return {
				...state,
				status: 'error',
			};
		default:
			throw new Error(`Unrecognized action: ${action.type}`);
	}
}
