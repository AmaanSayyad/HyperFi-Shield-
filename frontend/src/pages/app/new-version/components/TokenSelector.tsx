import { useState } from 'react';

import {
  Box,
  Button,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';

import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

import { ReactComponent as DaiLogo } from '../../../../assets/logos/dai-logo.svg';

import { useAdapter } from '../../../../hooks/use-adapter';

function TokenSelector({
  tokenNumber,
  selectedToken,
  setselectedToken,
  setMaxAmount,
  setBalanceLoading,
}: any) {
  const { adapter } = useAdapter();

  const initialToken = 'Select token';

  const handleTokenChange = async (token: string) => {
    console.log('[dfp][ui][TokenSelector][handleTokenChange] token: ', token);
    setselectedToken(token);
    setBalanceLoading(true);

    const nativeToken = await adapter.getNativeToken();
    if (!nativeToken || Number(nativeToken.balance) === 0) {
      setMaxAmount(0);
      setBalanceLoading(false);
      return;
    }

    const tokens = await adapter.getTokens();

    const tokenFound = tokens.find((t: any) => t.symbol === token);

    console.log(
      '[dfp][ui][TokenSelector][handleTokenChange] tokenFound: ',
      tokenFound,
    );

    if (tokenFound) {
      setMaxAmount((Number(tokenFound.balance) / 1e18).toFixed(6));
    }

    setBalanceLoading(false);
  };

  return (
    <Box width={'50%'}>
      <Text
        fontWeight={700}
        fontSize={'16px'}
        lineHeight={'18.75px'}
        letterSpacing="5%"
        color={'#282828'}
      >
        Token {tokenNumber}
      </Text>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={true ? <ChevronDownIcon /> : <ChevronUpIcon />}
          boxShadow={'0px 4px 14px rgba(0, 0, 0, 0.1)'}
          borderRadius={'8px'}
          width={'100%'}
          height={'50px'}
        >
          <HStack>
            <Box display={selectedToken === 'WMATIC' ? 'block' : 'none'}>
              <Image
                src={process.env.PUBLIC_URL + '/wmatic-logo.png'}
                width={'30px'}
              />
            </Box>

            <Box display={selectedToken === 'WETH' ? 'block' : 'none'}>
              <Image
                src={process.env.PUBLIC_URL + '/weth-logo.png'}
                width={'30px'}
              />
            </Box>

            <Box display={selectedToken === 'DAI' ? 'block' : 'none'}>
              <DaiLogo width={25} height={25} />
            </Box>

            <Text
              fontSize={'16px'}
              lineHeight={'18.75px'}
              letterSpacing="5%"
              color={selectedToken === initialToken ? '#666666' : 'black'}
            >
              {selectedToken}
            </Text>
          </HStack>
        </MenuButton>

        <MenuList border={'0'} minW="0" w={'200px'}>
          <MenuItem
            onClick={() => handleTokenChange('WETH')}
            display={tokenNumber === 1 ? 'block' : 'none'}
          >
            <HStack>
              <Image src="./frontend/weth-logo.png" width={'15%'} />

              <Text
                fontSize={'16px'}
                lineHeight={'18.75px'}
                letterSpacing="5%"
                color={'black'}
                padding={3}
              >
                WETH
              </Text>
            </HStack>
          </MenuItem>

          <MenuItem
            onClick={() => handleTokenChange('WMATIC')}
            display={tokenNumber === 2 || tokenNumber === '' ? 'block' : 'none'}
          >
            <HStack>
              <Image src="./frontend/wmatic-logo.png" width={'20%'} />
              <Text
                fontSize={'16px'}
                lineHeight={'18.75px'}
                letterSpacing="5%"
                color={'black'}
                padding={3}
              >
                WMATIC
              </Text>
            </HStack>
          </MenuItem>

          {/* <MenuItem onClick={() => handleTokenChange('DAI')}>
            <DaiLogo width={25} height={25} />

            <Text
              fontSize={'16px'}
              lineHeight={'18.75px'}
              letterSpacing="5%"
              color={'black'}
              padding={3}
            >
              DAI
            </Text>
          </MenuItem> */}
          {/* 
          <MenuItem onClick={() => handleTokenChange('ETH')}>
            <EthLogo width={25} height={25} />

            <Text
              fontSize={'16px'}
              lineHeight={'18.75px'}
              letterSpacing="5%"
              color={'black'}
              padding={3}
            >
              ETH
            </Text>
          </MenuItem> */}
        </MenuList>
      </Menu>
    </Box>
  );
}

export default TokenSelector;
