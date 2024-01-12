import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  SimpleGrid,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';

import { ReactComponent as PolygonLogo } from '../../../../assets/logos/polygon-logo.svg';
import { FaWallet } from 'react-icons/fa';
import { AiFillBank } from 'react-icons/ai';

import { useAdapter } from '../../../../hooks/use-adapter';

import WithdrawAaveModal from '../lending/WithdrawAaveModal';

function BalanceAndWitdraw() {
  const { adapter } = useAdapter();

  const [nativeBalance, setNativeBalance] = useState(0);

  const [tokenBalance, setTokenBalance] = useState(0);

  const [aaveBalance, setAaveBalance] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);

      const nativeToken = await adapter.getNativeToken();

      setNativeBalance(Number((Number(nativeToken.balance) / 1e18).toFixed(6)));

      const tokens = await adapter.getTokens();

      const tokenFound = tokens.find((t: any) => t.symbol === 'WMATIC');

      setTokenBalance(Number((Number(tokenFound?.balance) / 1e18).toFixed(6)));

      const tokensInAave = await adapter.getBalanceAave();

      setAaveBalance(tokensInAave);

      setIsLoading(false);
    };

    fetchProfile();
  }, [adapter]);

  return (
    <Box>
      <Text fontSize={'2xl'} fontWeight={'bold'} mb={4}>
        Balance
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Box>
          <HStack>
            <FaWallet size={20} color="#7209B7" />
            <Text
              fontSize={30}
              color={'third'}
              fontWeight={700}
              letterSpacing={'2px'}
            >
              Wallet
            </Text>
          </HStack>
          <TableContainer>
            <Table variant="striped" colorScheme="purple">
              <Thead>
                <Tr>
                  <Th>Assets</Th>
                  <Th isNumeric>Balance</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <HStack>
                      <PolygonLogo width={22} height={22} />
                      <Text fontSize={14} paddingLeft={2}>
                        MATIC
                      </Text>
                    </HStack>
                  </Td>
                  <Td isNumeric>
                    {isLoading ? <Spinner color="third" /> : nativeBalance}
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <HStack>
                      <Image
                        src={process.env.PUBLIC_URL + '/wmatic-logo.png'}
                        width={'15%'}
                      />
                      <Text fontSize={14}>WMATIC</Text>
                    </HStack>
                  </Td>
                  <Td isNumeric>
                    {isLoading ? <Spinner color="third" /> : tokenBalance}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        <Box>
          <HStack>
            <AiFillBank size={30} color="#F72585" />
            <Text
              fontSize={30}
              color={'primary'}
              fontWeight={700}
              letterSpacing={'2px'}
            >
              Deposited
            </Text>
          </HStack>
          <TableContainer>
            <Table variant="striped" colorScheme="pink">
              <Thead>
                <Tr>
                  <Th>Assets</Th>
                  <Th isNumeric>Balance</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <HStack>
                      <Image
                        src={process.env.PUBLIC_URL + '/wmatic-logo.png'}
                        width={'15%'}
                      />
                      <Text fontSize={14}>WMATIC</Text>
                    </HStack>
                  </Td>
                  <Td isNumeric>
                    {isLoading ? <Spinner color="primary" /> : aaveBalance}
                  </Td>
                </Tr>
                <Tr>
                  <Td colSpan={2}>
                    <Center>
                      <Button color={'white'} bg="sixth" onClick={onOpen}>
                        Withdraw
                      </Button>
                    </Center>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </SimpleGrid>

      <Text paddingTop={5} fontSize={14} color="grey">
        * We only show tokens used in this strategy dApp
      </Text>

      <WithdrawAaveModal
        isOpen={isOpen}
        onClose={onClose}
        tokenBalance={aaveBalance}
      />
    </Box>
  );
}

export default BalanceAndWitdraw;
