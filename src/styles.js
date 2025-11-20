import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: "Jersey 15", sans-serif;
    font-size: 24px;
  }
`;

export const dayTheme = {
  bg: "#f0f8ff",
  text: "#333",
  accent: "#ffffff",
  border: "#ccc",
  shadow: "rgba(0,0,0,0.15)",
  overlay: "rgba(0,0,0,0.3)",
};

export const nightTheme = {
  bg: "#2c3e50",
  text: "#f5f5f5",
  accent: "#34495e",
  border: "#999",
  shadow: "rgba(0,0,0,0.5)",
  overlay: "rgba(0,0,0,0.5)",
};

export const AppContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
`;

/* HEADER */
export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  height: 10vh;
  max-height: 200px
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

/* SEARCH */
export const SearchContainer = styled.div`
  position: relative;
`;

export const SearchBox = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  height: 80%;
  width: ${({ active }) => (active ? "220px" : "50px")};
  padding: 10px 16px;
  border-radius: 25px;
  overflow: hidden;
  cursor: pointer;
  background-color: ${({ active, theme }) => (active ? theme.bg : "transparent")};
  border: ${({ active, theme }) => (active ? `1px solid ${theme.border}` : "none")};
  box-shadow: ${({ active, theme }) => (active ? `0 2px 5px ${theme.shadow}` : "none")};
  transition: width 0.4s ease, box-shadow 0.3s ease;
`;

export const SearchIcon = styled.span`
  display: flex;
  align-items: center;
  img {
    width: 24px;
    height: 24px;
  }
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  margin-left: 10px;
  flex-grow: 1;
  width: ${({ active }) => (active ? "100%" : "0")};
  opacity: ${({ active }) => (active ? 1 : 0)};
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  transition: width 0.4s ease, opacity 0.3s ease;
`;

export const SearchResultsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: ${({ theme }) => theme.bg};
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 10px ${({ theme }) => theme.shadow};
  overflow: hidden;
  z-index: 10;
`;

export const SearchResultList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

export const SearchResultItem = styled.li`
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.2s ease;
  border: 1px solid ${({ theme }) => theme.border};
  
  &:hover {
    background: ${({ theme }) => theme.accent};
  }
`;

/* SETTINGS ICON */
export const Settings = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.text};
`;

export const SettingsIconWrap = styled.span`
  display: flex;
  align-items: center;
  img {
    width: 24px;
    height: 24px;
  }
`;

/* CHARACTER PANE */
export const CharacterPane = styled.div`
  flex: 1;
  width: 100%;
  background: ${({ theme }) => theme.bg};
  border-top: 1px solid ${({ theme }) => theme.border};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

/* SIDE PANE */
export const SidePane = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: ${({ open }) => (open ? "50%" : "0")};
  max-width: 360px;
  background: ${({ theme }) => theme.bg};
  border-left: 1px solid ${({ theme }) => theme.border};
  box-shadow: -2px 0 8px ${({ theme }) => theme.shadow};
  overflow: hidden;
  transition: width 0.3s ease-out;
  z-index: 5;
`;

export const SidePaneContent = styled.div`
  opacity: ${({ open }) => (open ? 1 : 0)};
  padding: 20px;
  transition: opacity 0.3s ease-in 0.2s;
`;

export const SideOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.overlay};
  opacity: 1;
  z-index: 4;
`;

/* SETTINGS CONTENT */
export const Setting = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
`;

export const SettingLabel = styled.label`
  color: ${({ theme }) => theme.text};
  font-size: 18px;
`;

export const ToggleSwitch = styled.div`
  position: relative;
  width: 90px;
  height: 36px;
  border-radius: 18px;
  cursor: pointer;
  overflow: hidden;
  background: ${({ theme }) => theme.accent};
`;

export const ToggleThumb = styled.div`
  position: absolute;
  top: 3px;
  left: 3px;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  transition: transform 0.3s ease;

  ${({ mode }) =>
    mode === "celsius" && `background:#4db5ff;`}
  ${({ mode }) =>
    mode === "fahrenheit" && `background:#ff914d;`}
  ${({ mode }) =>
    mode === "hour12" && `background:#7d5fff;`}
  ${({ mode }) =>
    mode === "hour24" && `background:#00c78b;`}

  transform: ${({ mode }) =>
    mode === "fahrenheit" || mode === "hour24"
      ? "translateX(54px)"
      : "translateX(0)"};
`;

export const ToggleOption = styled.span`
  position: absolute;
  top: 50%;
  font-size: 0.8rem;
  font-weight: 600;
  transform: translateY(-50%);
  pointer-events: none;
  opacity: 0.7;
  color: ${({ theme }) => theme.text};
`;

export const LeftLabel = styled(ToggleOption)`
  left: 10px;
  font-size: 14px;
`;

export const RightLabel = styled(ToggleOption)`
  right: 10px;
  font-size: 14px;
`;

/* INFO PANE */
export const InfoPane = styled.div`
  flex: 0 0 25vh;
  width: 95%;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-height: 200px
`;

export const InfoLeft = styled.div`
  display: flex;
  flex-direction: column;
`

export const Location = styled.div`
  font-size: 20px;
`

export const Condition = styled.div`
  font-size: 28px
`

export const InfoRight = styled.div`
  display: flex;
`

export const Temperature = styled.div`
  font-size: 80px;
  line-height: 80px;
`

/* FOOTER */
export const Footer = styled.footer`
  text-align: center;
  padding: 10px;
  font-size: 0.5rem;
  color: ${({ theme }) => theme.text};
  border: 0.1px solid ${({ theme }) => theme.border};
`;
