import { memo } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearching?: boolean;
  placeholder?: string;
  className?: string;
}

const SearchContainer = styled(motion.div)`
  position: relative;
  max-width: 600px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  padding-left: ${({ theme }) => theme.spacing['3xl']};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.bg.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 4px 16px rgba(0, 123, 255, 0.2);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    padding-left: ${({ theme }) => theme.spacing.xl};
  }
`;

const SearchIcon = styled(motion.div)`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  top: 32%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
  z-index: 1;

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    left: ${({ theme }) => theme.spacing.sm};

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const LoadingIndicator = styled(motion.div)`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  top: 30%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.accent};

  svg {
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ClearButton = styled(motion.button)`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  top: 30%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.bg.secondary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const SearchBar = memo<SearchBarProps>(
  ({ searchQuery, onSearchChange, isSearching = false, placeholder, className }) => {
    const { t } = useTranslation();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    };

    const handleClear = () => {
      onSearchChange('');
    };

    return (
      <SearchContainer
        className={className}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SearchIcon
          data-testid="search-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </SearchIcon>

        <SearchInput
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder || t('home.searchPlaceholder')}
          aria-label={t('home.searchLabel')}
        />

        {isSearching && (
          <LoadingIndicator
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12z"
                opacity="0.3"
              />
              <path d="M10 2a8 8 0 018 8h-2a6 6 0 00-6-6V2z" />
            </svg>
          </LoadingIndicator>
        )}

        {searchQuery && !isSearching && (
          <ClearButton
            onClick={handleClear}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            aria-label={t('home.clearSearch')}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </ClearButton>
        )}
      </SearchContainer>
    );
  }
);
