import { Component } from 'react';
import { Layout, Spin, Alert } from 'antd';
import { Offline, Online } from 'react-detect-offline';
import Header from '../Header';
import Searchbar from '../Searchbar';
import MovieList from '../MovieList';
import MoviesService from '../../Services/MoviesService';
import './App.css';

const { Content } = Layout;

export default class App extends Component {
  state = {
    activeTab: 'search',
    movies: [],
    selectedPage: 1,
    pages: 0,
    query: '',
    ratedMovies: [],
    ratedPage: 1,
    ratedPages: 0,
    guestSessionId: '',
    genres: [],
    loading: false,
  };

  moviesService = new MoviesService();

  componentDidMount() {
    const storedSession = localStorage.getItem('guestSessionId');
    if (storedSession) {
      this.setState({ guestSessionId: storedSession }, () => {
        if (this.state.activeTab === 'rated') {
          this.fetchRatedMovies();
        }
      });
    } else {
      this.moviesService
        .createGuestSession()
        .then((guestSessionId) => {
          localStorage.setItem('guestSessionId', guestSessionId);
          this.setState({ guestSessionId }, () => {
            if (this.state.activeTab === 'rated') {
              this.fetchRatedMovies();
            }
          });
        })
        .catch((error) =>
          console.error('Ошибка создания гостевой сессии', error)
        );
    }
    this.moviesService
      .getGenres()
      .then((data) => {
        this.setState({ genres: data });
      })
      .catch((error) => console.error('Ошибка загрузки жанров', error));
  }

  setActive = (activeKey) => {
    this.setState(
      {
        activeTab: activeKey,
        movies: [],
        query: '',
        selectedPage: 1,
        pages: 0,
      },
      () => {
        if (activeKey === 'rated') {
          this.fetchRatedMovies();
        }
      }
    );
  };

  handleSearch = (e) => {
    const query = e.target.value;

    this.setState({ query, selectedPage: 1 }, () => {
      if (query.trim().length >= 2) {
        this.fetchMovies(query, 1);
      } else {
        this.setState({ movies: [], pages: 0 });
      }
    });
  };

  fetchMovies = (query, page = 1) => {
    this.setState({ loading: true });
    if (!query || query.trim().length < 2) {
      this.setState({ movies: [], pages: 1, selectedPage: 1 });
      return;
    }

    this.moviesService
      .searchMovies(query, page)
      .then((data) => {
        let updatedMovies = data.results || [];

        if (this.state.guestSessionId) {
          this.moviesService
            .getRatedMovies(this.state.guestSessionId, 1)
            .then((ratedData) => {
              const ratedMovies = ratedData.results || [];

              updatedMovies = updatedMovies.map((movie) => {
                const ratedMovie = ratedMovies.find(
                  (rated) => rated.id === movie.id
                );
                return {
                  ...movie,
                  userRating: ratedMovie ? ratedMovie.rating : null,
                };
              });

              this.setState({
                movies: updatedMovies,
                pages: data.total_pages || 1,
                selectedPage: page || 1,
                loading: false,
              });
            })
            .catch((error) => {
              console.error('Ошибка при загрузке оценённых фильмов:', error);
            });
        } else {
          this.setState({
            movies: updatedMovies,
            pages: data.total_pages || 1,
            selectedPage: page || 1,
            loading: false,
          });
        }
      })
      .catch((error) => {
        console.error('Ошибка при загрузке фильмов:', error);
        this.setState({
          movies: [],
          pages: 1,
          selectedPage: 1,
          loading: false,
        });
      });
  };

  fetchRatedMovies = (page = 1) => {
    const { guestSessionId } = this.state;
    this.setState({ loading: true });
    if (!guestSessionId) return;
    this.moviesService
      .getRatedMovies(guestSessionId, page)
      .then((data) => {
        const ratedMovies = data.results.map((movie) => ({
          ...movie,
          userRating: movie.rating,
        }));
        this.setState({
          ratedMovies,
          ratedPages: data.total_pages,
          ratedPage: page,
          loading: false,
        });
      })
      .catch((error) => {
        console.error('Ошибка при загрузке оценённых фильмов:', error);
      });
  };

  changePage = (page) => {
    this.setState({ selectedPage: page }, () => {
      if (this.state.query) {
        this.fetchMovies(this.state.query, page);
      }
    });
  };

  changeRatedPage = (page) => {
    this.setState({ ratedPage: page });
    this.fetchRatedMovies(page);
  };

  onRatingChange = (movieId, newRating) => {
    const { activeTab } = this.state;
    if (activeTab === 'search') {
      const updatedMovies = this.state.movies.map((movie) => {
        if (movie.id === movieId) {
          return { ...movie, userRating: newRating };
        }
        return movie;
      });
      this.setState({ movies: updatedMovies });
    } else if (activeTab === 'rated') {
      const updatedRatedMovies = this.state.ratedMovies.map((movie) => {
        if (movie.id === movieId) {
          return { ...movie, userRating: newRating };
        }
        return movie;
      });
      this.setState({ ratedMovies: updatedRatedMovies });
    }
  };

  render() {
    const {
      loading,
      activeTab,
      movies,
      selectedPage,
      pages,
      ratedMovies,
      ratedPage,
      ratedPages,
      guestSessionId,
      genres,
    } = this.state;

    return (
      <Layout className="appLayout">
        <Offline>
          <Alert message="No internet connection" type="warning" showIcon />
        </Offline>
        <Online>
          <Header active={activeTab} setActive={this.setActive} />
          {loading && <Spin className="spin" />}
          <Content className="appContent">
            {activeTab === 'search' && (
              <>
                <Searchbar search={this.handleSearch} />
                <MovieList
                  movies={movies}
                  genres={genres}
                  Movies={this.moviesService}
                  guestSessionId={guestSessionId}
                  onRatingChange={this.onRatingChange}
                  selectedPage={selectedPage}
                  pages={pages}
                  changePage={this.changePage}
                />
              </>
            )}
            {activeTab === 'rated' && (
              <MovieList
                movies={ratedMovies}
                genres={genres}
                Movies={this.moviesService}
                guestSessionId={guestSessionId}
                onRatingChange={this.onRatingChange}
                selectedPage={ratedPage}
                pages={ratedPages}
                changePage={this.changeRatedPage}
              />
            )}
          </Content>
        </Online>
      </Layout>
    );
  }
}
