import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { usePagination } from '@/hooks/usePagination';
import { ProductCard } from '@/components/ProductCard';
import { Loading } from '@/components/Loading';
import { Error } from '@/components/Error';
import { Pagination } from '@/components/Pagination';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/PageHeader/PageHeader';
import styled from 'styled-components';

const ITEMS_PER_PAGE = 8;

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
  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination({
    items: products,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={t('home.error')} onRetry={refetch} />;
  }

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
        <Grid
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={currentPage}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        >
          {paginatedItems.map(product => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </Grid>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
        </motion.div>
      </Container>
    </Main>
  );
};
