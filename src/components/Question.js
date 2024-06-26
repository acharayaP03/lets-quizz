import { AnswerList } from '../components';
function Question({ question, answer, dispatch }) {
	return (
		question.question && (
			<div>
				<h4>{question.question}</h4>
				<AnswerList question={question} answer={answer} dispatch={dispatch} />
			</div>
		)
	);
}

export default Question;
