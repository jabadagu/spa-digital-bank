import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { useSearchProducts } from '@/hooks/useSearchProducts';
import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { Loading } from '@/components/Loading';
import { Error } from '@/components/Error';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/PageHeader/PageHeader';
import styled from 'styled-components';

const Main = styled(motion.main)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.md};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.bg.secondary} 0%,
    ${({ theme }) => theme.colors.bg.primary} 100%
  );
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const SearchResultsInfo = styled(motion.div)`
  text-align: center;
  margin: ${({ theme }) => theme.spacing.lg} 0;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 4px solid ${({ theme }) => theme.colors.accent};
`;

const NoResultsMessage = styled(motion.div)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};

  h3 {
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }

  p {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    line-height: 1.6;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export const Home = () => {
  const { products, loading, error, refetch } = useProducts();
  const { t } = useTranslation();

  // Hook de búsqueda con debounce
  const { searchQuery, setSearchQuery, debouncedQuery, filteredProducts, isSearching } =
    useSearchProducts({ products, debounceTime: 300 });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={t('home.error')} onRetry={refetch} />;
  }

  const hasSearchQuery = debouncedQuery.trim().length > 0;
  const hasResults = filteredProducts.length > 0;
  const showNoResults = hasSearchQuery && !hasResults && !isSearching;
  const showProducts = hasResults || !hasSearchQuery;

  return (
    <Main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader title={t('home.title')} subtitle={t('home.subtitle')} />
        </motion.div>

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isSearching={isSearching}
        />

        {hasSearchQuery && !isSearching && (
          <SearchResultsInfo
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {t('home.resultsCount', { count: filteredProducts.length })}
          </SearchResultsInfo>
        )}

        {showNoResults ? (
          <NoResultsMessage
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: 'spring' }}
          >
            <h3>{t('home.noResults')}</h3>
            <p>
              Intenta con otros términos de búsqueda o{' '}
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                ver todos los productos
              </button>
            </p>
          </NoResultsMessage>
        ) : null}

        {showProducts && (
          <Grid
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={`${debouncedQuery}-${filteredProducts.length}`}
            transition={{
              staggerChildren: 0.05,
              delayChildren: 0.1,
              duration: 0.3,
            }}
          >
            {filteredProducts.map(product => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                transition={{
                  duration: 0.3,
                  type: 'spring',
                  stiffness: 150,
                  damping: 20,
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </Grid>
        )}
      </Container>
    </Main>
  );
};
