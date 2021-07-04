export default function truncate(str, n) {
	if (str.length <= n) return str;
	let subString = str.substr(0, n-1);
	return subString.substr(0, subString.lastIndexOf(' ')) + " ...";
};