import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';

import DashboardHeader from './new-version/DashboardHeader';

import { ReactComponent as AaveLogo } from '../../assets/logos/aave-logo.svg';
import { ReactComponent as PolygonLogo } from '../../assets/logos/polygon-matic-icon.svg';
import { ReactComponent as UniswapLogo } from '../../assets/logos/uniswap-logo.svg';
import { ReactComponent as AvalancheLogo } from '../../assets/logos/avalanche-logo.svg';

import { Link } from 'react-router-dom';

function DashboardBody(this: any) {
  return (
    <Box marginTop={'76px'}>
      <DashboardHeader />

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} padding={10}>
        <Box width={'100%'} bg={'box'} borderRadius={30}>
          <HStack>
            <Text padding={6} fontWeight={700} fontSize={22}>
              Lending
            </Text>
          </HStack>

          <HStack
            justifyContent={'space-between'}
            paddingLeft={6}
            paddingRight={6}
          >
            <Text fontWeight={600} color={'sixth'}>
              Protocol
            </Text>
            <Icon as={AaveLogo} width={8} height={8} color={'white'} />
          </HStack>

          <HStack
            justifyContent={'space-between'}
            paddingLeft={6}
            paddingRight={6}
          >
            <Text fontWeight={600} color={'sixth'}>
              Chain
            </Text>
            <Icon as={PolygonLogo} width={8} height={8} color={'white'} />
          </HStack>

          <Text paddingTop={4} paddingLeft={6} paddingRight={6}>
            This strategy allows the user to lend tokens in the Aave protocol
          </Text>

          <Center padding={6}>
            <Link to="/lending">
              <Button
                bg={'primary'}
                width={'100px'}
                color="white"
                borderRadius={10}
              >
                Invest
              </Button>
            </Link>
          </Center>
        </Box>

        <Box width={'100%'} bg={'box'} borderRadius={30}>
          <HStack>
            <Text padding={6} fontWeight={700} fontSize={22}>
              Liquidity provider
            </Text>
          </HStack>

          <HStack
            justifyContent={'space-between'}
            paddingLeft={6}
            paddingRight={6}
          >
            <Text fontWeight={600} color={'sixth'}>
              Protocol
            </Text>
            <Icon as={UniswapLogo} width={8} height={8} color={'white'} />
          </HStack>

          <HStack
            justifyContent={'space-between'}
            paddingLeft={6}
            paddingRight={6}
          >
            <Text fontWeight={600} color={'sixth'}>
              Chain
            </Text>
            <Icon as={PolygonLogo} width={8} height={8} color={'white'} />
          </HStack>

          <Text paddingTop={4} paddingLeft={6} paddingRight={6}>
            This strategy allows the user to provide liquidity in the Uniswap
            protocol
          </Text>

          <Center padding={6}>
            <Link to="/liquidity-provider">
              <Button
                bg={'primary'}
                width={'100px'}
                color="white"
                borderRadius={10}
              >
                Invest
              </Button>
            </Link>
          </Center>
        </Box>

        <Box width={'100%'} bg={'box'} borderRadius={30}>
          <HStack>
            <Text padding={6} fontWeight={700} fontSize={22}>
              Recursive farming
            </Text>
          </HStack>

          <HStack
            justifyContent={'space-between'}
            paddingLeft={6}
            paddingRight={6}
          >
            <Text fontWeight={600} color={'sixth'}>
              Protocol
            </Text>
            <Icon as={AaveLogo} width={8} height={8} color={'white'} />
          </HStack>

          <HStack
            justifyContent={'space-between'}
            paddingLeft={6}
            paddingRight={6}
          >
            <Text fontWeight={600} color={'sixth'}>
              Chain
            </Text>
            <Icon as={AvalancheLogo} width={8} height={8} color={'white'} />
          </HStack>

          <Text paddingTop={4} paddingLeft={6} paddingRight={6}>
            This strategy allows the user to lend tokens in the Aave protocol
          </Text>

          <Center padding={6}>
            <Button
              bg={'primary'}
              width={'100px'}
              color="white"
              borderRadius={10}
              disabled={true}
            >
              Invest
            </Button>
          </Center>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

export default DashboardBody;
