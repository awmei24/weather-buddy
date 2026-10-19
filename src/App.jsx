import { useState, useEffect, useRef } from 'react';
import { Clock } from './components/Clock.jsx';
import { LocationWeather } from './components/LocationWeather.jsx';
import { SearchResults } from './components/Search.jsx';
import { SegmentedToggle } from './components/SegmentedToggle.jsx';
import { Sky } from './components/Sky.jsx';
import { SearchIcon, GearIcon } from './components/Icons.jsx';
import { useAutocomplete, useStoredState } from './hook.js';
import { SCENES, sceneForCode } from './sky.js';

import { ThemeProvider } from "styled-components";
import {
  dayTheme,
  nightTheme,
  GlobalStyle,
  AppContainer,
  Header,
  ClockText,
  HeaderRight,
  IconButton,
  CloseGlyph,
  SearchContainer,
  SearchBox,
  SearchInput,
  ClearButton,
  SearchResultsDropdown,
  CharacterPane,
  SidePane,
  SidePaneHeader,
  SidePaneTitle,
  SidePaneBody,
  SideOverlay,
  Setting,
  SettingLabel,
  InfoPane,
  Footer
} from "./styles";

const SEARCH_RESULTS_ID = 'search-results';
const MAX_SUGGESTIONS = 5;

const TEMPERATURE_OPTIONS = [
  { value: 'C', label: '°C' },
  { value: 'F', label: '°F' },
];
const CLOCK_OPTIONS = [
  { value: '12', label: '12h' },
  { value: '24', label: '24h' },
];

// Guess day/night from the local clock until the weather tells us
function guessIsDay() {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18;
}

// Dev only: preview any sky with e.g. ?scene=rain&time=night (stripped from production builds)
const preview = import.meta.env.DEV ? new URLSearchParams(window.location.search) : null;
const previewScene = SCENES.includes(preview?.get('scene')) ? preview.get('scene') : null;
const previewTime = preview?.get('time');
const previewIsDay = previewTime === 'day' ? true : previewTime === 'night' ? false : null;

function isTypingTarget(element) {
  return element?.closest?.('input, textarea, select, [contenteditable="true"]');
}

