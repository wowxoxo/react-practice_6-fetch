import React, { useEffect, useState, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

const YOUR_FIREBASE_BD_URL = "";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function fetchMoviesHandlerThen() {
    setIsLoading(true);
    setError(null);
    fetch("https://swapi.dev/api/films")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return;
      })
      .then((data) => {
        setIsLoading(false);
        if (data) {
          const transformedMovies = data.results.map((movieData) => {
            return {
              id: movieData.episode_id,
              title: movieData.title,
              openingText: movieData.opening_crawl,
              releaseDate: movieData.release_date
            };
          });
          setMovies(transformedMovies);
        } else {
          setError("Error getting movies");
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e.message);
      });
  }

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(YOUR_FIREBASE_BD_URL);
      if (!response.ok) {
        throw new Error("Error getting movies!");
      }
      const data = await response.json();

      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({ ...data[key], id: key });
      }

      // const transformedMovies = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date
      //   };
      // });

      setMovies(loadedMovies);
    } catch (error) {
      // console.dir(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const addMovieHandler = async (movie) => {
    const response = await fetch(YOUR_FIREBASE_BD_URL, {
      method: "POST",
      body: JSON.stringify(movie),
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    console.log(data);
    fetchMoviesHandler();
  };

  let content = <p>No movies</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      {/* <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section> */}
      <section>
        {content}
        {/* {!isLoading && movies.length === 0 && !error && <p>No movies</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>}
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />} */}
      </section>
    </React.Fragment>
  );
}

export default App;
