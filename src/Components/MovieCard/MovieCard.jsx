import { Component } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Rate } from 'antd';
import TrimText from '../../Services/TrimText';
import TrimmedTitle from '../../services/TrimmedTitle';
import './MovieCard.css';

export default class MovieCard extends Component {
  handleRatingChange = (newRating) => {
    const { movieId, Movies, guestSessionId, onRatingChange } = this.props;
    Movies.rateMovie(movieId, newRating, guestSessionId).then(() => {
      onRatingChange(movieId, newRating);
    });
  };

  getRatingClass = () => {
    const { rating } = this.props;
    if (rating >= 7) return 'high';
    if (rating >= 5) return 'mid';
    if (rating >= 3) return 'low';
    return 'very-low';
  };

  render() {
    const { movieTitle, description, releaseDate, rating, genres, userRating } =
      this.props;

    let { imgPath } = this.props;
    if (!imgPath) {
      imgPath = 'https://subscoop.com/asset/placeholder.jpg';
    }

    const formattedDate = releaseDate
      ? format(new Date(releaseDate), 'MMMM d, yyyy')
      : null;
    const shortDesc = TrimText(description, 170);
    const imgSrc = imgPath.startsWith('http')
      ? imgPath
      : `https://image.tmdb.org/t/p/w500/${imgPath}`;
    const genresElement = genres
      .map((genreItem) => (
        <li key={genreItem.id} className="genresList__item">
          {genreItem.name}
        </li>
      ))
      .slice(0, 3);

    return (
      <li className="movieCard">
        <img className="movieImg" src={imgSrc} />
        <div className="movieCardContent">
          <TrimmedTitle className="movieTitle" title={movieTitle} />
          <span className="releaseDate">{formattedDate}</span>
          <ul className="genresList">{genresElement}</ul>
          <p className="description">{shortDesc}</p>
          <Rate
            value={userRating}
            count={10}
            allowHalf
            className="ant-rate"
            onChange={this.handleRatingChange}
          />
          <div className={`ratingCircle ${this.getRatingClass(rating)}`}>
            {rating.toFixed(1)}
          </div>
        </div>
      </li>
    );
  }
}

MovieCard.propTypes = {
  movieTitle: PropTypes.string.isRequired,
  description: PropTypes.string,
  releaseDate: PropTypes.string.isRequired,
  rating: PropTypes.number,
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onRatingChange: PropTypes.func.isRequired,
  userRating: PropTypes.number,
  movieId: PropTypes.number.isRequired,
  Movies: PropTypes.shape({
    rateMovie: PropTypes.func.isRequired,
  }).isRequired,
  guestSessionId: PropTypes.string.isRequired,
  imgPath: PropTypes.string,
};

MovieCard.defaultProps = {
  description: '',
  rating: 0,
  userRating: 0,
  imgPath: '',
};
