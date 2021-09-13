const stateDefault = {
	moviesData: [],
	loading: true,
	error: false,
	unprocessableEntity: false,
	disconnected: false,
	searchMovieName: '',
	totalPages: 1,
	currentPage: 1,
	totalResults: null,
	sessionId: null,
	activeKey: '1',
	genresData: null,
	rateMovies: new Map()
}

export default stateDefault;