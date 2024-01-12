import { useEffect, useState } from 'react';

import {
  Center,
  Container,
  Flex,
  Heading,
  Spinner,
  Text,
} from '@chakra-ui/react';

import FooterApp from '../../footers/FootersApp';
import NavbarApp from '../../navbar/NavbarApp';

import BalanceUni from './BalanceUni';
import IncresePosition from './IncresePosition';

import { useAdapter } from '../../../../hooks/use-adapter';
import InvestUniSection from './InvestUniSection';

function LiquidityProvider() {
  const { adapter } = useAdapter();

  const [isLoading, setIsLoading] = useState(false);

  const [firstPosition, setFirstPosition] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);

      const balance = await adapter.getBalanceUniswap();

      setFirstPosition(balance.tuple === '0.0' ? true : false);

      setIsLoading(false);
    };

    fetchProfile();
  }, [adapter]);

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
          Liquidity provider
        </Heading>
        <Text color={'gray.500'} paddingTop={10}>
          This strategy provides liquidity in pool ETH/MATIC in Uniswap
          protocol. This protocol keeps to the users swap tokens in a
          descentralized way.
        </Text>
        <Text color={'gray.500'} paddingTop={5}>
          It means you provide two assets for someone who needs a swap of it,
          and you earn a fee by what the
          <Text as={'span'} color="#F72585" fontWeight={700}>
            {' '}
            swaper{' '}
          </Text>
          pays. You become a{' '}
          <Text as={'span'} color="#F72585" fontWeight={700}>
            {' '}
            liquidity provider{' '}
          </Text>
          You can withdraw the amount of the liquidity (plus the earned fees)
          whenever you want.
        </Text>
        <Text color={'gray.500'} paddingTop={10}>
          This strategy requires you to make 3 transactions:
        </Text>
        <Text color={'gray.500'} paddingTop={3} paddingLeft={5}>
          1. Allow our contract to move your first token.
        </Text>
        <Text color={'gray.500'} paddingTop={3} paddingLeft={5}>
          1. Allow our contract to move your seconds token.
        </Text>
        <Text color={'gray.500'} paddingTop={3} paddingLeft={5}>
          2. Deposit your tokens Uniswap pool ETH/MATIC to provide liquidity.
        </Text>

        {isLoading ? (
          <Center padding={20}>
            <Spinner color="primary" size={'lg'} />
          </Center>
        ) : firstPosition ? (
          <Center marginTop={'50px'}>
            <InvestUniSection />
          </Center>
        ) : (
          <Center marginTop={'50px'}>
            <IncresePosition />
          </Center>
        )}

        <Center marginTop={'50px'}>
          <BalanceUni />
        </Center>
      </Container>

      <FooterApp />
    </Flex>
  );
}

export default LiquidityProvider;
