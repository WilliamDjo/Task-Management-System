import React from 'react';
import {
  Button,
  Center,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { fetchBackend } from '../fetch';

const GenerateReportButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [reportGenerated, setReportGenerated] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);

  const toast = useToast();

  const handleModalOpen = () => {
    setReportGenerated(false);
    onOpen();
  }

  const handleSubmit = () => {
    const successSubmit = () => {
      setReportGenerated(true);
      setButtonLoading(false);
    }

    const failSubmit = () => {
      setButtonLoading(false);
    }

    setButtonLoading(true);
    const token = localStorage.getItem('token');

    successSubmit();
    fetchBackend(`/report/${fromDate}/${toDate}`, 'GET', { token }, toast, successSubmit, failSubmit)
  }

  return (
    <Center>
      <Button
        loadingText="Submitting"
        bg={'blue.400'}
        color={'white'}
        _hover={{ bg: 'blue.500' }}
        onClick={handleModalOpen}
      >
        Generate Financial Report
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generate Financial Report</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {
              !reportGenerated
                ? (
                  <>
                    Time Period:
                    <Flex align='center'>
                      <Input type='date' value={fromDate} onChange={(event) => setFromDate(event.target.value)}/>
                      <Text>&nbsp;&mdash;&nbsp;</Text>
                      <Input type='date' value={toDate} onChange={(event) => setToDate(event.target.value)}/>
                    </Flex>
                  </>
                  )
                : (
                  <>
                    Report sent to email inbox.
                  </>
                  )
            }
          </ModalBody>
          <ModalFooter>
            {
              !reportGenerated && (
                <Button
                  loadingText="Submitting"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{ bg: 'blue.500' }}
                  onClick={handleSubmit}
                  isLoading={buttonLoading}
                >
                  Submit
                </Button>
              )
            }
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}

export default GenerateReportButton;
