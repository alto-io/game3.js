import React, { useState } from "react";
import styled from "styled-components";
import {
  Box,
  Link,
  Icon,
  Button,
  Flex,
  Modal,
  Text,
  Heading,
  QR,
  Card,
  Form,
  Field,
  Input,
  Select
} from "rimble-ui";

const ModalFooter = styled(Flex)`
  border-top: 1px solid #ccc;
`;

const LowBalanceBody = ({
  toggleModal,
  toggleShowMoveEth,
  toggleShowBuyEth
}) => {
  return (
    <Box>
      <Flex justifyContent={"flex-end"}>
        <Link onClick={toggleModal} color={"#CCC"} p={3} title={"Close"}>
          <Icon name="Close" />
        </Link>
      </Flex>
      <Flex
        flexDirection={"column"}
        justifyContent={"space-between"}
        mx={5}
        mb={0}
      >
        <Heading.h3>Not enough ETH for transaction fees</Heading.h3>
        <Text my={3}>
          Buy some Ether (ETH) or move some to this account to purchase your
          ticket &mdash; you'll need at least{" "}
          <Text fontWeight={"bold"} as={"span"}>
            $0.10
          </Text>{" "}
          or{" "}
          <Text fontWeight={"bold"} as={"span"}>
            0.001 ETH
          </Text>
        </Text>

        <Flex mt={3} mb={4}>
          <Icon name={"InfoOutline"} size={"32px"} mr={3} color={"primary"} />
          <Text>
            Every blockchain transaction has a fee – paid in ETH – to cover
            processing costs.
          </Text>
        </Flex>
      </Flex>
      <ModalFooter p={3} alignItems={"center"} justifyContent={"space-between"}>
        <Link mr={3} href onClick={toggleShowMoveEth}>
          Move ETH from another account
        </Link>
        <Button onClick={toggleShowBuyEth}>Buy with card</Button>
      </ModalFooter>
    </Box>
  );
};

const MoveEth = ({ toggleShowMoveEth, toggleModal, address }) => {
  return (
    <Box>
      <Flex justifyContent={"space-between"} mb={3}>
        <Link onClick={toggleShowMoveEth} p={3}>
          Back
        </Link>
        <Link onClick={toggleModal} color={"#CCC"} p={3} title={"Close"}>
          <Icon name="Close" />
        </Link>
      </Flex>
      <Box mx={5} mb={5}>
        <Heading.h3 mb={4}>Move ETH</Heading.h3>

        <Text mb={4}>
          Got ETH in another account? Scan this code from a mobile wallet to
          move ETH to this account. You'll need at least $0.02 (0.000112 ETH).
        </Text>
        <Flex alignItems={"center"} flexDirection={"column"} mb={4}>
          <QR value={address} width={[1, 1 / 2]} />

          <Text bg={"#ccc"} borderRadius={"3px"} p={3} mt={3}>
            {address}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

const BuyEth = ({ toggleShowBuyEth, toggleModal, address }) => {
  return (
    <Box>
      <Flex mb={3} justifyContent={"space-between"}>
        <Link onClick={toggleShowBuyEth} p={3}>
          Back
        </Link>
        <Link onClick={toggleModal} color={"#CCC"} p={3} title={"Close"}>
          <Icon name="Close" />
        </Link>
      </Flex>
      <Box mx={5} mb={5}>
        <Flex>
          <Box width={[1, 1 / 2]}>
            <Heading.h3 mb={4}>Buy ETH</Heading.h3>

            <Text mb={4}>
              Buy ETH for this account. You'll need at least $0.02 (0.000112
              ETH).
            </Text>
            <Flex alignItems={"center"} flexDirection={"column"} mb={4}></Flex>
          </Box>
          <FiatRamp width={[1, 1 / 2]} />
        </Flex>
      </Box>
    </Box>
  );
};

const FiatRamp = () => {
  return (
    <Box>
      <Card>
        <Heading as={"h3"}>Buy ETH Instantly</Heading>
        <Form>
          <Field label="Currency">
            <Select readOnly options={[{ value: "eth", label: "Ethereum" }]} />
          </Field>
          <Field label="Amount">
            <Input type="number" min={"0"} placeholder={"$50.00"} />
          </Field>
          <Text color={"#aaa"}>Summary</Text>
          <Flex justifyContent={"space-between"}>
            <Text color={"#aaa"}>~ 0.28613 ETH @ $174.75</Text>{" "}
            <Text color={"#aaa"}> $50.00</Text>
          </Flex>
          <Flex justifyContent={"space-between"} mb={2}>
            <Text color={"#aaa"}>MoonPay Fee</Text>{" "}
            <Text color={"#aaa"}> $4.99</Text>
          </Flex>
          <Flex justifyContent={"space-between"} mb={3}>
            <Text>Total</Text> <Text> $54.99</Text>
          </Flex>
          <Button
            width={[1]}
            onClick={e => {
              e.preventDefault();
              return;
            }}
          >
            Buy now
          </Button>
        </Form>
      </Card>
    </Box>
  );
};

function TxLowBalanceModal({ isOpen, toggleModal, address }) {
  const [showMoveEth, setShowMoveEth] = useState(false);
  const [showBuyEth, setShowBuyEth] = useState(false);

  const toggleShowMoveEth = () => {
    setShowMoveEth(!showMoveEth);
  };

  const toggleShowBuyEth = () => {
    setShowBuyEth(!showBuyEth);
  };

  return (
    <Modal isOpen={isOpen}>
      <Box bg={"background"}>
        {showMoveEth && (
          <MoveEth
            toggleShowMoveEth={toggleShowMoveEth}
            toggleModal={toggleModal}
            address={address}
          />
        )}
        {showBuyEth && (
          <BuyEth
            toggleShowBuyEth={toggleShowBuyEth}
            toggleModal={toggleModal}
            address={address}
          />
        )}
        {!showMoveEth && !showBuyEth && (
          <LowBalanceBody
            toggleShowMoveEth={toggleShowMoveEth}
            toggleShowBuyEth={toggleShowBuyEth}
            toggleModal={toggleModal}
          />
        )}
      </Box>
    </Modal>
  );
}

export default TxLowBalanceModal;
