import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/types';
import styled from 'styled-components';

const Card = styled(motion.article)`
  background: ${({ theme }) => theme.colors.bg.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 2px solid ${({ theme }) => theme.colors.border};
  transition: all ${({ theme }) => theme.transitions.slow};
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.accent},
      ${({ theme }) => theme.colors.gold}
    );
    transform: scaleX(0);
    transition: transform ${({ theme }) => theme.transitions.slow};
  }

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.xl};
    border-color: ${({ theme }) => theme.colors.accent};

    &::before {
      transform: scaleX(1);
    }
  }
`;

const ImageContainer = styled(motion.div)`
  width: 100%;
  height: 15rem; /* 240px */
  overflow: hidden;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.bg.tertiary},
    ${({ theme }) => theme.colors.bg.secondary}
  );
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 12rem; /* slightly smaller on mobile */
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.transitions.slow};
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Category = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.accent};
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  letter-spacing: 1px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.accentLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  width: fit-content;
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  letter-spacing: -0.3px;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
  flex-grow: 1;
`;

const Button = styled(Link)`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accent},
    ${({ theme }) => theme.colors.accentHover}
  );
  color: ${({ theme }) => theme.colors.white} !important;
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-top: auto;
  box-shadow: ${({ theme }) => theme.shadows.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:active {
    transform: translateY(0);
  }
`;

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { t } = useTranslation();

  return (
    <Card
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ImageContainer whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
        <Image src={product.image} alt={product.title} loading="lazy" />
      </ImageContainer>
      <Content>
        <Category>{product.category}</Category>
        <Title>{product.title}</Title>
        <Description>{product.shortDescription}</Description>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button to={`/product/${product.id}`}>{t('home.viewMore')}</Button>
        </motion.div>
      </Content>
    </Card>
  );
};
