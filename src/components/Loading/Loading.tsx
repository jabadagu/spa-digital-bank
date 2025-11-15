import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Container = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.md};
  min-height: 400px;
`;

const Spinner = styled(motion.div)`
  width: 60px;
  height: 60px;
  border: 4px solid ${({ theme }) => theme.colors.bg.tertiary};
  border-top: 4px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  animation: ${spin} 1s linear infinite;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const Loading = () => {
  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Spinner
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </Container>
  );
};
