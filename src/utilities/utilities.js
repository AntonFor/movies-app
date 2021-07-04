export function getGenre(genresData, genre) {
	return genre.map(genre => {
		return genresData.find(item => item.id === genre).name;
	});
}

export function getUrlPoster(poster) {
	return `https://image.tmdb.org/t/p/w300/${poster}`;
}

export function truncate(str, n) {
	if (str.length <= n) return str;
	let subString = str.substr(0, n-1);
	return subString.substr(0, subString.lastIndexOf(' ')) + " ...";
};