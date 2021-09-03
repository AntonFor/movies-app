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