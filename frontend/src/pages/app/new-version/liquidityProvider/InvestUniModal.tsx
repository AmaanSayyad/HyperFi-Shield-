import { useState } from 'react';

import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  HStack,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Step, Steps, useSteps } from 'chakra-ui-steps';

import { ReactComponent as PolygonLogo } from '../../../../assets/logos/polygon-logo.svg';

import { useAdapter } from '../../../../hooks/use-adapter';

import { TokenSymbol } from '../../../../utils/network-manager/manager.types';

type Props = {
  isOpen: any;
  onClose: any;
  amount1: any;
  amount2: any;
};

function InvestUniModal({ isOpen, onClose, amount1, amount2 }: Props) {
  const { adapter } = useAdapter();

  const steps = [
    { label: 'Approve move first token' },
    { label: 'Approve move second token' },
    { label: 'Provide liquidity' },
    { label: 'Finish proccess! 🎉' },
  ];

  const { nextStep, activeStep, reset } = useSteps({
    initialStep: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [signed, setSigned] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);

  const handleApprove = async (tokenSymbol: TokenSymbol) => {
    setIsLoading(true);
    setShowAlertError(false);
    setSigned(false);

    try {
      const approveDeposit = await adapter.approveDepositUniswap(
        amount1,
        tokenSymbol,
      );

      setIsLoading(false);
      setSigned(true);

      const approveTx = await approveDeposit.wait();

      console.log(
        '[dfp][ui][InvestUniSection][handleApprove] handleApprove() approveTx:',
        approveTx,
      );

      setShowAlertError(false);
      setSigned(false);

      nextStep();
    } catch (error) {
      console.log(error);

      setIsLoading(false);
      setShowAlertError(true);
      setSigned(false);
    }
  };

  const handleProvideLiquidity = async () => {
    setIsLoading(true);
    setShowAlertError(false);
    setSigned(false);

    try {
      const provideLiquidity = await adapter.mintNewPosition(amount1, amount2);

      setIsLoading(false);
      setSigned(true);

      const provideLiquidityTx = await provideLiquidity.wait();

      console.log(
        '[dfp][ui][InvestUniModal][handleProvideLiquidity] handleProvideLiquidity() provideLiquidityTx:',
        provideLiquidityTx,
      );

      setShowAlertError(false);
      setSigned(false);

      nextStep();
      nextStep();
    } catch (error) {
      console.log(error);

      setIsLoading(false);
      setShowAlertError(true);
      setSigned(false);
    }
  };

  const handleClose = () => {
    reset();

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={'4xl'}>
      <ModalOverlay />
      <ModalContent borderRadius={20}>
        <ModalHeader>Deposit tokens in Uniswap</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Steps
              labelOrientation="vertical"
              activeStep={activeStep}
              responsive={false}
              size={'sm'}
            >
              {steps.map(({ label }) => (
                <Step label={label} key={label}></Step>
              ))}
            </Steps>
          </Box>

          {activeStep === 0 && !signed && !showAlertError && (
            <Box>
              <Text paddingLeft={10} paddingTop={10}>
                First approve. This will allow to our contract to move your
                first token.
              </Text>

              <HStack paddingTop={10}>
                <Text paddingLeft={10}>
                  You are going to allow us to move &nbsp;
                  <Text as="span" fontWeight={700} color="sixth" fontSize={20}>
                    {amount1} WMATIC
                  </Text>
                  &nbsp; to the Uniswap protocol. In the polygon network
                </Text>
                <PolygonLogo width={40} height={40} />
              </HStack>

              <Center paddingTop={10} paddingLeft={10} paddingRight={10}>
                <Alert status="warning" borderRadius={10}>
                  <AlertIcon />
                  Remember, you are going to do &nbsp;
                  <Text as="span" fontSize={16} fontWeight={700}>
                    3
                  </Text>
                  &nbsp; transacctions.
                </Alert>
              </Center>

              <Center padding={10}>
                <Alert status="warning" borderRadius={10}>
                  <AlertIcon />
                  Remember, you are need to have some MATIC in your wallet to
                  pay the gas fees.
                </Alert>
              </Center>
            </Box>
          )}

          {activeStep === 1 && !signed && !showAlertError && (
            <>
              <Center paddingTop={10} paddingLeft={10} paddingRight={10}>
                <Alert status="success" borderRadius={10}>
                  <AlertIcon />
                  Approved successfully!
                </Alert>
              </Center>

              <Text paddingTop={10} paddingLeft={10}>
                Thanks for allowing us to move your token to Uniswap protocol 🙌
              </Text>

              <HStack paddingTop={10} paddingLeft={10}>
                <Text>
                  Now, you are going to allow us to move &nbsp;
                  <Text as="span" fontWeight={700} color="sixth" fontSize={20}>
                    {amount2} WETH
                  </Text>
                  &nbsp; to the Uniswap protocol. In the polygon network
                </Text>
                <PolygonLogo width={40} height={40} />
              </HStack>
            </>
          )}

          {activeStep === 2 && !signed && !showAlertError && (
            <>
              <Center paddingTop={10} paddingLeft={10} paddingRight={10}>
                <Alert status="success" borderRadius={10}>
                  <AlertIcon />
                  Approved successfully!
                </Alert>
              </Center>

              <Text paddingTop={10} paddingLeft={10}>
                Thanks for allowing us to move your tokens to Uniswap protocol
                🙌
              </Text>

              <HStack paddingTop={10} paddingLeft={10} paddingRight={10}>
                <Text>
                  Now, you are going to allow us to provide liquidity &nbsp;
                  <Text as="span" fontWeight={700} color="sixth" fontSize={20}>
                    {amount1} WMATIC
                  </Text>
                  &nbsp; and &nbsp;
                  <Text as="span" fontWeight={700} color="sixth" fontSize={20}>
                    {amount1} WETH
                  </Text>
                  &nbsp;to the Uniswap protocol.
                </Text>
              </HStack>

              <HStack paddingTop={10} paddingLeft={10}>
                <Text>
                  You can see the pool to which you are going to grant
                  liquidities here:
                </Text>
                <Link
                  href="https://info.uniswap.org/#/polygon/pools/0x86f1d8390222a3691c28938ec7404a1661e618e0"
                  isExternal
                >
                  <Text fontSize={'18'} fontWeight={700} color="primary">
                    Pool WMATIC/WETH
                  </Text>
                </Link>
              </HStack>
            </>
          )}

          {activeStep === 4 && !signed && !showAlertError && (
            <>
              <Center paddingTop={10} paddingLeft={10} paddingRight={10}>
                <Alert status="success" borderRadius={10}>
                  <AlertIcon />
                  Successfully providing liquidity!!
                </Alert>
              </Center>

              <Text paddingTop={10} paddingLeft={10} paddingRight={10}>
                Congratulations, you have just deposited{' '}
                <Text as="span" fontWeight={700} color="sixth" fontSize={20}>
                  {amount1} WMATIC{' '}
                </Text>{' '}
                and{' '}
                <Text as="span" fontWeight={700} color="sixth" fontSize={20}>
                  {amount1} WETH{' '}
                </Text>{' '}
                in the pool of Uniswap protocol.
              </Text>

              <Text paddingTop={10} paddingLeft={10} paddingRight={10}>
                Your balance update will be available in a few seconds.
              </Text>

              <HStack>
                <Text paddingTop={10} paddingLeft={10} paddingRight={10}>
                  You can withdraw them at any time with the claim button.
                </Text>
              </HStack>
            </>
          )}

          {isLoading && (
            <HStack paddingLeft={10} paddingTop={10}>
              <Text>Waiting for confirmation with your wallet...</Text>
              <Spinner size={'md'} />
            </HStack>
          )}

          {signed && (
            <Center>
              <VStack paddingTop={10}>
                <Alert
                  marginBottom={5}
                  status="info"
                  borderRadius={15}
                  width={'80%'}
                >
                  <AlertIcon />
                  <AlertTitle fontWeight={'light'}>
                    The transaction is being processed.
                  </AlertTitle>
                </Alert>

                <HStack paddingLeft={10}>
                  <Text fontWeight={700}>
                    Waiting transacctions to be mined...
                  </Text>

                  <Image
                    src="https://feature.undp.org/beyond-bitcoin/es/assets/mbNja7QNnr/block3.gif"
                    width={'50%'}
                  />
                </HStack>
              </VStack>
            </Center>
          )}

          {showAlertError && (
            <Box padding={10}>
              <VStack>
                <Alert
                  marginBottom={5}
                  status="error"
                  borderRadius={15}
                  width={'80%'}
                >
                  <AlertIcon />
                  <AlertTitle>The transaction has failed</AlertTitle>
                </Alert>

                <Text>
                  Please, try again 10 minutes later. If the problem persists,
                  contact us.
                </Text>
              </VStack>
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            bg="white"
            boxShadow="0px 1px 10px rgba(0, 0, 0, 0.15)"
            borderRadius={'10px'}
            onClick={handleClose}
            color={'primary'}
          >
            Close
          </Button>

          {activeStep === 0 && (
            <Button
              bg="primary"
              boxShadow="0px 1px 10px rgba(0, 0, 0, 0.15)"
              borderRadius={'10px'}
              color={'white'}
              onClick={() => handleApprove('WMATIC')}
              marginLeft={'20px'}
              disabled={isLoading || signed || showAlertError}
            >
              Approve token 1
            </Button>
          )}

          {activeStep === 1 && (
            <Button
              bg="primary"
              boxShadow="0px 1px 10px rgba(0, 0, 0, 0.15)"
              borderRadius={'10px'}
              color={'white'}
              onClick={() => handleApprove('WETH')}
              marginLeft={'20px'}
              disabled={isLoading || signed || showAlertError}
            >
              Approve token 2
            </Button>
          )}

          {activeStep === 2 && (
            <Button
              bg="primary"
              boxShadow="0px 1px 10px rgba(0, 0, 0, 0.15)"
              borderRadius={'10px'}
              color={'white'}
              onClick={handleProvideLiquidity}
              marginLeft={'20px'}
              disabled={isLoading || signed || showAlertError}
            >
              Provide liquidity
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default InvestUniModal;
