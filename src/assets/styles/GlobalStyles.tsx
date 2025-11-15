import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.colors.bg.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    transition: background-color ${({ theme }) => theme.transitions.base}, 
                color ${({ theme }) => theme.transitions.base};
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};
    
    &:hover {
      color: ${({ theme }) => theme.colors.accentHover};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    transition: all ${({ theme }) => theme.transitions.fast};
  }

  input,
  select,
  textarea {
    font-family: inherit;
    transition: all ${({ theme }) => theme.transitions.fast};
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Base font sizing — scales rem values across the app for responsive shrink on mobile */
  html {
    font-size: 100%; /* 16px */
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    /* Slightly reduce base font-size on small devices to compact spacing */
    html {
      font-size: 90%; /* ~14.4px */
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    /* More compact on very small screens */
    html {
      font-size: 85%; /* ~13.6px */
    }
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bg.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    
    &:hover {
      background: ${({ theme }) => theme.colors.text.tertiary};
    }
  }

  /* Focus styles */
  *:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;
