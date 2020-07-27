import React from "react";
import { Card, Heading, Text, Modal, Flex, Box, Button } from "rimble-ui";

class AppModal extends React.Component {
  state = {
    showSecondary: false
  };

  toggleSecondary = e => {
    console.log("showSecondary", this.state.showSecondary);
    e.preventDefault();

    this.setState({
      showSecondary: !this.state.showSecondary
    });
  };

  render() {
    return (
      <Modal isOpen={this.props.isOpen}>
        <Card py={[3, 5]} px={[0, 5]} maxWidth={"960px"} overflow={"hidden"}>
          <Box position={"relative"}>
            <Flex
              justifyContent={"flex-end"}
              mr={[0, -5]}
              mt={[-3, -5]}
              position={"absolute"}
              top={"0"}
              left={"0"}
              right={"0"}
              bg={"white"}
            >
              <Button.Text
                icononly
                icon={"Close"}
                color={"moon-gray"}
                onClick={this.props.closeModal}
              />
            </Flex>
          </Box>

          {this.state.showSecondary === false ? (
            <Box>
              <Box
                style={{ overflow: "auto" }}
                maxHeight={"calc(100vh - 113px)"}
              >
                {/* Modal content */}
                <Box py={[3, 5]} px={[2, 0]}>
                  <Box mb={3}>
                    <Heading.h2>Primary</Heading.h2>
                    <Text my={3}>About primary modal</Text>
                  </Box>

                  <Flex
                    flexWrap={"wrap"}
                    justifyContent={"space-between"}
                    mx={-2}
                    mt={4}
                    mb={4}
                  >
                    <Text>Main Content Area for primary view.</Text>
                  </Flex>
                </Box>
                {/* End Modal Content */}
              </Box>

              <Box
                position={"absolute"}
                bottom={"0"}
                left={"0"}
                right={"0"}
                p={2}
                bg={"white"}
              >
                {/* Start primary footer */}
                <Flex
                  mt={3}
                  justifyContent={["center", "flex-end"]}
                  borderTop={1}
                  borderColor={"#999"}
                >
                  <Button>Primary Action</Button>
                </Flex>
                {/* End primary footer */}
              </Box>
            </Box>
          ) : (
            <Box mb={3}>
              <Box
                style={{ overflow: "auto" }}
                maxHeight={"calc(100vh - 113px)"}
              >
                {/* Start secondary content */}
                <Box py={[3, 5]} px={[2, 0]}>
                  <Heading.h2>Secondary</Heading.h2>
                  <Text my={3}>Secondary description.</Text>

                  <Flex
                    flexWrap={"wrap"}
                    justifyContent={"space-between"}
                    mx={-2}
                    my={3}
                  >
                    <Text>More detailed secondary text.</Text>
                  </Flex>
                </Box>
                {/* End secondary content */}
              </Box>

              <Box
                position={"absolute"}
                bottom={"0"}
                left={"0"}
                right={"0"}
                p={2}
                bg={"white"}
              >
                {/* Start secondary footer */}
                <Flex
                  mt={3}
                  justifyContent={["center", "flex-end"]}
                  borderTop={1}
                  borderColor={"#999"}
                >
                  <Button.Outline
                    width={[1, "auto"]}
                    onClick={this.toggleSecondary}
                  >
                    Go back
                  </Button.Outline>
                </Flex>
                {/* End secondary footer */}
              </Box>
            </Box>
          )}
        </Card>
      </Modal>
    );
  }
}

export default AppModal;
