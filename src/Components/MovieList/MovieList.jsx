import { Component } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import MovieCard from '../MovieCard';
import './MovieList.css';

export default class MovieList extends Component {
  mapMovieGenres = (movie, genresList) => {
    if (!movie.genre_ids || genresList.length === 0) {
      return [];
    }
    return movie.genre_ids
      .map((id) => genresList.find((genre) => genre.id === id))
      .filter(Boolean)
      .slice(0, 3);
  };

  render() {
    const {
      movies,
      genres,
      Movies,
      guestSessionId,
      onRatingChange,
      selectedPage,
      pages,
      changePage,
    } = this.props;

    return (
      <div className="movieListContainer">
        <ul className="movies-list">
          {movies.map((movie) => {
            const movieGenres =
              movie.genres || this.mapMovieGenres(movie, genres);
            return (
              <MovieCard
                key={movie.id}
                movieId={movie.id}
                movieTitle={movie.title}
                description={movie.overview}
                releaseDate={movie.release_date}
                rating={movie.vote_average}
                genres={movieGenres}
                userRating={movie.userRating || 0}
                Movies={Movies}
                guestSessionId={guestSessionId}
                imgPath={movie.poster_path}
                onRatingChange={onRatingChange}
              />
            );
          })}
        </ul>
        {movies.length > 0 && (
          <Pagination
            className="pagination"
            current={selectedPage || 1}
            showSizeChanger={false}
            defaultPageSize={1}
            total={pages || 1}
            onChange={changePage}
            align="center"
          />
        )}
      </div>
    );
  }
}

MovieList.propTypes = {
  movies: PropTypes.array.isRequired,
  genres: PropTypes.array.isRequired,
  Movies: PropTypes.object.isRequired,
  guestSessionId: PropTypes.string.isRequired,
  onRatingChange: PropTypes.func.isRequired,
  selectedPage: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  changePage: PropTypes.func.isRequired,
};
