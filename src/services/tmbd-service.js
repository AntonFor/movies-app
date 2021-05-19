class TmbdService {
	async getResource(url) {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Could not fetch ${url}` +
				`, received ${response.status}`);
		}
		return await response.json();
	}

	getMovies() {
		const api_key = 'd619adfb47ad0346fcb305088c087ffc';
		const movie = 'return';
		return this.getResource(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${movie}`)
	}
}

export const tmbdService = new TmbdService();