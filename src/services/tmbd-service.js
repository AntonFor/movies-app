/* eslint-disable no-return-await */
class TmbdService {
	async getResource(url, obj = null) {
		const response = await fetch(url, obj);
		if (!response.ok) {
			throw new Error(response.status);
		}
		return await response.json();
	}

	apiKey = 'd619adfb47ad0346fcb305088c087ffc';

	getMovies(movie, page) {
		return this.getResource(`https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${movie}&page=${page}`);
	}

	getSessionId() {
		return this.getResource(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.apiKey}`);
	}

	setRateMovie(movieId, value, session) {
		const requestBody = {"value": value};
		this.getResource(`https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${session}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json;charset=utf-8'},
			body: JSON.stringify(requestBody)
		});
	}

	getRateMovies(session) {
		return this.getResource(`https://api.themoviedb.org/3/guest_session/${session}/rated/movies?api_key=${this.apiKey}`);
	}

	getGenresMovies() {
		return this.getResource(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}`);
	}
}

const tmbdService = new TmbdService();

export default tmbdService;