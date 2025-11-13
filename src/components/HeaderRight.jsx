import searchIconLight from './assets/search_icon-light.svg';
import searchIconDark from './assets/search_icon.svg';
import settingsIconLight from './assets/menu_icon-light.svg';
import settingsIconDark from './assets/menu_icon.svg';

export function HeaderRight() {

    const
    return (
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
    )
}