import React from 'react';

import { Flex, useDisclosure } from '@chakra-ui/react';

import ConnectButton from './ConnectButton';
import AccountModal from './AccountModal';
import ChainButton from './ChainButton';
import Logo from '../../../components/logo';
import { Link } from 'react-router-dom';

function NavbarApp() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      justify="space-between"
      height={'60px'}
      boxShadow={'0px 0px 10px rgba(0, 0, 0, 0.15)'}
      position="fixed"
      width={'100%'}
      zIndex={1}
      backgroundColor="box"
    >
      <Flex align="center">
        <Link to="/">
          <Logo w={160} h={6} color="#3A0CA3" />
        </Link>
      </Flex>

      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Flex display={'flex'} align="center">
          <ChainButton />
          <ConnectButton handleOpenModal={onOpen} />
          <AccountModal isOpen={isOpen} onClose={onClose} />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default NavbarApp;
