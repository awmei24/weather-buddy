import { useState } from 'react';
import { Clock } from './components/Clock.jsx';
import { LocationWeather } from './components/LocationWeather.jsx';
import { SearchResults } from './components/Search.jsx';
import './App.css';
import searchIconNight from './assets/search_icon-night.svg';
import searchIconDay from './assets/search_icon-day.svg';
import settingsIconNight from './assets/settings_icon-night.svg';
import settingsIconDay from './assets/settings_icon-day.svg';

function App() {
  const [isDay, setIsDay] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [isCelsius, setIsCelsius] = useState(false);
  const [is24Hour, setIs24Hour] = useState(false);

  const searchIcon = isDay === true ? searchIconDay : searchIconNight;
  const settingsIcon = isDay === true ? settingsIconDay : settingsIconNight;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchValue) return;
    setSelectedLocation({ name: searchValue });
    setSearchValue(''); // clear input
    console.log('Searching for:', searchValue);
  };

  const handleSelectResult = (location) => {
    setSelectedLocation(location);
    setSearchValue(''); // clear input
    console.log('Selected location:', location);
  };

  const showDropdown = (isHovered || isFocused) && searchValue.length > 0;

  return (
    <div className='window'>
      <div className='header'>
        <div className='time'>
          <Clock timeFormat={  is24Hour ? '24hr' : '12hr' } />
        </div>

        <div className='header-right'>
          {/* --- Search Section --- */}
          <div
            className='search-container'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <form className={`search-box ${isHovered ? 'active' : ''}`} onSubmit={handleSearch}>
              <span className='search-icon'>
                <img src={searchIcon} alt='Search' />
              </span>
              <input
                type='text'
                placeholder='Search location...'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className='search-input'
              />
            </form>

            {showDropdown && (
              <div className='search-results-dropdown'>
                <SearchResults query={searchValue} onSelect={handleSelectResult} />
              </div>
            )}
          </div>

          <div className='settings' onClick={() => setSettingsOpen(!settingsOpen)}>
            <span className='settings-icon'>
              <img src={settingsIcon} alt='settings' />
            </span>
          </div>
        </div>
      </div>

      <div className='character-pane'>
        Character Pane

        {/* --- Slide-out settings Pane --- */}
        {settingsOpen && <div className="side-overlay" onClick={() => setSettingsOpen(false)}></div>}

        <div className={`side-pane ${settingsOpen ? 'open' : ''}`}>
          <div className='side-pane-content'>
            <div className='setting'>
              <label className='setting-label'>Temperature</label>
              <div
                className={`toggle-switch ${isCelsius ? 'left' : 'right'}`}
                onClick={() => setIsCelsius(!isCelsius)}
              >
                <div className={`toggle-thumb ${isCelsius ? 'celsius' : 'fahrenheit'}`} />
                <span className='toggle-option left-label'>°C</span>
                <span className='toggle-option right-label'>°F</span>
              </div>
            </div>

            <div className='setting'>
              <label className='setting-label'>Clock Format</label>
              <div
                className={`toggle-switch ${is24Hour ? 'right' : 'left'}`}
                onClick={() => setIs24Hour(!is24Hour)}
              >
                <div className={`toggle-thumb ${is24Hour ? 'hour24' : 'hour12'}`} />
                <span className='toggle-option left-label'>12h</span>
                <span className='toggle-option right-label'>24h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='info-pane'>
        <LocationWeather
          lat={selectedLocation?.lat ?? null}
          lon={selectedLocation?.lon ?? null}
          onDayChange={(dayValue) => setIsDay(dayValue)}
          isCelsius={ isCelsius }
        />
      </div>
      <div className='footer'>
        Powered by <a href="https://www.weatherapi.com/" title="Free Weather API">WeatherAPI.com</a>
      </div>
    </div>
  );
}

export default App;