function App() {
  const [isDay, setIsDay] = useState(guessIsDay);
  const [conditionCode, setConditionCode] = useState(null);
  const [timeZone, setTimeZone] = useState(undefined);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fahrenheit and the 12-hour clock are the defaults
  const [isCelsius, setIsCelsius] = useStoredState('weather-buddy:isCelsius', () => false);
  const [is24Hour, setIs24Hour] = useStoredState('weather-buddy:is24Hour', () => false);

  const searchButtonRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const returnFocusToSearch = useRef(false);
  const settingsButtonRef = useRef(null);
  const settingsPaneRef = useRef(null);

  const scene = previewScene ?? sceneForCode(conditionCode);
  const skyIsDay = previewIsDay ?? isDay;
  const theme = skyIsDay ? dayTheme : nightTheme;

  const query = searchValue.trim();
  const {
    suggestions,
    loading: searchLoading,
    error: searchError,
  } = useAutocomplete(query);
  const visibleSuggestions = suggestions.slice(0, MAX_SUGGESTIONS);
  const highlightedIndex = Math.min(activeIndex, visibleSuggestions.length - 1);
  // Only select once results for the current text have arrived
  const resultsReady = !searchLoading && !searchError && visibleSuggestions.length > 0;

  const showDropdown = searchOpen && query.length > 0;
  const showOptions = showDropdown && !searchError && visibleSuggestions.length > 0;

  const openSearch = () => setSearchOpen(true);

  const closeSearch = ({ returnFocus = false } = {}) => {
    returnFocusToSearch.current = returnFocus;
    setSearchOpen(false);
    setSearchValue('');
    setActiveIndex(0);
  };

  // Put focus back on the search button after closing with Esc or picking a place
  useEffect(() => {
    if (!searchOpen && returnFocusToSearch.current) {
      returnFocusToSearch.current = false;
      searchButtonRef.current?.focus();
    }
  }, [searchOpen]);

  // "/" opens search from anywhere (unless you're already typing somewhere)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== '/' || searchOpen || settingsOpen || isTypingTarget(e.target)) return;
      e.preventDefault();
      setSearchOpen(true);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, settingsOpen]);

  // Clicking outside the open search closes it
  useEffect(() => {
    if (!searchOpen) return;
    const handlePointerDown = (e) => {
      if (!searchContainerRef.current?.contains(e.target)) {
        returnFocusToSearch.current = false;
        setSearchOpen(false);
        setSearchValue('');
        setActiveIndex(0);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [searchOpen]);

  // Settings dialog: focus the first toggle on open, keep Tab inside, Esc closes,
  // and focus returns to the gear on close
  useEffect(() => {
    if (!settingsOpen) return;

    const settingsButton = settingsButtonRef.current;
    const pane = settingsPaneRef.current;
    pane?.querySelector('[role="radio"][tabindex="0"]')?.focus({ preventScroll: true });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSettingsOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !pane) return;
      const focusable = [...pane.querySelectorAll('button:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      settingsButton?.focus();
    };
  }, [settingsOpen]);

  const handleSelectResult = (item) => {
    setSelectedLocation({ lat: item.lat, lon: item.lon });
    closeSearch({ returnFocus: true });
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setActiveIndex(0);
  };

  const handleClear = () => {
    setSearchValue('');
    setActiveIndex(0);
    searchInputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    const count = visibleSuggestions.length;

    switch (e.key) {
      case 'ArrowDown':
        if (count) {
          e.preventDefault();
          setActiveIndex((highlightedIndex + 1) % count);
        }
        break;
      case 'ArrowUp':
        if (count) {
          e.preventDefault();
          setActiveIndex((highlightedIndex - 1 + count) % count);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (resultsReady) {
          handleSelectResult(visibleSuggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeSearch({ returnFocus: true });
        break;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <ClockText $hidden={searchOpen}>
            <Clock timeFormat={is24Hour ? '24hr' : '12hr'} timeZone={timeZone} />
          </ClockText>

          <HeaderRight>
            <SearchContainer ref={searchContainerRef}>
              {searchOpen ? (
                <SearchBox role='search' onSubmit={(e) => e.preventDefault()}>
                  <SearchIcon />
                  <SearchInput
                    ref={searchInputRef}
                    autoFocus
                    type='text'
                    placeholder='Search location...'
                    aria-label='Search location'
                    role='combobox'
                    aria-autocomplete='list'
                    aria-expanded={showOptions}
                    aria-controls={SEARCH_RESULTS_ID}
                    aria-activedescendant={showOptions ? `${SEARCH_RESULTS_ID}-${highlightedIndex}` : undefined}
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                  />
                  {searchValue && (
                    <ClearButton type='button' aria-label='Clear search' onClick={handleClear}>
                      ×
                    </ClearButton>
                  )}
                </SearchBox>
              ) : (
                <IconButton
                  ref={searchButtonRef}
                  type='button'
                  aria-label='Search location'
                  aria-expanded={false}
                  onClick={openSearch}
                >
                  <SearchIcon />
                </IconButton>
              )}

              {showDropdown && (
                <SearchResultsDropdown>
                  <SearchResults
                    listId={SEARCH_RESULTS_ID}
                    query={query}
                    suggestions={visibleSuggestions}
                    loading={searchLoading}
                    error={searchError}
                    activeIndex={highlightedIndex}
                    onSelect={handleSelectResult}
                    onHover={setActiveIndex}
                  />
                </SearchResultsDropdown>
              )}
            </SearchContainer>

            <IconButton
              ref={settingsButtonRef}
              type='button'
              aria-label='Settings'
              aria-expanded={settingsOpen}
              aria-controls='settings-pane'
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              <GearIcon />
            </IconButton>
          </HeaderRight>
        </Header>

        <CharacterPane>
          {/* The buddy will live here; until then the pane shows only the sky */}
          <Sky scene={scene} isDay={skyIsDay} />

          {settingsOpen && <SideOverlay onClick={() => setSettingsOpen(false)} />}

          <SidePane
            ref={settingsPaneRef}
            id='settings-pane'
            role='dialog'
            aria-modal='true'
            aria-labelledby='settings-title'
            $open={settingsOpen}
            inert={!settingsOpen}
          >
            <SidePaneHeader>
              <SidePaneTitle id='settings-title'>Settings</SidePaneTitle>
              <IconButton
                type='button'
                aria-label='Close settings'
                onClick={() => setSettingsOpen(false)}
              >
                <CloseGlyph aria-hidden='true'>×</CloseGlyph>
              </IconButton>
            </SidePaneHeader>

            <SidePaneBody>
              <Setting>
                <SettingLabel id='temperature-label'>Temperature</SettingLabel>
                <SegmentedToggle
                  labelledBy='temperature-label'
                  options={TEMPERATURE_OPTIONS}
                  value={isCelsius ? 'C' : 'F'}
                  onChange={(value) => setIsCelsius(value === 'C')}
                />
              </Setting>

              <Setting>
                <SettingLabel id='clock-label'>Clock format</SettingLabel>
                <SegmentedToggle
                  labelledBy='clock-label'
                  options={CLOCK_OPTIONS}
                  value={is24Hour ? '24' : '12'}
                  onChange={(value) => setIs24Hour(value === '24')}
                />
              </Setting>
            </SidePaneBody>
          </SidePane>
        </CharacterPane>

        <InfoPane>
          <LocationWeather
            lat={selectedLocation?.lat ?? null}
            lon={selectedLocation?.lon ?? null}
            onDayChange={setIsDay}
            onConditionChange={setConditionCode}
            onTimeZoneChange={setTimeZone}
            onUseMyLocation={() => setSelectedLocation(null)}
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
