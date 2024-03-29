import React, { useEffect } from 'react';

import { Box } from '@chakra-ui/react';

import NavbarLanding from '../app/navbar/NavbarLanding';
import SectionOne from './SectionOne';
import SectionTwo from './SectionTwo';
import FooterLanding from './Footer/FooterLanding';

import { useAdapter } from '../../hooks/use-adapter';

function Landing() {
  const { adapter, setStrategies, strategies } = useAdapter();

  useEffect(() => {
    async function listStrategies() {
      const s = await adapter.listStrategies();
      setStrategies(s);
    }

    listStrategies();
  }, [adapter, setStrategies]);

  return (
    <Box bg={'white'}>
      <NavbarLanding />
      <SectionOne />
      <SectionTwo />
      <FooterLanding />
    </Box>
  );
}

export default Landing;
