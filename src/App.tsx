import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import './App.css';
import FlavorRatingGenerator from './components/FlavorRatingGenerator';
import KCCertificationGenerator from './components/KCCertificationGenerator';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <Link
        to="/"
        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
      >
        맛 표현 생성기
      </Link>
      <Link
        to="/kc-certification"
        className={`nav-link ${
          location.pathname === '/kc-certification' ? 'active' : ''
        }`}
      >
        KC 인증마크 생성기
      </Link>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <h1 className="app-title">인증 마크 생성기</h1>

        <Navigation />

        <Routes>
          <Route path="/" element={<FlavorRatingGenerator />} />
          <Route
            path="/kc-certification"
            element={<KCCertificationGenerator />}
          />
        </Routes>
      </div>
    </Router>
  );
}
