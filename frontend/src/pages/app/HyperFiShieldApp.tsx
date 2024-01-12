import { Flex } from '@chakra-ui/react';

import Dashboard from './Dashboard';
import FooterApp from './footers/FootersApp';

import NavbarApp from './navbar/NavbarApp';

function HyperFiShieldApp() {
  return (
    <Flex display={'flex'} flexDirection="column" height={'100vh'}>
      <NavbarApp />
      <Dashboard />
      <FooterApp />
    </Flex>
  );
}

export default HyperFiShieldApp;
