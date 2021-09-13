/* eslint-disable no-alert */
import tmbdService from '../services/tmbd-service';

export function getGenre(genresData, genre) {
	return genre.map(currentGenre => genresData.find(item => item.id === currentGenre).name);
}

export function getUrlPoster(poster) {
	return `https://image.tmdb.org/t/p/w300/${poster}`;
}

export function truncate(str, num) {
	if (str.length <= num) return str;
	const subString = str.substr(0, num-1);
	return `${subString.substr(0, subString.lastIndexOf(' '))  } ...`;
};

export function settingColor(value, installer) {
	if (value >= 0 && value < 3) installer('card__badge-red');
	else if (value >= 3 && value < 5) installer('card__badge-orange');
	else if (value >= 5 && value < 7) installer('card__badge-yellow');
	else if (value >= 7) installer('card__badge-green');
}

function onError(err) {
	switch(err.message) {
		case '422':
			this.setState(() => ({
					unprocessableEntity: true,
					loading: false
				}));
			break;
		case 'Failed to fetch':
			this.setState(() => ({
					disconnected: true,
					loading: false
				}));
			break;
		default:
			this.setState(() => ({
					error: true,
					loading: false
				}));
	}
}

export function getRateMovies() {
	const { sessionId } = this.state;
	let objPars;
	try {
		const obj = localStorage.getItem('rate');
		objPars = JSON.parse(obj);
	} catch(err) {
		if (err instanceof SyntaxError) {
			objPars = null;
			alert(`JSON syntax error: ${  err.message  }. Movies data that has been rated is lost`);
		} else {
			throw err;
		}
	}
	finally {
		objPars = objPars === null ? {} : objPars;
		const arrPars = Object.keys(objPars).map((key) => [Number(key), objPars[key]]);
		const getRate = new Map(arrPars);
		for (const [ id, value ] of getRate) {
			tmbdService.setRateMovie(id, value, sessionId);
		}
	}
}

export function updateRateMovies() {
	const { sessionId } = this.state;
	tmbdService.getRateMovies(sessionId)
		.then((body) => {
			this.setState(() => ({
					moviesData: body.results,
					loading: false,
					error: false,
					unprocessableEntity: false,
					disconnected: false,
					totalPages: body.total_pages,
					totalResults: body.total_results, 
				}))
		}).catch((err) => onError.call(this, err));
}

export function updateMovies() {
	const { searchMovieName, currentPage } = this.state;
	tmbdService.getMovies(searchMovieName, currentPage)
		.then((body) => {
			this.setState(() => ({
					moviesData: body.results,
					loading: false,
					error: false,
					unprocessableEntity: false,
					disconnected: false,
					totalPages: body.total_pages,
					totalResults: body.total_results, 
				}))
		}).catch((err) => onError.call(this, err));
}

export function updateSessionId() {
	tmbdService.getSessionId()
		.then(body => {
			this.setState(() => ({
					sessionId: body.guest_session_id
				}))
		}).catch((err) => onError.call(this, err));
}

export function updateGenresMovies() {
	tmbdService.getGenresMovies()
		.then((body) => {
			this.setState(() => ({
					genresData: body.genres
				}))
		})
}

export function setStateRateMovies(id, value) {
	this.setState(({ rateMovies }) => {
		const map = new Map(rateMovies.entries());
		map.set(id, value);
		const obj = Object.fromEntries(map);
		localStorage.setItem('rate', JSON.stringify(obj));
		return {
			rateMovies: map
		}
	})
}

export function setRate() {
	let objPars;
	try {
		const obj = localStorage.getItem('rate');
		objPars = JSON.parse(obj);
	} catch(err) {
		if (err instanceof SyntaxError) {
			objPars = null;
			alert(`JSON syntax error: ${  err.message  }. Movies data that has been rated is lost`);
		} else {
			throw err;
		}
	} finally {
		objPars = objPars === null ? {} : objPars;
		const arrPars = Object.keys(objPars).map((key) => [Number(key), objPars[key]]);
		const getRate = new Map(arrPars);
		this.setState(() => ({
			rateMovies: getRate
		}))
	}
}