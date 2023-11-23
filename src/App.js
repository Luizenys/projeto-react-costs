import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/pages/Home'
import Company from './components/pages/Company'
import Contact from './components/pages/Contact'
import NewProject from './components/pages/NewProject'
import Projects from './components/pages/Projects'

import Container from './components/layout/container/Container'
import Navbar from './components/layout/navbar/Navbar'
import Footer from './components/layout/footer/Footer'

function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <Container customClass="min-height">
        <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/company" element={<Company/>} />
            <Route exact path="/contact" element={<Contact/>} />
            <Route exact path="/projects" element={<Projects/>} />
            <Route exact path="/newproject" element={<NewProject/>} />
        </Routes>
      </Container>
      <Footer></Footer>
    </Router>
  );
}

export default App;
