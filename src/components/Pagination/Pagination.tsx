import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const PaginationContainer = styled(motion.nav)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const Button = styled(motion.button)<{ $disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.bg.secondary : theme.colors.bg.primary};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.text.tertiary : theme.colors.text.primary};
  border: 2px solid
    ${({ theme, $disabled }) => ($disabled ? theme.colors.border : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all ${({ theme }) => theme.transitions.fast};
  min-width: 7.5rem; /* ~120px */

  &:hover:not(:disabled) {
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.accent},
      ${({ theme }) => theme.colors.accentHover}
    );
    color: ${({ theme }) => theme.colors.white} !important;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const Info = styled(motion.span)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <PaginationContainer
      aria-label="Pagination"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        $disabled={currentPage === 1}
        aria-label={t('pagination.previous')}
        whileHover={{
          scale: currentPage === 1 ? 1 : 1.05,
          x: currentPage === 1 ? 0 : -2,
        }}
        whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
      >
        {t('pagination.previous')}
      </Button>
      <Info initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {t('pagination.page')} {currentPage} {t('pagination.of')} {totalPages}
      </Info>
      <Button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        $disabled={currentPage === totalPages}
        aria-label={t('pagination.next')}
        whileHover={{
          scale: currentPage === totalPages ? 1 : 1.05,
          x: currentPage === totalPages ? 0 : 2,
        }}
        whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
      >
        {t('pagination.next')}
      </Button>
    </PaginationContainer>
  );
};
