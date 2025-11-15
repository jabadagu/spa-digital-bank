import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { useProduct } from '@/hooks/useProduct';
import { Loading } from '@/components/Loading';
import { Error } from '@/components/Error';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Main = styled(motion.main)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.md};
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.bg.secondary} 0%,
    ${({ theme }) => theme.colors.bg.primary} 100%
  );
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  transition: all ${({ theme }) => theme.transitions.fast};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  &:hover {
    color: ${({ theme }) => theme.colors.accentHover};
    background: ${({ theme }) => theme.colors.bg.secondary};
    transform: translateX(-4px);
  }
`;

const Content = styled(motion.article)`
  background: ${({ theme }) => theme.colors.bg.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(10px);
`;

const ImageContainer = styled(motion.div)`
  width: 100%;
  height: 28.125rem; /* ~450px */
  overflow: hidden;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.bg.tertiary},
    ${({ theme }) => theme.colors.bg.secondary}
  );
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 6.25rem; /* ~100px */
    background: linear-gradient(to top, ${({ theme }) => theme.colors.bg.primary}, transparent);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 18rem; /* smaller on medium/small screens */
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Details = styled.div`
  padding: ${({ theme }) => theme.spacing['3xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1.25rem; /* compact padding on mobile */
  }
`;

const Category = styled(motion.span)`
  display: inline-block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.accent};
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  letter-spacing: 1px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.accentLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid ${({ theme }) => theme.colors.accent};
`;

const Title = styled(motion.h1)`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  letter-spacing: -0.5px;
`;

const Description = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0 0 ${({ theme }) => theme.spacing['2xl']} 0;
`;

const FeaturesSection = styled(motion.section)`
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  padding-top: ${({ theme }) => theme.spacing['2xl']};
  border-top: 2px solid ${({ theme }) => theme.colors.border};
`;

const FeaturesTitle = styled(motion.h2)`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  letter-spacing: -0.3px;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FeatureItem = styled(motion.li)`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 2px solid ${({ theme }) => theme.colors.border};
  transition: all ${({ theme }) => theme.transitions.fast};

  svg {
    color: ${({ theme }) => theme.colors.success};
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    flex-shrink: 0;
    margin-top: 2px;
  }

  span {
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error, refetch } = useProduct(id || '');
  const { t } = useTranslation();

  if (loading) {
    return <Loading />;
  }

  if (error || !product) {
    return (
      <Main>
        <Container>
          <Error message={error?.message || t('product.notFound')} onRetry={refetch} />
        </Container>
      </Main>
    );
  }

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <BackLink to="/">{t('product.back')}</BackLink>
        </motion.div>
        <Content
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ImageContainer
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Image src={product.image} alt={product.title} />
          </ImageContainer>
          <Details>
            <Category
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {product.category}
            </Category>
            <Title
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {product.title}
            </Title>
            <Description
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {product.description}
            </Description>
            {product.features && product.features.length > 0 && (
              <FeaturesSection variants={containerVariants} initial="hidden" animate="visible">
                <FeaturesTitle variants={itemVariants}>{t('product.features')}</FeaturesTitle>
                <FeaturesList>
                  {product.features.map((feature, index) => (
                    <FeatureItem
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <IoCheckmarkCircle />
                      <span>{feature}</span>
                    </FeatureItem>
                  ))}
                </FeaturesList>
              </FeaturesSection>
            )}
          </Details>
        </Content>
      </Container>
    </Main>
  );
};
