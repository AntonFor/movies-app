export default function getGenre(genresData, genre) {
	return genre.map(genre => {
		return genresData.find(item => item.id === genre).name;
	});
}