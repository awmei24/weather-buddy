import { useState, useEffect } from 'react'
import { Clock } from './components/Clock.jsx'
import { LocationWeather } from './components/LocationWeather.jsx'
import './App.css'

function App() {
  return (
    <>
      <div className='window'>
        <div className='header'>
          <div className='time'>
            <Clock timeFormat='12hr'/>
          </div>
          <div>
            <div className='search'></div>
            <div className='menu'></div>
          </div>
        </div>
        <div className='characterPane'></div>
        <div className='infoPane'>
          <div className='locationWeather'>
            {/* <LocationWeather /> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
