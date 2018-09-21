import React from 'react'
import PropTypes from 'prop-types'
import connect from 'react-redux/es/connect/connect'
import ReactAudioPlayer from 'react-audio-player'

import {
  loadCategories,
  selectCategory,
  setConfig,
  loadArtist,
  loadGenres,
  loadTopTracks
} from '../../ducks/config.duck'

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      songNums: 2,
      artistNums: 1,
      category: '',
      winner: '',
      losers: [],
      losersPicsUrl: [],
      winnerTopTrackInfo: [],
      winnerSong: '',
      winnerPicUrl: [],
      failed: false,
      winnerName: ''
    }
  }
  chooseRandom = (array, numItems) => {
    if (array === undefined) {
      return []
    }
    if (array.length <= 2) {
      return array
    }
    if (numItems > array.length || numItems === undefined) {
      numItems = Math.floor(Math.random() * array.length)
    }
    let indexArray = []
    // Fill indexArray with random indices
    while (indexArray.length != numItems) {
      let randInt = Math.floor(Math.random() * array.length)
      if (indexArray.length === 0) {
        indexArray.push(randInt)
      }
      let inArray = false
      // check to see if randomInt is in the indexed array, if so continue else add it to the indexArray
      for (let i = 0; i < indexArray.length; i++) {
        if (indexArray[i] === randInt) {
          inArray = true
        }
      }
      if (inArray == false) {
        indexArray.push(randInt)
      }
    }
    // return the new array with the random values from indices indicated in indexArray
    let filteredArray = []
    for (let i = 0; i < indexArray.length; i++) {
      filteredArray.push(array[indexArray[i]])
    }
    return filteredArray
  }

  handleChange = event => {
    let state = {}
    state[event.target.name] = parseInt(event.target.value)
    this.setState(state)
  }

  handleSubmit = event => {
    if (this.state.losersPicsUrl != []) {
      this.state.losersPicsUrl = []
    }

    event.preventDefault()
    let data = {
      songNums: this.state.songNums,
      artistNums: this.state.artistNums,
      category: this.state.category,
      genres: this.state.genreInfo
    }
    this.props.setConfig(data)
    // choses random winner(1) and losers based on input
    this.state.winner = this.chooseRandom(this.props.artists, 1)
    this.state.losers = this.chooseRandom(
      this.props.artists,
      this.props.songNums - 1
    )

    this.state.winnerPicUrl = this.state.winner[0].images[0].url

    // array of pictures of losers for image rendering
    for (let i = 0; i < this.state.losers.length; i++) {
      this.state.losersPicsUrl.push(this.state.losers[i].images[i].url)
      console.log(this.state.losersPicsUrl[i])
    }

    // load top tracks of winner
    this.props.loadTopTracks(this.state.winner[0].id)
    this.state.failed = true
  }

  componentDidMount () {
    this.props.loadCategories()
  }
  handleWinner = () => {
    alert('you are correct')
  }

  render () {
    const categories = this.props.categories.map(category => (
      <option key={category} value={category}>
        {category}
      </option>
    ))

    // maps urls of losers to images
    let images = this.state.losersPicsUrl.map(image => {
      return <img key={image} src={`${image}`} alt='' />
    })

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <select
            name='category'
            onChange={event => {
              this.props.selectCategory(event.target.value)
              this.state.category = event.target.value
              this.props.loadGenres(event.target.value)
            }}
          >
            {categories}
          </select>

          <label>
            Number of Songs:
            <input type='text' name='songNums' onChange={this.handleChange} />
          </label>

          <label>
            Number of Artists:
            <input type='text' name='artistNums' onChange={this.handleChange} />
          </label>

          <input type='submit' value='Submit' />
        </form>

        <div>
          {images}
        </div>

        {this.state.failed &&
          <img src={this.state.winnerPicUrl} onClick={this.handleWinner} />}
        <p>winner pic</p>

        {this.state.failed &&
          <ReactAudioPlayer
            src={this.props.topTracks[0].preview_url}
            autoPlay={false}
            controls
          />}
      </div>
    )
  }
}

Home.propTypes = {
  loadCategories: PropTypes.func.isRequired,
  selectCategory: PropTypes.func.isRequired,
  categories: PropTypes.array,
  loadArtist: PropTypes.func.isRequired,
  genres: PropTypes.array
}

const mapStateToProps = state => ({
  categories: state.config.categories,
  artistNums: state.config.artistNums,
  songNums: state.config.songNums,
  genreInfo: state.config.genres,
  topTrackInfo: state.config.topTracks,
  artists: state.config.artists,
  topTracks: state.config.topTracks
})

const mapDispatchToProps = dispatch => ({
  loadCategories: _ => dispatch(loadCategories()),
  selectCategory: cat => dispatch(selectCategory(cat)),
  setConfig: config => dispatch(setConfig(config)),
  loadArtist: data => dispatch(loadArtist(data)),
  loadGenres: data => dispatch(loadGenres(data)),
  loadTopTracks: data => dispatch(loadTopTracks(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
