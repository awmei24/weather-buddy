import { useState } from 'react';
import { Clock } from './components/Clock.jsx';
import { LocationWeather } from './components/LocationWeather.jsx';
import './App.css';
import searchIcon from './assets/search_icon.svg';

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchValue);
    // You could trigger API call here
  };

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
              <span className='search-icon'><img src={searchIcon} alt='Search'/></span>
              <input
                type='text'
                placeholder='Search...'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className='search-input'
              />
            </form>
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
