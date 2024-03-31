import React, { useEffect, useRef, useState } from 'react'

import './App.css'
import StarRating from './StarRating'
import { useMovies } from './useMovie'

const API_KEY = 'e250f78f'

const tempMovieData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2019',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
  },
]

const tempWatchedData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: 'tt0088763',
    Title: 'Back to the Future',
    Year: '1985',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
]

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)

function App() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const { error, movies, isLoading } = useMovies(query, handleCloseMovie)

  // const [watched, setWatched] = useState([])
  const [watched, setWatched] = useState(function () {
    const storedData = localStorage.getItem('watched')
    return JSON.parse(storedData)
  })

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id))
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie])
  }

  function handleRemoveWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }

  useEffect(
    function () {
      localStorage.setItem('watched', JSON.stringify(watched))
    },
    [watched]
  )

  return (
    <div className='flex flex-col gap-4'>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              watched={watched}
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
            />
          ) : (
            <>
              <Summery watched={watched} />
              <WatchList
                watched={watched}
                onRemoveWatched={handleRemoveWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </div>
  )
}

function Loader() {
  return (
    <p className='flex justify-center pt-12 text-2xl font-bold'>Loading...</p>
  )
}

function ErrorMessage({ message }) {
  return <p className='flex justify-center pt-12 text-2xl'>{message}</p>
}

function Navbar({ children }) {
  return (
    <div className='flex justify-between bg-primary h-30 px-6 py-2 w-full rounded-md'>
      <Logo />
      {children}
    </div>
  )
}

function Logo() {
  return (
    <div className='flex items-center'>
      <span role='img'>🍿</span>
      <h1 className='flex font-semibold text-white'>usePopcorn</h1>
    </div>
  )
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null)

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) return

        if (e.code === 'Enter') {
          inputEl.current.focus()
          setQuery('')
        }
      }

      document.addEventListener('keydown', callback)

      return () => document.removeEventListener('keydown', callback)
    },
    [setQuery]
  )
  return (
    <>
      <input
        type='text'
        placeholder='Search movies...'
        className='flex items-center bg-primary-light text-sm py-1 px-4 rounded w-96 outline-none'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputEl}
      />
    </>
  )
}

function NumResult({ movies }) {
  return (
    <div className='flex items-center text-xs text-white'>
      Found {movies?.length} results
    </div>
  )
}

function Main({ children }) {
  return (
    <div className='flex gap-8 px-6 text-xs mx-auto min-h-[calc(100vh-6rem)] '>
      {children}
    </div>
  )
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className='bg-background-500 rounded-md relative w-[25rem]'>
      <button
        className='flex justify-center items-center pb-1 absolute right-2 top-2 w-6 h-6 rounded-full bg-[#212529] text-[1.4rem]'
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? '-' : '+'}
      </button>
      {isOpen && children}
    </div>
  )
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul>
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  )
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li
      className='flex items-center px-6 py-3 gap-4 border-b border-background-100'
      onClick={() => onSelectMovie(movie.imdbID)}
    >
      <img
        src={movie.Poster}
        alt={`${movie.Title} poster`}
        className='h-10 w-7'
      />
      <div>
        <h3 className='font-semibold text-sm'>{movie.Title}</h3>
        <p>
          <span className='text-xs mr-2'>🗓</span>
          <span className='text-sm'>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

