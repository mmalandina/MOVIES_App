export default class MoviesService {
  baseApi = 'https://api.themoviedb.org/3';
  token = '94829e0daab30ab20f6e4ceb9c58c196';

  async getResource(url) {
    const separator = url.includes('?') ? '&' : '?';
    const fullUrl = `${this.baseApi}${url}${separator}api_key=${this.token}`;
    const response = await fetch(fullUrl);

    if (!response.ok) {
      if (response.status === 404 && url.includes('/rated/movies')) {
        return { results: [], total_pages: 1 };
      }
      throw new Error(`Could not fetch ${url}, received ${response.status}`);
    }
    return response.json();
  }

  getMovie(id) {
    return this.getResource(`/movie/${id}`);
  }

  searchMovies(query, page) {
    return this.getResource(`/search/movie?query=${query}&page=${page}`);
  }

  createGuestSession = async () => {
    const response = await this.getResource(
      '/authentication/guest_session/new'
    );
    return response.guest_session_id;
  };

  getGenres = async () => {
    const response = await this.getResource('/genre/movie/list');
    return response.genres;
  };

  rateMovie = async (movieId, rating, guestSessionId) => {
    const url = `/movie/${movieId}/rating?guest_session_id=${guestSessionId}`;
    const res = await fetch(`${this.baseApi}${url}&api_key=${this.token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: rating }),
    });
    if (!res.ok) {
      throw new Error(
        `Could not post rating for movie ${movieId}, received ${res.status}`
      );
    }
    return res.json();
  };

  getRatedMovies = (guestSessionId, page = 1) => {
    return this.getResource(
      `/guest_session/${guestSessionId}/rated/movies?page=${page}`
    );
  };
}
