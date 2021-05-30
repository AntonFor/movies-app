//import AbortController from "abort-controller"

class TmbdService {
	//controller = new AbortController();
	//signal = this.controller.signal;

	async getResource(url) {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(response.status);
		}
		return await response.json();
	}

	getMovies(movie, page) {
		const api_key = 'd619adfb47ad0346fcb305088c087ffc';
		return this.getResource(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${movie}&page=${page}`)
	}
}

export const tmbdService = new TmbdService();