function MovieDetails({ watched, onCloseMovie, selectedId, onAddWatched }) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState('')

  const isWatched = watched.filter((movie) => movie.imdbID === selectedId)

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      poster,
      title,
      imdbRating: +imdbRating,
      runtime: isNaN(+runtime.split(' ')[0]) ? 0 : +runtime.split(' ')[0],
      userRating,
    }

    onAddWatched(newWatchedMovie)
    onCloseMovie()
  }

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true)
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`
      )
      if (!res.ok) throw new Error('Something went wrong with fetching movies')

      const data = await res.json()
      // console.log(data)

      setMovie(data)
      setIsLoading(false)
    }

    getMovieDetails()
  }, [selectedId])

  useEffect(
    function () {
      if (!title) return

      document.title = `Movie: ${title}`

      return function () {
        document.title = 'usePopcorn'
      }
    },
    [title]
  )

  useEffect(
    function () {
      function callback(e) {
        if (e.code === 'Escape') onCloseMovie()
      }

      document.addEventListener('keydown', callback)

      return function () {
        document.removeEventListener('keydown', callback)
      }
    },
    [onCloseMovie]
  )

  return (
    <div className='rounded-md'>
      <button
        className='flex absolute text-[1.2rem] font-extrabold bg-[#f6f6f6] text-background-900 rounded-full top-2 left-2 justify-center pb-[.5rem] px-[.1rem]'
        onClick={onCloseMovie}
      >
        &larr;
      </button>
      {isLoading ? (
        <Loader />
      ) : (
        <header className='flex max-h-40'>
          <img src={poster} alt={title} className='h-40 rounded-tl-md' />
          <div className='flex flex-col  gap-2 bg-background-100 w-full p-6 rounded-tr-md'>
            <h2 className=' text-sm font-semibold'>{title}</h2>
            <p>
              {released} &bull; {runtime === 'N/A' ? '0 min' : runtime}
            </p>
            <p>{genre}</p>
            <p>
              <span>⭐️</span> {imdbRating} IMDb rating
            </p>
          </div>
        </header>
      )}

      <section className=' flex  flex-col gap-6 mt-10 w-80  mx-auto'>
        <div className='flex flex-col bg-background-100 py-4 px-5 gap-4 rounded-md'>
          {isWatched.length === 0 ? (
            <>
              <StarRating
                maxRating={10}
                size={24}
                onSetRating={setUserRating}
              />
              {userRating > 0 && (
                <button
                  className='bg-primary py-2 rounded-full font-semibold text-sm'
                  onClick={handleAdd}
                >
                  + Add to list
                </button>
              )}
            </>
          ) : (
            <p className='text-sm font-semibold text-center'>
              You rated with movie {isWatched[0]?.userRating} <span>⭐️</span>
            </p>
          )}
        </div>
        <p className='text-sm'>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  )
}

function WatchList({ watched, onRemoveWatched }) {
  return (
    <ul>
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onRemoveWatched={onRemoveWatched}
        />
      ))}
    </ul>
  )
}

function Summery({ watched }) {
  const avgImdbRating =
    Math.round(average(watched.map((movie) => movie.imdbRating)) * 10) / 10
  const avgUserRating =
    Math.round(average(watched.map((movie) => movie.userRating)) * 10) / 10
  const avgRuntime = Math.round(average(watched.map((movie) => movie.runtime)))

  return (
    <div className='flex flex-col px-8 py-3 gap-2 bg-background-100 rounded-md'>
      <h2 className='uppercase font-semibold text-[.8rem]'>
        Movies you watched
      </h2>
      <div className='flex justify-between'>
        <p className='flex gap-1'>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p className='flex gap-1'>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p className='flex gap-1'>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p className='flex gap-1'>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}

function WatchedMovie({ movie, onRemoveWatched }) {
  return (
    <li className='flex justify-between items-center px-6 py-3 gap-4 border-b border-background-100'>
      <img
        src={movie.poster}
        alt={`${movie.title} poster`}
        className='h-10 w-7'
      />
      <div className='flex flex-col gap-2 w-3/5'>
        <h3 className='font-semibold text-sm'>{movie.title}</h3>
        <div className='flex justify-between'>
          <p className='flex gap-1'>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p className='flex gap-1'>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p className='flex gap-1'>
            <span>⏳</span>
            <span>{movie.runtime} min</span>
          </p>
        </div>
      </div>
      <button
        className='bg-red px-[.3rem] pb-[.05rem] rounded-full text-background-500 font-semibold'
        onClick={() => onRemoveWatched(movie.imdbID)}
      >
        x
      </button>
    </li>
  )
}

export default App
