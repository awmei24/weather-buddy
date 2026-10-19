import styled, { createGlobalStyle, css, keyframes } from "styled-components";

// Tokens from the Weather Buddy design system (tokens.json). The theme follows the
// API's is_day flag for the place being shown.
export const dayTheme = {
  bg: "#f0f8ff",
  surface: "#ffffff",
  hover: "#e3eef8",
  track: "#e3eef8",
  text: "#333333",
  textMuted: "#56636f",
  border: "#cccccc",
  borderStrong: "#7b8a97",
  focus: "#0b62c4",
  shadow: "rgba(0,0,0,0.15)",
  overlay: "rgba(0,0,0,0.3)",
  // One sky-blue thumb for every toggle option (replaces the four thumb-* hues)
  thumb: "#2c5d8a",
  onThumb: "#ffffff",
  link: "#3a43c9",
};

export const nightTheme = {
  bg: "#2c3e50",
  surface: "#34495e",
  hover: "#3f566e",
  track: "#22313f",
  text: "#f5f5f5",
  textMuted: "#c6d0da",
  border: "#4f6478",
  borderStrong: "#8fa3b5",
  focus: "#8cc8ff",
  shadow: "rgba(0,0,0,0.5)",
  overlay: "rgba(0,0,0,0.5)",
  thumb: "#a9c7e3",
  onThumb: "#1b2631",
  link: "#aab0ff",
};

export const space = { 1: "4px", 2: "8px", 3: "12px", 4: "16px", 5: "24px", 6: "32px" };
export const radius = { sm: "8px", md: "12px", pill: "999px", round: "50%" };
export const size = {
  icon: "24px",
  hit: "40px",
  searchOpen: "280px",
  toggleW: "112px",
  toggleH: "40px",
  pane: "360px",
  header: "72px",
  info: "144px",
  ring: "2px",
};
const z = { overlay: 4, pane: 5, dropdown: 10 };

// Type styles: [font-size, line-height]
const typeStyle = (fontSize, lineHeight) => css`
  font-size: ${fontSize};
  line-height: ${lineHeight};
`;
export const type = {
  temperature: typeStyle("80px", "80px"),
  unit: typeStyle("28px", "32px"),
  condition: typeStyle("28px", "36px"),
  base: typeStyle("24px", "32px"),
  location: typeStyle("20px", "28px"),
  paneTitle: typeStyle("28px", "36px"),
  label: typeStyle("20px", "28px"),
  input: typeStyle("20px", "28px"),
  segment: typeStyle("16px", "20px"),
  small: typeStyle("16px", "20px"),
};

const shadowSearch = ({ theme }) => `0 2px 5px ${theme.shadow}`;
const shadowDropdown = ({ theme }) => `0 4px 10px ${theme.shadow}`;
const shadowPane = ({ theme }) => `-2px 0 8px ${theme.shadow}`;

const NARROW = "@media (max-width: 480px)";

// Theme colours fade when day turns to night (or the place changes)
const themeFade = "background-color 400ms ease, color 400ms ease, border-color 400ms ease";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    min-width: 320px;
    font-family: "Jersey 15", sans-serif;
    ${type.base}
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button, input {
    font: inherit;
    color: inherit;
  }

  :focus-visible {
    outline: ${size.ring} solid ${({ theme }) => theme.focus};
    outline-offset: ${size.ring};
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      transition-duration: 0ms !important;
      animation-duration: 0ms !important;
    }
  }
`;

const buttonReset = css`
  appearance: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
`;

export const AppContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  transition: ${themeFade};
`;

/* ICON BUTTON */
export const IconButton = styled.button`
  ${buttonReset}
  display: inline-grid;
  place-items: center;
  flex: none;
  width: ${size.hit};
  height: ${size.hit};
  border-radius: ${radius.sm};
  color: ${({ theme }) => theme.text};
  transition: background-color 150ms ease;

  &:hover,
  &[aria-expanded="true"] {
    background: ${({ theme }) => theme.hover};
  }
`;

export const CloseGlyph = styled.span`
  ${type.paneTitle}
`;

/* BUTTON */
export const Button = styled.button`
  ${buttonReset}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: ${size.hit};
  padding: 0 ${space[4]};
  border: 1px solid ${({ theme }) => theme.borderStrong};
  border-radius: ${radius.sm};
  ${type.label}
  transition: background-color 150ms ease;

  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

// A quiet text action, for "Use my location"
export const TextButton = styled.button`
  ${buttonReset}
  align-self: flex-start;
  ${type.small}
  color: ${({ theme }) => theme.text};
  text-decoration: underline;
  text-underline-offset: 2px;
  border-radius: 4px;
`;

/* HEADER */
export const Header = styled.header`
  position: relative;
  z-index: 2;
  flex: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${space[4]};
  height: ${size.header};
  padding: 0 ${space[4]};
