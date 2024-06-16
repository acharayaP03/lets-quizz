function AnswerList({ question, answer, dispatch }) {
	const hasAnswered = answer !== null;
	const answerIsCorrect = (index) =>
		hasAnswered ? (index === question.correctOption ? 'correct' : 'wrong') : '';

	return (
		<div className='options'>
			{question.options.map((option, index) => (
				<button
					key={index}
					className={`btn btn-option ${index === answer ? 'answer' : ''} ${answerIsCorrect(index)}`}
					onClick={() => dispatch({ type: 'newAnswer', payload: index })}
					disabled={hasAnswered}
				>
					{option}
				</button>
			))}
		</div>
	);
}

export default AnswerList;
