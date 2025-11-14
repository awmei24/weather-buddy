import { useState } from 'react';
import { Clock } from './components/Clock.jsx';
import { LocationWeather } from './components/LocationWeather.jsx';
import { SearchResults } from './components/Search.jsx';

import { ThemeProvider } from "styled-components";
import { dayTheme, GlobalStyle, nightTheme } from "./styles";
import {
  AppContainer,
  Header,
  HeaderRight,
  SearchContainer,
  SearchBox,
  SearchIcon,
  SearchInput,
  SearchResultsDropdown,
  Settings,
  SettingsIconWrap,
  CharacterPane,
  SidePane,
  SidePaneContent,
  SideOverlay,
  Setting,
  SettingLabel,
  ToggleSwitch,
  ToggleThumb,
  ToggleOption,
  LeftLabel,
  RightLabel,
  InfoPane,
  Footer
} from "./styles";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [topResult, setTopResult] = useState(null);

  const [isCelsius, setIsCelsius] = useState(false);
  const [is24Hour, setIs24Hour] = useState(false);

  const searchIcon = isDay === true ? searchIconDay : searchIconNight;
  const settingsIcon = isDay === true ? settingsIconDay : settingsIconNight;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchValue) return;
    setSelectedLocation({ name: searchValue });
    setSearchValue('');
  };

  const handleSelectResult = (location) => {
    setSelectedLocation(location);
    setSearchValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (topResult) {
        handleSelectResult(topResult);
        setSearchValue('');
      }
    }
  };

  const showDropdown = (isHovered || isFocused) && searchValue.length > 0 && isExpanded;

  return (
    <ThemeProvider theme={isDay === false ? nightTheme : dayTheme}>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <div className='time'>
            <Clock timeFormat={is24Hour ? '24hr' : '12hr'} />
          </div>

          <HeaderRight>
            <SearchContainer
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <SearchBox
                active={isHovered || isFocused}
                onTransitionEnd={(e) => {
                  // Only trigger when the width transition ends
                  if (e.propertyName === 'width') {
                    setIsExpanded(isHovered || isFocused); // mark as expanded when hover/focus active
                  }
                }}
              >
                <SearchIcon>
                  <img src={searchIcon} alt='Search' />
                </SearchIcon>

                <SearchInput
                  type='text'
                  placeholder='Search location...'
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    setIsFocused(false);
                    setIsExpanded(false); // collapse when focus lost
                  }}
                  onKeyDown={handleKeyDown}
                  active={isHovered || isFocused}
                />
              </SearchBox>

              {/* Dropdown only shows after search box is fully expanded */}
              {(showDropdown && isExpanded) && (
                <SearchResultsDropdown>
                  <SearchResults 
                    query={searchValue} 
                    onSelect={handleSelectResult} 
                    onTopResult={setTopResult} 
                  />
                </SearchResultsDropdown>
              )}
            </SearchContainer>


            <Settings onClick={() => setSettingsOpen(!settingsOpen)}>
              <SettingsIconWrap>
                <img src={settingsIcon} alt='settings' />
              </SettingsIconWrap>
            </Settings>

          </HeaderRight>
        </Header>

        <CharacterPane>
          Character Pane

          {settingsOpen && <SideOverlay onClick={() => setSettingsOpen(false)} />}

          <SidePane open={settingsOpen}>
            <SidePaneContent open={settingsOpen}>
              
              <Setting>
                <SettingLabel>Temperature</SettingLabel>
                <ToggleSwitch
                  side={isCelsius ? 'left' : 'right'}
                  onClick={() => setIsCelsius(!isCelsius)}
                >
                  <ToggleThumb mode={isCelsius ? 'celsius' : 'fahrenheit'} />
                  <LeftLabel>°C</LeftLabel>
                  <RightLabel>°F</RightLabel>
                </ToggleSwitch>
              </Setting>

              <Setting>
                <SettingLabel>Clock Format</SettingLabel>
                <ToggleSwitch
                  side={is24Hour ? 'right' : 'left'}
                  onClick={() => setIs24Hour(!is24Hour)}
                >
                  <ToggleThumb mode={is24Hour ? 'hour24' : 'hour12'} />
                  <LeftLabel>12h</LeftLabel>
                  <RightLabel>24h</RightLabel>
                </ToggleSwitch>
              </Setting>

            </SidePaneContent>
          </SidePane>

        </CharacterPane>

        <InfoPane>
          <LocationWeather
            lat={selectedLocation?.lat ?? null}
            lon={selectedLocation?.lon ?? null}
            onDayChange={(dayValue) => setIsDay(dayValue)}
            isCelsius={isCelsius}
          />
        </InfoPane>

        <Footer>
          Powered by <a href="https://www.weatherapi.com/" title="Free Weather API">WeatherAPI.com</a>
        </Footer>

      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
