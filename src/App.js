import { useEffect, useReducer } from 'react';
import { Header, StartQuizz, Question, Progress, FinishQuiz, Timer } from './components';
import Main from './layouts/main';
import Footer from './layouts/footer';
import { Loader, Error, NextButton } from './ui-components';
const initialState = {
	questions: [],
	status: 'loading',
	index: 0,
	answer: null,
	points: 0,
	highscore: 0,
	timeRemaining: null,
};
const SEC_PER_QUESTION = 30;

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
				timeRemaining: state.questions.length * SEC_PER_QUESTION,
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
		case 'tick':
			return {
				...state,
				timeRemaining: state.timeRemaining - 1,
				status: state.timeRemaining === 0 ? 'finished' : state.status,
			};
		default:
			throw new Error(`Unrecognized action: ${action.type}`);
	}
}

function App() {
	const [{ questions, status, index, answer, points, highscore, timeRemaining }, dispatch] =
		useReducer(reducer, initialState);

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
						<Footer>
							<Timer dispatch={dispatch} timeRemaining={timeRemaining} />

							<NextButton
								dispatch={dispatch}
								answer={answer}
								index={index}
								numQuestions={totalQuestions}
							/>
						</Footer>
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
