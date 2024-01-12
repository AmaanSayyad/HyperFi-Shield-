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
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from '@chakra-ui/react';

import { Step, Steps, useSteps } from 'chakra-ui-steps';

import { AiOutlineSwap } from 'react-icons/ai';
import { GiReceiveMoney } from 'react-icons/gi';
import { FaMoneyBillAlt, FaRegMoneyBillAlt } from 'react-icons/fa';

import { useAdapter } from '../../../../hooks/use-adapter';

type Props = {
  isOpen: any;
  onClose: any;
  token1Balance: any;
  token2Balance: any;
};

function WithdrawUniModal({
  isOpen,
  onClose,
  token1Balance,
  token2Balance,
}: Props) {
  const { adapter } = useAdapter();

  const [percentage, setPercentage] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [signed, setSigned] = useState(false);

  const [showAlertError, setShowAlertError] = useState(false);

  const steps = [
    { label: 'Decrease position ' },
    { label: 'Finish proccess! 🎉' },
  ];

  const { nextStep, activeStep, reset } = useSteps({
    initialStep: 0,
  });

  const [showTooltip, setShowTooltip] = useState(false);

  const handleWithdraw = async () => {
    setIsLoading(true);
    setSigned(false);
    setShowAlertError(false);

    try {
      const withdraw = await adapter.decreasePosition(1, percentage, 100);

      setIsLoading(false);
      setSigned(true);

      const withdrawTx = await withdraw.wait();

      console.log(
        '[dfp][ui][InvestUniModal][handleWithdraw] handleApprove() withdrawTx:',
        withdrawTx,
      );

      setShowAlertError(false);
      setSigned(false);
      setIsLoading(false);

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
      <ModalContent>
        <ModalHeader>Decrese position in Uniswap</ModalHeader>
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
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <Center>
                  <Box width={'300px'}>
                    <HStack>
                      <FaMoneyBillAlt size={20} color="#F72585" />
                      <AiOutlineSwap size={20} color="#F72585" />
                      <FaRegMoneyBillAlt size={20} color="#F72585" />
                      <Text
                        fontSize={30}
                        color={'primary'}
                        fontWeight={700}
                        letterSpacing={'2px'}
                      >
                        Position
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
                                  src="./frontend/weth-logo.png"
                                  width={'15%'}
                                />
                                <Text fontSize={14}>WETH</Text>
                              </HStack>
                            </Td>
                            <Td isNumeric>{token1Balance}</Td>
                          </Tr>
                          <Tr>
                            <Td>
                              <HStack>
                                <Image
                                  src="./frontend/wmatic-logo.png"
                                  width={'15%'}
                                />
                                <Text fontSize={14}>WMATIC</Text>
                              </HStack>
                            </Td>
                            <Td isNumeric>{token2Balance}</Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Center>

                <Box>
                  <HStack>
                    <GiReceiveMoney size={30} color="#F72585" />
                    <Text
                      fontSize={30}
                      color={'primary'}
                      fontWeight={700}
                      letterSpacing={'2px'}
                    >
                      Withdraw
                    </Text>
                  </HStack>

                  <Text padding={'5'}>
                    In this strategy you can only withdraw a percentage of your
                    position. From 0 to 100%.{' '}
                  </Text>

                  <Center paddingTop={'3'}>
                    <Slider
                      id="slider"
                      step={5}
                      min={0}
                      max={100}
                      value={percentage}
                      onChange={(v) => setPercentage(v)}
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      width={'300px'}
                    >
                      <SliderMark value={25} mt="1" ml="-2.5" fontSize="sm">
                        25%
                      </SliderMark>
                      <SliderMark value={50} mt="1" ml="-2.5" fontSize="sm">
                        50%
                      </SliderMark>
                      <SliderMark value={75} mt="1" ml="-2.5" fontSize="sm">
                        75%
                      </SliderMark>
                      <SliderMark value={100} mt="1" ml="-2.5" fontSize="sm">
                        100%
                      </SliderMark>
                      <SliderTrack bg={'gray'}>
                        <SliderFilledTrack bg={'primary'} />
                      </SliderTrack>
                      <Tooltip
                        hasArrow
                        bg="primary"
                        color="white"
                        placement="top"
                        isOpen={showTooltip}
                        label={percentage}
                      >
                        <SliderThumb />
                      </Tooltip>
                    </Slider>
                  </Center>
                </Box>
              </SimpleGrid>

              <Center paddingTop={10} paddingLeft={10} paddingRight={10}>
                <Alert status="warning" borderRadius={10}>
                  <AlertIcon />
                  You are going to do only one transaction. We will do the rest.
                </Alert>
              </Center>
            </Box>
          )}

          {activeStep === 2 && !signed && !showAlertError && (
            <>
              <Center paddingTop={10} paddingLeft={10} paddingRight={10}>
                <Alert status="success" borderRadius={10}>
                  <AlertIcon />
                  Claim successfully!
                </Alert>
              </Center>

              <Text padding={10}>
                Congratulations, you have just claim{' '}
                <Text as="span" fontWeight={700} color="sixth" fontSize={20}>
                  {token1Balance} WMATIC{' '}
                </Text>{' '}
                from Aave protocol 🎉.
              </Text>

              <HStack>
                <Text paddingLeft={10}>
                  Your balance update will be available in a few seconds.
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
              onClick={handleWithdraw}
              marginLeft={'20px'}
              disabled={
                percentage === 0 ||
                isLoading ||
                signed ||
                showAlertError ||
                !token1Balance ||
                !token2Balance
              }
            >
              Withdraw
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default WithdrawUniModal;
