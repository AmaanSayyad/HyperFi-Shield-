import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';

import TokenSelector from '../components/TokenSelector';
import IncreseUniModal from './IncreseUniModal';

function IncresePosition() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialToken = 'Select token';

  const [token1, setToken1] = useState(initialToken);

  const [token2, setToken2] = useState(initialToken);

  const [amount1, setAmount1] = useState(0);

  const [amount2, setAmount2] = useState(0);

  const [maxAmount1, setMaxAmount1] = useState(0);

  const [maxAmount2, setMaxAmount2] = useState(0);

  const [balance1Loading, setBalance1Loading] = useState(false);

  const [balance2Loading, setBalance2Loading] = useState(false);

  return (
    <Box width={'600px'}>
      <Text fontSize={'2xl'} fontWeight={'bold'} mb={4}>
        Increase position
      </Text>

      <HStack>
        <TokenSelector
          tokenNumber={1}
          selectedToken={token1}
          setselectedToken={setToken1}
          setAmount={setAmount1}
          setMaxAmount={setMaxAmount1}
          setBalanceLoading={setBalance1Loading}
        />

        <Box>
          <HStack justifyContent={'space-between'} width={'100%'}>
            <Text
              fontWeight={700}
              fontSize={'16px'}
              lineHeight={'18.75px'}
              letterSpacing="5%"
              color={'#282828'}
            >
              Amount
            </Text>

            {!balance1Loading ? (
              <Text
                fontSize={'12px'}
                lineHeight={'14.06px'}
                color={'grayLetter'}
              >
                Available: {maxAmount1}
              </Text>
            ) : (
              <Spinner marginTop={25} color="#E33E84" size={'xs'} />
            )}
          </HStack>

          <InputGroup
            boxShadow={'0px 4px 14px rgba(0, 0, 0, 0.1)'}
            borderRadius={'8px'}
            height={'50px'}
          >
            <Input
              type="number"
              border={'0'}
              focusBorderColor="white"
              value={amount1}
              onChange={(event: any) => setAmount1(event.target.value)}
              margin={'auto'}
              size={'lg'}
            />
            <InputRightElement width="30" paddingRight={'5px'} paddingTop={2}>
              <Button
                height={'24px'}
                border="2px"
                borderColor="primary"
                borderRadius={'53px'}
                onClick={() => setAmount1(maxAmount1)}
              >
                <Text
                  fontWeight={400}
                  fontSize={'14px'}
                  lineHeight={'16.8px'}
                  color={'primary'}
                >
                  Max
                </Text>
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
      </HStack>

      <HStack paddingTop={5}>
        <TokenSelector
          tokenNumber={2}
          selectedToken={token2}
          setselectedToken={setToken2}
          setAmount={setAmount2}
          setMaxAmount={setMaxAmount2}
          setBalanceLoading={setBalance2Loading}
        />

        <Box>
          <HStack justifyContent={'space-between'} width={'100%'}>
            <Text
              fontWeight={700}
              fontSize={'16px'}
              lineHeight={'18.75px'}
              letterSpacing="5%"
              color={'#282828'}
            >
              Amount
            </Text>

            {!balance2Loading ? (
              <Text
                fontSize={'12px'}
                lineHeight={'14.06px'}
                color={'grayLetter'}
              >
                Available: {maxAmount2}
              </Text>
            ) : (
              <Spinner marginTop={25} color="#E33E84" size={'xs'} />
            )}
          </HStack>

          <InputGroup
            boxShadow={'0px 4px 14px rgba(0, 0, 0, 0.1)'}
            borderRadius={'8px'}
            height={'50px'}
          >
            <Input
              type="number"
              border={'0'}
              focusBorderColor="white"
              value={amount2}
              onChange={(event: any) => setAmount2(event.target.value)}
              margin={'auto'}
              size={'lg'}
            />
            <InputRightElement width="30" paddingRight={'5px'} paddingTop={2}>
              <Button
                height={'24px'}
                border="2px"
                borderColor="primary"
                borderRadius={'53px'}
                onClick={() => setAmount2(maxAmount2)}
              >
                <Text
                  fontWeight={400}
                  fontSize={'14px'}
                  lineHeight={'16.8px'}
                  color={'primary'}
                >
                  Max
                </Text>
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
      </HStack>

      <Center>
        <Button
          bg={'eighth'}
          borderRadius={'15'}
          width="250px"
          height="50px"
          marginTop={'20px'}
          onClick={onOpen}
          disabled={token1 === initialToken || amount1 === 0}
        >
          <Text fontSize={'18'} lineHeight={'21.6px'} color="white">
            Increase position
          </Text>
        </Button>
      </Center>

      <IncreseUniModal
        isOpen={isOpen}
        onClose={onClose}
        amount1={amount1}
        amount2={amount2}
      />
    </Box>
  );
}

export default IncresePosition;
