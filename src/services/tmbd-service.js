class TmbdService {
	async getResource(url, obj = null) {
		const response = await fetch(url, obj);
		if (!response.ok) {
			throw new Error(response.status);
		}
		return await response.json();
	}

	api_key = 'd619adfb47ad0346fcb305088c087ffc';

	getMovies(movie, page) {
		return this.getResource(`https://api.themoviedb.org/3/search/movie?api_key=${this.api_key}&query=${movie}&page=${page}`);
	}

	getSessionId() {
		return this.getResource(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.api_key}`);
	}

	setRateMovie(movie_id, value, session) {
		const requestBody = {"value": value};
		this.getResource(`https://api.themoviedb.org/3/movie/${movie_id}/rating?api_key=${this.api_key}&guest_session_id=${session}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json;charset=utf-8'},
			body: JSON.stringify(requestBody)
		});
	}

	getRateMovies(session) {
		return this.getResource(`https://api.themoviedb.org/3/guest_session/${session}/rated/movies?api_key=${this.api_key}`);
	}

	getGenresMovies() {
		return this.getResource(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.api_key}`);
	}
}

export const tmbdService = new TmbdService();