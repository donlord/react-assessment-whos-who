import toPairs from 'lodash/toPairs'

import request from '../utils/request'
import { getAccessTokenFromLocalStorage } from './auth'

const SPOTIFY_ROOT = 'https://api.spotify.com/v1'

export function fetchCategories () {
  return fetchFromSpotify({
    endpoint: 'browse/categories',
    params: {
      limit: '30'
    }
  })
}
export function fetchTopTracks (artistID) {
  return fetchFromSpotify({
    endpoint: `artists/${artistID}/top-tracks?country=US`
  })
}
export function fetchGenres (genre) {
  return fetchFromSpotify({
    endpoint: `search?q=genre%3A${genre}&type=artist`
  })
}

export function fetchArtist (data) {
  // let artistId = data.id.slice(32)
  return fetchFromSpotify({
    endpoint: `artists/${data}`
  })
}

export function fetchFromSpotify ({ endpoint, params }) {
  const spotifyToken = getAccessTokenFromLocalStorage()
  let url = [SPOTIFY_ROOT, endpoint].join('/')

  if (params) {
    const paramString = toPairs(params).map(param => param.join('=')).join('&')
    url += `?${paramString}`
  }

  const options = { headers: { Authorization: `Bearer ${spotifyToken}` } }
  return request(url, options)
}
