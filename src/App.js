import { useEffect, useReducer } from 'react';
import { Header, StartQuizz, Question } from './components';
import Main from './layouts/main';
import { Loader, Error, NextButton } from './ui-components';
const initialState = { questions: [], status: 'loading', index: 0, answer: null, points: 0 };

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
		case 'newAnswer':
			const question = state.questions[state.index];
			return {
				...state,
				answer: action.payload,
				points:
					action.payload === question.correctOption ? state.points + question.points : state.points,
			};
		case 'nextQuestion':
			return {
				...state,
				index: state.index + 1,
				answer: null,
			};
		default:
			throw new Error(`Unrecognized action: ${action.type}`);
	}
}

function App() {
	const [{ questions, status, index, answer }, dispatch] = useReducer(reducer, initialState);

	//computed props
	const totalQuestions = questions.length;

	useEffect(function () {
		fetch('http://localhost:9000/questions')
			.then((res) => res.json())
			.then((data) => dispatch({ type: 'dataReceived', payload: data }))
			.catch(() => dispatch({ type: 'dataFailed' }));
	}, []);
	return (
		<div className='app'>
			<Header />
			<Main>
				{status === 'loading' && <Loader />}
				{status === 'error' && <Error />}

				{status === 'ready' && <StartQuizz totalQuestions={totalQuestions} dispatch={dispatch} />}
				{console.log(status)}
				{status === 'active' && (
					<>
						<Question question={questions[index]} dispatch={dispatch} answer={answer} />
						<NextButton dispatch={dispatch} answer={answer} />
					</>
				)}
			</Main>
		</div>
	);
}

export default App;
