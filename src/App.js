import { useEffect, useReducer } from 'react';
import { Header, StartQuizz } from './components';
import Main from './layouts/main';
import { Loader, Error } from './ui-components';
const initialState = { questions: [], status: 'loading' };

function reducer(state, action) {
	switch (action.type) {
		case 'dataReceived':
			return {
				...state,
				questions: action.payload,
				status: 'ready',
			};
		case 'error':
			return {
				...state,
				status: 'error',
			};
		default:
			throw new Error(`Unrecognized action: ${action.type}`);
	}
}
function App() {
	const [{ questions, status }, dispatch] = useReducer(reducer, initialState);

	useEffect(function () {
		fetch('http://localhost:9000/questions')
			.then((res) => res.json())
			.then((data) => dispatch({ type: 'dataReceived', payload: data }))
			.catch(() => dispatch({ type: 'error' }));
	});
	return (
		<div className='app'>
			<Header />
			<Main>
				{status === 'loading' && <Loader />}
				{status === 'error' && <Error />}

				{status === 'ready' && <StartQuizz />}
			</Main>
		</div>
	);
}

export default App;
