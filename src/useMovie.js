import { useEffect, useState } from 'react'

const API_KEY = 'e250f78f'

export function useMovies(query, callback) {
  const [error, setError] = useState('')
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(
    function () {
      const controller = new AbortController()

      async function fetchMovies() {
        try {
          setIsLoading(true)
          setError('')
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
            { signal: controller.signal }
          )
          if (!res.ok)
            throw new Error('Something went wrong with fetching movies')

          const data = await res.json()

          setMovies(data.Search)
        } catch (err) {
          if (err.name !== 'AbortError') setError(err.message)
        } finally {
          setIsLoading(false)
        }
      }

      callback?.()
      fetchMovies()
      return function () {
        controller.abort()
      }
    },
    [query]
  )

  return { error, movies, isLoading }
}
