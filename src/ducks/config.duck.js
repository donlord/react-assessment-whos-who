import {
  fetchCategories,
  fetchArtist,
  fetchGenres,
  fetchTopTracks
} from '../services/api'

export const LOAD_CATEGORIES_BEGIN =
  'cooksys/whos-who/Home/LOAD_CATEGORIES_BEGIN'
export const LOAD_CATEGORIES_FAILURE =
  'cooksys/whos-who/Home/LOAD_CATEGORIES_FAILURE'
export const LOAD_CATEGORIES_DONE = 'cooksys/whos-who/Home/LOAD_CATEGORIES_DONE'
export const LOAD_CATEGORIES_UPDATE =
  'cooksys/whos-who/Home/LOAD_CATEGORIES_UPDATE'
export const SELECT_CATEGORY = 'cooksys/whos-who/Home/SELECT_CATEGORY'
export const SET_CONFIG = 'cooksys/whos-who/Home/SET_CONFIG'
export const LOAD_ARTIST_FAILED = 'cooksys/whos-who/Home/LOAD_ARTIST_FAILED'
export const LOAD_ARTIST_DONE = 'cooksys/whos-who/Home/LOAD_ARTIST_DONE'
export const LOAD_GENRES_DONE = 'cooksys/whos-who/Home/LOAD_GENRES_DONE'
export const LOAD_GENRES_FAILED = 'cooksys/whos-who/Home/LOAD_GENRES_FAILED'
export const LOAD_TOP_TRACKS_DONE = 'cooksys/whos-who/Home/LOAD_TOP_TRACKS_DONE'
export const LOAD_TOP_TRACKS_FAILED =
  'cooksys/whos-who/Home/LOAD_TOP_TRACKS_FAILED'

const initialState = {
  artistNums: 1,
  songNums: 2,
  categories: [],
  errorLoadingCategories: false,
  errorLoadingTopTracks: false,
  loading: false,
  genres: [],
  topTracks: [],
  artists: []
}

export default function config (state = initialState, action) {
  switch (action.type) {
    case LOAD_CATEGORIES_DONE:
      return {
        ...state,
        errorLoadingCategories: false,
        categories: action.payload
      }
    case LOAD_CATEGORIES_FAILURE:
      return {
        ...state,
        errorLoadingCategories: true,
        categories: initialState.categories
      }
    case SELECT_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload
      }
    case SET_CONFIG:
      return {
        ...state,
        artistNums: action.artistNums,
        songNums: action.songNums,
        selectedCategory: action.selectedCategory
      }
    case LOAD_ARTIST_DONE:
      return {
        ...state,
        loading: false,
        artistInfo: action.payload
      }
    case LOAD_GENRES_DONE:
      // console.log(action.artists[2].name)
      return {
        ...state,
        loading: false,
        genres: action.payload,
        artists: action.artists
      }

    case LOAD_TOP_TRACKS_DONE:
      // console.log(action.payload.tracks[0].name)
      return {
        ...state,
        loading: false,
        topTracks: action.payload.tracks
      }
    case LOAD_GENRES_FAILED:
      return {
        ...state,
        errorLoadingCategories: true,
        genres: initialState.genres
      }

    case LOAD_TOP_TRACKS_FAILED:
      return {
        ...state,
        errorLoadingTopTracks: true,
        topTracks: initialState.topTracks
      }

    default:
      return state
  }
}

export const setConfig = config => ({
  type: SET_CONFIG,
  songNums: config.songNums,
  artistNums: config.artistNums,
  selectedCategory: config.category
})

export const selectCategory = category => ({
  type: SELECT_CATEGORY,
  payload: category
})

const loadCategoriesDone = categories => ({
  type: LOAD_CATEGORIES_DONE,
  payload: categories
})

const loadArtistDone = artistInfo => ({
  type: LOAD_ARTIST_DONE,
  payload: artistInfo
})

const loadGenresDone = genres => ({
  type: LOAD_GENRES_DONE,
  payload: genres,
  artists: genres.artists.items
})
const loadTopTracksDone = toptracks => ({
  type: LOAD_TOP_TRACKS_DONE,
  payload: toptracks
})

const loadCategoriesFailure = () => ({
  type: LOAD_CATEGORIES_FAILURE
})
const loadArtistFailed = () => ({
  type: LOAD_ARTIST_FAILED
})
const loadGenresFailed = () => ({
  type: LOAD_GENRES_FAILED
})
const loadTopTracksFailed = () => ({
  type: LOAD_TOP_TRACKS_FAILED
})

export const loadCategories = () => dispatch =>
  fetchCategories()
    .then(({ categories }) => {
      const categoryNames = categories.items.map(c => c.name)
      dispatch(loadCategoriesDone(categoryNames))
    })
    .catch(err => dispatch(loadCategoriesFailure(err)))

export const loadGenres = data => dispatch =>
  fetchGenres(data)
    .then(artists => dispatch(loadGenresDone(artists)))
    .catch(err => dispatch(loadGenresFailed(err)))

export const loadArtist = data => dispatch =>
  fetchArtist(data)
    .then(artist => dispatch(loadArtistDone(artist)))
    .catch(err => dispatch(loadArtistFailed(err)))

export const loadTopTracks = data => dispatch =>
  fetchTopTracks(data)
    .then(artist => dispatch(loadTopTracksDone(artist)))
    .catch(err => dispatch(loadTopTracksFailed(err)))
