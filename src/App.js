import { useEffect, useReducer } from 'react';
import { Header, StartQuizz, Question, Progress, FinishQuiz } from './components';
import Main from './layouts/main';
import { Loader, Error, NextButton } from './ui-components';
const initialState = {
	questions: [],
	status: 'loading',
	index: 0,
	answer: null,
	points: 0,
	highscore: 0,
};

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
		case 'finish':
			return {
				...state,
				status: 'finished',
				highscore: state.points > state.highscore ? state.points : state.highscore,
			};
		case 'restart':
			return {
				...initialState,
				status: 'ready',
				questions: state.questions,
			};
		default:
			throw new Error(`Unrecognized action: ${action.type}`);
	}
}

function App() {
	const [{ questions, status, index, answer, points, highscore }, dispatch] = useReducer(
		reducer,
		initialState,
	);

	//computed props
	const totalQuestions = questions.length;
	const totalMaxPoints = questions.reduce(
		(previounPoints, question) => previounPoints + question.points,
		0,
	);

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

				{status === 'active' && (
					<>
						<Progress
							index={index}
							numQuestions={totalQuestions}
							points={points}
							totalMaxPoints={totalMaxPoints}
							answer={answer}
						/>
						<Question question={questions[index]} dispatch={dispatch} answer={answer} />
						<NextButton
							dispatch={dispatch}
							answer={answer}
							index={index}
							numQuestions={totalQuestions}
						/>
					</>
				)}
				{status === 'finished' && (
					<FinishQuiz
						points={points}
						totalMaxPoints={totalMaxPoints}
						highscore={highscore}
						dispatch={dispatch}
					/>
				)}
			</Main>
		</div>
	);
}

export default App;
