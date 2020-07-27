import React from "react";
import styled from 'styled-components'
import { Card, Text, Table, Pill, Link } from "rimble-ui";

const TransactionTable = styled(Table)`
  & {
    display: block;
    width: 100%;
    overflow: auto;
    border-width: 0;
  }

  th,
  td {
    border: solid;
    border-width: 1px;
    border-color: inherit;
    padding: 0 1.5rem;
  }
`;

class TransactionsCard extends React.Component {
  render() {
    return (
      <Card maxWidth={'640px'} px={4} mx={'auto'}>
        <Text fontWeight={3} mb={3}>
          Activity (Transactions):
        </Text>

        <TransactionTable>

          <thead>
            {Object.keys(this.props.transactions).length > 0 ? (
              <tr>
                <th>Method</th>
                <th>Status</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Confirmations</th>
                <th>txHash</th>
              </tr>
            ) : null}
        </thead>

          <tbody>
            {Object.keys(this.props.transactions).length < 1 ? (
              <Text textAlign={"center"} p={3}>
                No transactions yet. Increase or decrease the smart contract value
                to start a transaction.
              </Text>
            ) : (
              Object.keys(this.props.transactions).map((keyName, keyIndex) => {
                let txHash = "";
                if (this.props.transactions[keyName].transactionHash) {
                  txHash = this.props.transactions[
                    keyName
                  ].transactionHash.toString();
                  // const txStart = txHash.substr(0, 7);
                  // const txEnd = txHash.substr(txHash.length - 4);
                  // txHash = txStart + "..." + txEnd;
                }

                let eventCreated = new Date(this.props.transactions[keyName].created);
                let eventUpdated = new Date(this.props.transactions[keyName].lastUpdated);

                return (
                  <tr key={keyIndex}>
                    <td>
                      <code>
                        {this.props.transactions[keyName].method}
                      </code>
                    </td>
                    <td>
                      <Pill>
                        {this.props.transactions[keyName].status}
                      </Pill>
                    </td>
                    <td>
                      {eventCreated.toDateString()}
                    </td>
                    <td>
                      {eventUpdated.toTimeString()}
                    </td>
                    <td>
                      {this.props.transactions[keyName].confirmationCount}
                    </td>
                    <td>
                      <Link href={'//rinkeby.etherscan.io/tx/'+txHash} target='_blank'>
                        {txHash}
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

        </TransactionTable>

      </Card>
    );
  }
}

export default TransactionsCard;
