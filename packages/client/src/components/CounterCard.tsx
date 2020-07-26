import React from "react";
import { Card, Button, Flex, Box, Text } from "rimble-ui";
import { ContractForm } from "@drizzle/react-components";
import EthToFiat from "./../core/utilities/components/EthToFiat";

function CounterCard({
  token,
  drizzle,
  drizzleState,
  address,
  preflightCheck,
  enableBuyButton
}) {
  return (
      <Card p={0} borderColor={"#d6d6d6"}>
          {/* Use drizzle's ContractForm component, with custom renderprop for styling. This way we can get contract events from the redux store */}
          {drizzleState && enableBuyButton ? (
            <ContractForm
              contract={token.id}
              method="incrementCounter"
              drizzle={drizzle}
              drizzleState={drizzleState}
              render={({ handleInputChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <Button
                    width={[1]}
                    mt={"26px"}
                    mb={2}
                    type={"text"} // manually set properties on the button so that the handleInputChange and handleSubmit still work properly
                    name={"recepient"} // set the name to the method's argument key
                    onClick={e => {
                      e.target.value = drizzleState.accounts[0]; // set the recepient contract argument after drizzleState is available

                      // This function will get ran once all preflight checks pass
                      const callback = e => {
                        handleInputChange(e);
                      };

                      // Pass the event into the preflight check so that it can be passed again into the callback
                      const event = e;

                      // Passing to intercepting function to make sure network and balance will allow tx to happen
                      preflightCheck({
                        token,
                        drizzle,
                        address: drizzleState.accounts[0],
                        callback,
                        event
                      });
                    }}
                  >
                    Increment Counter
                  </Button>
                </form>
              )}
            />
          ) : (
            <Button
              mt={"26px"}
              mb={2}
              type={"text"} // manually set properties on the button so that the handleInputChange and handleSubmit still work properly
              name={"recepient"} // set the name to the method's argument key
            >
              Button Not Found
            </Button>
          )}
      </Card>
  );
}

export default CounterCard;