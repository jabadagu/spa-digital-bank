import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { GlobalStyles } from '@/assets/styles/GlobalStyles';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Home } from '@/pages/Home';
import { Contact } from '@/pages/Contact';
import { ProductDetail } from '@/pages/ProductDetail';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  min-height: calc(100vh - 80px - 250px);
`;

function App() {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <BrowserRouter basename="/spa-digital-bank/">
        <AppContainer>
          <NavBar />
          <MainContent>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
          </MainContent>
          <Footer />
        </AppContainer>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
