import { useEffect } from 'react';

export function useFetchQuestions() {
	const questions = [];
	useEffect(() => {
		const questions = fetch('http://localhost:9000/questions')
			.then((response) => response.json())
			.then((data) => console.log(data));
	}, []);

	return {
		questions,
	};
}
