import { motion } from 'framer-motion';
import styled from 'styled-components';

const Header = styled(motion.header)`
  margin-bottom: ${({ theme }) => theme.spacing['xl']};
  text-align: center;
  padding: ${({ theme }) => theme.spacing['xl']} 0;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  letter-spacing: -1px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accent},
    ${({ theme }) => theme.colors.gold}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  max-width: 600px;
  margin: 0 auto;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <Header>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Header>
  );
};

export default PageHeader;
