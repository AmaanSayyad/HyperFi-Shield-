import { Route, Routes } from 'react-router-dom';

import HyperFiShieldApp from './pages/app/HyperFiShieldApp';

import Landing from './pages/landing/Landing';
import Onboarding from './pages/onboarding/Onboarding';
import Building from './pages/building/Building';
import SimulatePage from './pages/simulate/SimulatePage';
import Strategies from './pages/strategies/Strategies';
import Lending from './pages/app/new-version/lending';
import LiquidityProvider from './pages/app/new-version/liquidityProvider';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<HyperFiShieldApp />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/building" element={<Building />} />
      <Route path="/simulate" element={<SimulatePage />} />
      <Route path="/strategies" element={<Strategies />} />
      <Route path="/lending" element={<Lending />} />
      <Route path="/liquidity-provider" element={<LiquidityProvider />} />
    </Routes>
  );
}

export default App;
