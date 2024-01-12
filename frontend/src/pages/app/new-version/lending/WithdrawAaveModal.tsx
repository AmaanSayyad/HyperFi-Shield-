import { useState } from 'react';

import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
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

import { AiFillBank } from 'react-icons/ai';
import { GiReceiveMoney } from 'react-icons/gi';

import { useAdapter } from '../../../../hooks/use-adapter';

type Props = {
  isOpen: any;
  onClose: any;
  tokenBalance: any;
};

function WithdrawAaveModal({ isOpen, onClose, tokenBalance }: Props) {
  const { adapter } = useAdapter();

  const [amount, setAmount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [signed, setSigned] = useState(false);

  const [showAlertError, setShowAlertError] = useState(false);

  const steps = [
    { label: 'Withdraw tokens' },
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
      const withdraw = await adapter.withdrawAave(amount);

      setIsLoading(false);
      setSigned(true);

      const withdrawTx = await withdraw.wait();

      console.log(
        '[dfp][ui][InvestAaveModal][handleApprove] handleApprove() withdrawTx:',
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
        <ModalHeader>Claim deposit in Aave</ModalHeader>
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
            <Box paddingBottom={10}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <Center>
                  <Box width={'300px'}>
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
                                  src="./frontend/wmatic-logo.png"
                                  width={'15%'}
                                />
                                <Text fontSize={14}>WMATIC</Text>
                              </HStack>
                            </Td>
                            <Td isNumeric>{tokenBalance}</Td>
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

                  <Center>
                    <HStack width={'300px'} justifyContent="space-between">
                      <Text>Commit:</Text>
                      <HStack justifyContent="end">
                        <Image src="./frontend/wmatic-logo.png" width={'15%'} />
                        <Text fontSize={14} fontWeight={700}>
                          WMATIC
                        </Text>
                      </HStack>
                    </HStack>
                  </Center>

                  <Center paddingTop={'0'}>
                    <InputGroup
                      boxShadow={'0px 4px 14px rgba(0, 0, 0, 0.1)'}
                      borderRadius={'8px'}
                      height={'50px'}
                      width={'300px'}
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
                      <InputRightElement
                        width="30"
                        paddingRight={'5px'}
                        paddingTop={2}
                      >
                        <Button
                          height={'24px'}
                          border="2px"
                          borderColor="primary"
                          borderRadius={'53px'}
                          onClick={() => setAmount(tokenBalance)}
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
                  </Center>

                  <Center paddingTop={'3'}>
                    <Slider
                      id="slider"
                      defaultValue={5}
                      min={0}
                      max={100}
                      value={(amount / tokenBalance) * 100}
                      onChange={(v) => setAmount(v * (tokenBalance / 100))}
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
                        label={`${(amount / tokenBalance) * 100}%`}
                      >
                        <SliderThumb />
                      </Tooltip>
                    </Slider>
                  </Center>
                </Box>
              </SimpleGrid>

              {/* <Center paddingTop={10} paddingLeft={10} paddingRight={10}>
                <Alert status="warning" borderRadius={10}>
                  <AlertIcon />
                  You are going to do only one transaction. We will do the rest.
                </Alert>
              </Center> */}
            </Box>
          )}

          {activeStep === 2 && !signed && !showAlertError && (
            <>
              <Center paddingTop={10} paddingLeft={10} paddingRight={10}>
                <Alert status="success" borderRadius={10}>
                  <AlertIcon />
                  Withdraw successfully!
                </Alert>
              </Center>

              <Text padding={10}>
                Congratulations, you have just Withdraw{' '}
                <Text as="span" fontWeight={700} color="sixth" fontSize={20}>
                  {amount} WMATIC{' '}
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
              <Box paddingTop={10} paddingLeft={10} paddingRight={10}>
                <Alert status="info" borderRadius={15}>
                  <AlertIcon />
                  <AlertTitle fontWeight={'light'}>
                    The transaction is being processed.
                  </AlertTitle>
                </Alert>
              </Box>

              <HStack paddingLeft={10}>
                <Text>Waiting transacctions to be mined...</Text>

                <Image
                  src="https://feature.undp.org/beyond-bitcoin/es/assets/mbNja7QNnr/block3.gif"
                  width={'50%'}
                />
              </HStack>
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
              disabled={amount === 0 || isLoading || signed || showAlertError}
            >
              Withdraw
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default WithdrawAaveModal;
