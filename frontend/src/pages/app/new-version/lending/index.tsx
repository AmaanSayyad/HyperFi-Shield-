import { useState } from 'react';

import {
  Center,
  Container,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import FooterApp from '../../footers/FootersApp';
import NavbarApp from '../../navbar/NavbarApp';

import InvestAaveSection from './InvestAaveSection';
import BalanceAndWitdraw from '../components/BalanceAave';

import InvestAaveModal from './InvestAaveModal';

function Lending() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [amount, setAmount] = useState(0);

  return (
    <Flex display={'flex'} flexDirection="column" height={'100vh'}>
      <NavbarApp />

      <Container maxW={'3xl'} textAlign="justify" marginTop={'50px'}>
        <Heading
          fontWeight={600}
          fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}
          paddingTop={10}
          color="third"
        >
          Lending protocol
        </Heading>

        <Text color={'gray.500'} paddingTop={10}>
          This strategy provides liquidity in Aave protocol. This protocol
          matches lenders and borrowers.
        </Text>

        <Text color={'gray.500'} paddingTop={5}>
          It means you provide some asset for someone who needs a borrow of it,
          and you earn a fee by what the
          <Text as={'span'} color="#F72585" fontWeight={700}>
            {' '}
            borrower{' '}
          </Text>
          pays. You become a{' '}
          <Text as={'span'} color="#F72585" fontWeight={700}>
            {' '}
            lender.{' '}
          </Text>
          You can withdraw the amount of the liquidity (plus the earned fees)
          whenever you want.
        </Text>

        <Text color={'gray.500'} paddingTop={10}>
          This strategy requires you to make 2 transactions:
        </Text>

        <Text color={'gray.500'} paddingTop={3} paddingLeft={5}>
          1. Allow our contract to move your tokens.
        </Text>

        <Text color={'gray.500'} paddingTop={3} paddingLeft={5}>
          2. Deposit your tokens in the Aave protocol.
        </Text>

        <Center marginTop={'50px'}>
          <InvestAaveSection
            onOpen={onOpen}
            amount={amount}
            setAmount={setAmount}
          />
        </Center>

        <Center marginTop={'50px'}>
          <BalanceAndWitdraw />
        </Center>
      </Container>

      <InvestAaveModal isOpen={isOpen} onClose={onClose} amount={amount} />

      <FooterApp />
    </Flex>
  );
}

export default Lending;
