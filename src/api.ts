const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export function fetchMovieNow() {
  const json = fetch(`
    ${BASE_URL}/movie/now_playing?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
  return json;
}
