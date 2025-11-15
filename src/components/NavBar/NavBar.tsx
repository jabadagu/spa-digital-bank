import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { HiMoon, HiSun } from 'react-icons/hi';
import { HiBars3, HiXMark } from 'react-icons/hi2';
import styled from 'styled-components';

const Nav = styled(motion.nav)`
  background: ${({ theme }) => theme.colors.bg.primary};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(20px);
  background: ${({ theme }) =>
    theme.colors.bg.primary === '#ffffff' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(26, 26, 46, 0.95)'};
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Logo = styled(Link)`
  color: ${({ theme }) => theme.colors.accent};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-decoration: none;
  letter-spacing: -0.5px;
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-1px);
  }
`;

const RightSection = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.bg.primary};
    flex-direction: column;
    padding: ${({ theme }) => theme.spacing.xl};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-top: 2px solid ${({ theme }) => theme.colors.border};
    z-index: ${({ theme }) => theme.zIndex.dropdown};
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.accent : theme.colors.text.secondary};
  text-decoration: none;
  font-weight: ${({ $isActive, theme }) =>
    $isActive ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  font-size: ${({ theme }) => theme.typography.fontSize.base};

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.bg.secondary};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ $isActive }) => ($isActive ? '80%' : '0')};
    height: 3px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.accent},
      ${({ theme }) => theme.colors.gold}
    );
    border-radius: ${({ theme }) => theme.borderRadius.full};
    transition: width ${({ theme }) => theme.transitions.base};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    text-align: center;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-left: ${({ theme }) => theme.spacing.lg};
  padding-left: ${({ theme }) => theme.spacing.lg};
  border-left: 2px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    border-left: none;
    border-top: 2px solid ${({ theme }) => theme.colors.border};
    padding-left: 0;
    padding-top: ${({ theme }) => theme.spacing.md};
    margin-left: 0;
    margin-top: ${({ theme }) => theme.spacing.md};
    width: 100%;
    justify-content: center;
  }
`;

const LanguageSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.bg.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentLight};
  }
`;

const ThemeToggle = styled(motion.button)`
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.bg.secondary};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const MenuToggle = styled(motion.button)`
  display: none;
  background: transparent;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  align-items: center;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

export const NavBar = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { themeMode, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    // Cerrar el menú móvil después de cambiar idioma
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  const handleLinkClick = () => {
    // Cerrar el menú móvil al hacer clic en un enlace
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  const handleLogoClick = () => {
    // Cerrar el menú móvil al hacer clic en el logo
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  return (
    <Nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      <Container>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Logo to="/" onClick={handleLogoClick}>
            {t('app.name')}
          </Logo>
        </motion.div>
        <RightSection $isOpen={menuOpen}>
          <NavLink to="/" $isActive={location.pathname === '/'} onClick={handleLinkClick}>
            {t('nav.home')}
          </NavLink>
          <NavLink
            to="/contact"
            $isActive={location.pathname === '/contact'}
            onClick={handleLinkClick}
          >
            {t('nav.contact')}
          </NavLink>
          <Controls>
            <LanguageSelect
              onChange={e => handleLanguageChange(e.target.value)}
              value={i18n.language}
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </LanguageSelect>
            <ThemeToggle
              onClick={toggleTheme}
              aria-label={themeMode === 'light' ? t('theme.dark') : t('theme.light')}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              {themeMode === 'light' ? <HiMoon size={20} /> : <HiSun size={20} />}
            </ThemeToggle>
          </Controls>
        </RightSection>
        <MenuToggle
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t('nav.menuToggle')}
          title={t('nav.menuToggle')}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <HiXMark size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <HiBars3 size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </MenuToggle>
      </Container>
    </Nav>
  );
};