`;

export const ClockText = styled.div`
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  /* On narrow screens the open search box covers the clock; hide it so it can't peek through */
  ${NARROW} {
    visibility: ${({ $hidden }) => ($hidden ? "hidden" : "visible")};
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${space[2]};
`;

/* SEARCH — a combobox */
// Holds a hit-sized slot in the header; the open box grows leftwards over the clock
export const SearchContainer = styled.div`
  position: relative;
  width: ${size.hit};
  height: ${size.hit};
`;

const searchOpen = keyframes`
  from { width: ${size.hit}; }
  to { width: min(${size.searchOpen}, calc(100vw - 2 * ${space[4]} - ${size.hit} - ${space[2]})); }
`;

export const SearchBox = styled.form`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: ${space[2]};
  width: min(${size.searchOpen}, calc(100vw - 2 * ${space[4]} - ${size.hit} - ${space[2]}));
  height: ${size.hit};
  padding: 0 ${space[3]};
  border: 1px solid ${({ theme }) => theme.borderStrong};
  border-radius: ${radius.pill};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${shadowSearch};
  overflow: hidden;
  animation: ${searchOpen} 250ms ease-out;

  &:focus-within {
    outline: ${size.ring} solid ${({ theme }) => theme.focus};
    outline-offset: ${size.ring};
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  ${type.input}

  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
    opacity: 1;
  }
`;

export const ClearButton = styled.button`
  ${buttonReset}
  display: grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: ${radius.round};
  color: ${({ theme }) => theme.textMuted};
  font-size: 20px;
  line-height: 1;
  transition: background-color 150ms ease;

  &:hover {
    background: ${({ theme }) => theme.hover};
    color: ${({ theme }) => theme.text};
  }
`;

export const SearchResultsDropdown = styled.div`
  position: absolute;
  top: calc(100% + ${space[2]});
  right: 0;
  width: ${size.searchOpen};
  max-width: calc(100vw - 2 * ${space[4]});
  padding: ${space[1]};
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${radius.md};
  box-shadow: ${shadowDropdown};
  z-index: ${z.dropdown};
`;

export const SearchStatus = styled.div`
  padding: ${space[3]};
  ${type.small}
  color: ${({ theme }) => theme.textMuted};
`;

export const SearchResultList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const SearchResultItem = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: ${size.hit};
  padding: ${space[2]} ${space[3]};
  border-radius: ${radius.sm};
  cursor: pointer;
  background: ${({ $active, theme }) => ($active ? theme.hover : "transparent")};
  transition: background-color 150ms ease;

  & + & {
    margin-top: 2px;
  }
`;

export const ResultName = styled.div`
  font-size: 24px;
  line-height: 28px;
`;

export const ResultDetail = styled.div`
  ${type.small}
  color: ${({ theme }) => theme.textMuted};
`;

/* CHARACTER PANE */
// The buddy's stage: empty until the character ships, with the weather sky behind it
export const CharacterPane = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  /* clip, not hidden: a hidden box can still be scrolled by focus(), which drags the
     sky sideways when focus moves into the off-screen settings pane */
  overflow: clip;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.border};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  transition: border-color 400ms ease;
`;

export const SideOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.overlay};
  z-index: ${z.overlay};
`;

/* SETTINGS PANE */
export const SidePane = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: ${size.pane};
  max-width: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.surface};
  border-left: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ $open }) => ($open ? shadowPane : "none")};
  z-index: ${z.pane};
  transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(100%)")};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  /* Show at once when opening (so focus can move in); hide only after sliding out */
  transition: transform 250ms ease-out, visibility 0s linear ${({ $open }) => ($open ? "0s" : "250ms")};

  ${NARROW} {
    width: 100%;
  }
`;

export const SidePaneHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${space[3]} ${space[3]} ${space[3]} ${space[5]};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

export const SidePaneTitle = styled.h2`
  margin: 0;
  ${type.paneTitle}
  font-weight: 400;
`;

export const SidePaneBody = styled.div`
  padding: ${space[2]} ${space[5]} ${space[5]};
  overflow-y: auto;
`;

export const Setting = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${space[4]};
  padding: ${space[3]} 0;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.border};
  }
`;

export const SettingLabel = styled.span`
  ${type.label}
`;

/* SEGMENTED TOGGLE */
export const ToggleTrack = styled.div`
  position: relative;
  flex: none;
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  width: ${size.toggleW};
  height: ${size.toggleH};
  padding: 3px;
  border: 1px solid ${({ theme }) => theme.borderStrong};
  border-radius: ${radius.pill};
  background: ${({ theme }) => theme.track};
`;

export const ToggleThumb = styled.span`
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  width: calc(50% - 3px);
  border-radius: ${radius.pill};
  background: ${({ theme }) => theme.thumb};
  transform: ${({ $index }) => `translateX(${$index * 100}%)`};
  transition: transform 250ms ease, background-color 250ms ease;
`;

export const ToggleSegment = styled.button`
  ${buttonReset}
  position: relative;
  z-index: 1;
  padding: 0 ${space[2]};
  border-radius: ${radius.pill};
  ${type.segment}
  color: ${({ $selected, theme }) => ($selected ? theme.onThumb : theme.textMuted)};
  transition: color 250ms ease;
`;

/* INFO PANE */
export const InfoPane = styled.div`
  flex: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${space[6]};
  height: ${size.info};
  padding: 0 ${space[4]};
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const InfoLeft = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  animation: ${fadeIn} 250ms ease-out;
`;

export const Location = styled.div`
  ${type.location}
  color: ${({ theme }) => theme.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Condition = styled.div`
  ${type.condition}
`;

export const InfoRight = styled.div`
  display: flex;
  align-items: flex-start;
  flex: none;
  animation: ${fadeIn} 250ms ease-out;
`;

export const Temperature = styled.div`
  ${type.temperature}
  font-variant-numeric: tabular-nums;
`;

export const TempUnit = styled.div`
  ${type.unit}
  margin-left: ${space[1]};
  padding-top: 6px;
`;

export const Skeleton = styled.span`
  display: block;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height ?? "20px"};
  border-radius: ${radius.sm};
  background: ${({ theme }) => theme.hover};
`;

export const InfoMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${space[4]};
  min-width: 0;
`;

export const Hint = styled.div`
  ${type.small}
  color: ${({ theme }) => theme.textMuted};
`;

/* FOOTER */
export const Footer = styled.footer`
  flex: none;
  text-align: center;
  padding: ${space[2]} ${space[4]};
  ${type.small}
  color: ${({ theme }) => theme.textMuted};
  border-top: 1px solid ${({ theme }) => theme.border};

  a {
    color: ${({ theme }) => theme.link};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;
