import { useState } from 'react';
import { Clock } from './components/Clock.jsx';
import { LocationWeather } from './components/LocationWeather.jsx';
import { SearchResults } from './components/Search.jsx';
import './App.css';
import searchIcon from './assets/search_icon.svg';

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchValue);
  };

  const showDropdown = (isHovered || isFocused) && searchValue.length > 0;

  return (
    <div className='window'>
      <div className='header'>
        <div className='time'>
          <Clock timeFormat='12hr' />
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
                <SearchResults query={searchValue} />
              </div>
            )}
          </div>

          <div className='menu'>Menu</div>
        </div>
      </div>

      <div className='characterPane'>Character Pane</div>
      <div className='infoPane'>
        <LocationWeather />
      </div>
    </div>
  );
}

export default App;
