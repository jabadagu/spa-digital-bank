import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const FooterContainer = styled(motion.footer)`
  background: ${({ theme }) => theme.colors.bg.primary};
  border-top: 2px solid ${({ theme }) => theme.colors.border};
  margin-top: auto;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Content = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const Section = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  letter-spacing: -0.3px;
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  a {
    color: ${({ theme }) => theme.colors.text.secondary};
    text-decoration: none;
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    transition: all ${({ theme }) => theme.transitions.fast};
    display: inline-block;

    &:hover {
      color: ${({ theme }) => theme.colors.accent};
      transform: translateX(4px);
    }
  }
`;

const Bottom = styled(motion.div)`
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 2px solid ${({ theme }) => theme.colors.border};
  text-align: center;
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin: 0;
`;

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <FooterContainer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <Content
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          <Section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Title>{t('footer.about')}</Title>
            <Text>{t('footer.aboutText')}</Text>
          </Section>
          <Section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Title>{t('footer.services')}</Title>
            <List>
              <ListItem>
                <a href="/">{t('footer.accounts')}</a>
              </ListItem>
              <ListItem>
                <a href="/">{t('footer.cards')}</a>
              </ListItem>
              <ListItem>
                <a href="/">{t('footer.loans')}</a>
              </ListItem>
              <ListItem>
                <a href="/">{t('footer.investments')}</a>
              </ListItem>
            </List>
          </Section>
          <Section
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Title>{t('footer.legal')}</Title>
            <List>
              <ListItem>
                <a href="/">{t('footer.privacy')}</a>
              </ListItem>
              <ListItem>
                <a href="/">{t('footer.terms')}</a>
              </ListItem>
            </List>
          </Section>
        </Content>
        <Bottom
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Copyright>
            © {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}
          </Copyright>
        </Bottom>
      </Container>
    </FooterContainer>
  );
};
