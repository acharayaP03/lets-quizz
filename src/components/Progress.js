function Progress({ index, numQuestions, totalMaxPoints, points, answer }) {
	return (
		<div className='progress'>
			<progress value={index + Number(answer !== null)} max={numQuestions}></progress>
			<p>
				Question <strong>{index + 1}</strong> of {numQuestions}
			</p>
			<p>
				<strong>Points: {points}</strong> of {totalMaxPoints}
			</p>
		</div>
	);
}

export default Progress;
