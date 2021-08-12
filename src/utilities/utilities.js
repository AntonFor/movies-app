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