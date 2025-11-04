import { useAtom } from 'jotai'

import { animeAtom } from '@/appState'


// READ - WRITE form same component
/**
     const AnimeApp = () => {
    const [anime, setAnime] = useAtom(animeAtom)

    return (
        <>
        <ul>
            {anime.map((item) => (
            <li key={item.title}>{item.title}</li>
            ))}
        </ul>
        <button onClick={() => {
            setAnime((anime) => [
            ...anime,
            {
                title: 'Cowboy Bebop',
                year: 1998,
                watched: false
            }
            ])
        }}>
            Add Cowboy Bebop
        </button>
        </>
    )
    }
 */

// READ - WRITE form separate component
/**
 import { useAtomValue, useSetAtom } from 'jotai'

import { animeAtom } from './atoms'

const AnimeList = () => {
  const anime = useAtomValue(animeAtom)

  return (
    <ul>
      {anime.map((item) => (
        <li key={item.title}>{item.title}</li>
      ))}
    </ul>
  )
}

const AddAnime = () => {
  const setAnime = useSetAtom(animeAtom)

  return (
    <button onClick={() => {
      setAnime((anime) => [
        ...anime,
        {
          title: 'Cowboy Bebop',
          year: 1998,
          watched: false
        }
      ])
    }}>
      Add Cowboy Bebop
    </button>
  )
}

const ProgressTracker = () => {
  const progress = useAtomValue(progressAtom)

  return (
    <div>{Math.trunc(progress * 100)}% watched</div>
  )
}

const AnimeApp = () => {
  return (
    <>
      <AnimeList />
      <AddAnime />
      <ProgressTracker />
    </>
  )
} 
 */
