function StartQuizz({ totalQuestions, dispatch }) {
	return (
		<div className='start'>
			<h2>Welcome to the Let's Quizz!</h2>
			<h3>{totalQuestions} questions to test your quizz mastery</h3>
			<button className='btn btn-ui' onClick={() => dispatch({ type: 'start' })}>
				Let's start
			</button>
		</div>
	);
}

export default StartQuizz;
