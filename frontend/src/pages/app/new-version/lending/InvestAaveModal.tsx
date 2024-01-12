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

type Props = {
  isOpen: any;
  onClose: any;
  amount: any;
};

function InvestAaveModal({ isOpen, onClose, amount }: Props) {
  const { adapter } = useAdapter();

  const steps = [
    { label: 'Approve move tokens' },
    { label: 'Deposit tokens in Aave protocol' },
    { label: 'Finish proccess! 🎉' },
  ];

  const { nextStep, activeStep, reset } = useSteps({
    initialStep: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [signed, setSigned] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    setShowAlertError(false);
    setSigned(false);

    try {
      const approveDeposit = await adapter.approveDepositAave(amount);

      setIsLoading(false);
      setSigned(true);

      const approveTx = await approveDeposit.wait();

      console.log(
        '[dfp][ui][InvestAaveModal][handleApprove] handleApprove() approveTx:',
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

  const handleDeposit = async () => {
    setIsLoading(true);
    setShowAlertError(false);
    setSigned(false);

    try {
      const deposit = await adapter.depositAave(amount);

      setIsLoading(false);
      setSigned(true);

      const depositTx = await deposit.wait();

      setShowAlertError(false);
      setSigned(false);

      nextStep();
      nextStep();

      console.log('depositTx', depositTx);
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
        <ModalHeader>Deposit tokens in Aave</ModalHeader>
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
                First, you have to approve our contract to move your tokens.
              </Text>

              <HStack paddingTop={10}>
                <Text paddingLeft={10}>
                  You are going to allow us to move{' '}
                  <Text as="span" fontWeight={700} color="sixth" fontSize={20}>
                    {amount} WMATIC{' '}
                  </Text>{' '}
                  to the Aave protocol. In the polygon network
                </Text>
                <PolygonLogo width={40} height={40} />
              </HStack>

              <Center paddingTop={10} paddingLeft={10} paddingRight={10}>
                <Alert status="warning" borderRadius={10}>
                  <AlertIcon />
                  Remember, you are going to do two transacctions.
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

              <Text padding={10}>
                Thanks for allowing us to move your tokens to Aave protocol 🙌
              </Text>

              <Text paddingLeft={10}>
                Now we are going to{' '}
                <Text as="b" color={'primary'}>
                  deposit
                </Text>{' '}
                in Aave protocol. Your tokens will be used by Aave to lend to
                other borrowers.
              </Text>

              <HStack paddingTop={10}>
                <Text paddingLeft={10}>
                  You are going to deposit{' '}
                  <Text as="span" fontWeight={700} color="sixth" fontSize={20}>
                    {amount} WMATIC{' '}
                  </Text>{' '}
                  to the Aave protocol. In the Polygon network.
                </Text>
                <PolygonLogo width={40} height={40} />
              </HStack>
            </>
          )}

          {activeStep === 3 && !signed && !showAlertError && (
            <>
              <Center paddingTop={10} paddingLeft={10} paddingRight={10}>
                <Alert status="success" borderRadius={10}>
                  <AlertIcon />
                  Deposit successfully!
                </Alert>
              </Center>

              <Text padding={10}>
                Congratulations, you have just deposited{' '}
                <Text as="span" fontWeight={700} color="sixth" fontSize={20}>
                  {amount} WMATIC{' '}
                </Text>{' '}
                in the Aave protocol 🎉.
              </Text>

              <HStack>
                <Text paddingLeft={10}>
                  Your balance update will be available in a few seconds.
                </Text>
              </HStack>

              <HStack>
                <Text paddingLeft={10} paddingTop={10}>
                  You can withdraw them at any time with the withdraw button.
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
            <Box>
              <Center paddingTop={10} paddingLeft={10} paddingRight={10}>
                <Alert status="error" borderRadius={10}>
                  <AlertIcon />
                  The transaction has failed
                </Alert>
              </Center>

              <Text paddingTop={10} paddingLeft={10}>
                Please, try again 10 minutes later. If the problem persists,
                contact us.
              </Text>
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
              onClick={handleApprove}
              marginLeft={'20px'}
              disabled={isLoading || signed || showAlertError}
            >
              Approve
            </Button>
          )}

          {activeStep === 1 && (
            <Button
              bg="primary"
              boxShadow="0px 1px 10px rgba(0, 0, 0, 0.15)"
              borderRadius={'10px'}
              color={'white'}
              onClick={handleDeposit}
              marginLeft={'20px'}
              disabled={isLoading || signed || showAlertError}
            >
              Deposit
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default InvestAaveModal;
