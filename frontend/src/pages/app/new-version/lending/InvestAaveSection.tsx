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
} from '@chakra-ui/react';
import { useState } from 'react';

import TokenSelector from '../components/TokenSelector';

type Props = {
  onOpen: any;
  amount: any;
  setAmount: any;
};

function InvestAaveSection({ onOpen, amount, setAmount }: Props) {
  const initialToken = 'Select token';

  const [token, setToken] = useState(initialToken);

  const [maxAmount, setMaxAmount] = useState(0);

  const [balanceLoading, setBalanceLoading] = useState(false);

  return (
    <Box width={'600px'}>
      <Text fontSize={'2xl'} fontWeight={'bold'} mb={4}>
        Invest
      </Text>

      <HStack>
        <TokenSelector
          tokenNumber={''}
          selectedToken={token}
          setselectedToken={setToken}
          setAmount={setAmount}
          setMaxAmount={setMaxAmount}
          setBalanceLoading={setBalanceLoading}
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

            {!balanceLoading ? (
              <Text
                fontSize={'12px'}
                lineHeight={'14.06px'}
                color={'grayLetter'}
              >
                Available: {maxAmount}
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
              value={amount}
              onChange={(event: any) => setAmount(event.target.value)}
              margin={'auto'}
              size={'lg'}
            />
            <InputRightElement width="30" paddingRight={'5px'} paddingTop={2}>
              <Button
                height={'24px'}
                border="2px"
                borderColor="primary"
                borderRadius={'53px'}
                onClick={() => setAmount(maxAmount)}
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
          bg={'third'}
          borderRadius={'10'}
          width="120px"
          marginTop={'20px'}
          onClick={onOpen}
          disabled={token === initialToken || amount === 0}
        >
          <Text fontSize={'18'} lineHeight={'21.6px'} color="white">
            Deposit
          </Text>
        </Button>
      </Center>
    </Box>
  );
}

export default InvestAaveSection;
