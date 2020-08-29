import React, { Component, Fragment } from 'react';
import { drizzleConnect } from "@drizzle/react-plugin";

import { Select, Flex, Button, Card, Box, Pill, Heading, Text } from "rimble-ui";

import RainbowBox from './RainbowBox';
import Tournament from './Tournament';

class CreateTourneyView extends Component<any, any> {

  DEFAULT_CONTRACT = "Tournaments";
  DEFAULT_CONTRACT_METHOD = "createTournament";

  constructor(props) {
    super(props)


    this.state = {     
      selectedContract: this.DEFAULT_CONTRACT,
      selectedMethod: null,
      currentNetwork: null,
      address: null,
      tournamentsCount: 0
    }
  }

  componentDidMount() {
    const { address, networkId, drizzleStatus, drizzle } = this.props

    this.setState(
      {
        selectedContract: drizzle.contractList[0].contractName
      }
    )

    this.updateAddress(address)
    this.updateDrizzle(networkId, drizzleStatus, drizzle)
  }

  componentWillReceiveProps(newProps) {
    const { address, networkId, drizzleStatus, drizzle } = this.props
    const { address: newAddress, networkId: newNetworkId, 
      drizzleStatus: newDrizzleStatus, drizzle: newDrizzle } = newProps

    if (address !== newAddress) {
      this.updateAddress(newAddress)
    }
    if (networkId !== newNetworkId || drizzleStatus !== newDrizzleStatus
      || drizzle !== newDrizzle) {
      this.updateDrizzle(newNetworkId, newDrizzleStatus, newDrizzle)
    }
  }

  updateAddress = (address) => {
    this.setState({ address })
  }

  updateDrizzle = (networkId, drizzleStatus, drizzle) => {
    if (networkId) {
      this.setState({ currentNetwork: networkId} );
    }
    if (!drizzleStatus.initialized && window.web3 && drizzle !== null) {
      window.web3.version.getNetwork((error, networkId) => {
        this.setState({ currentNetwork: parseInt(networkId) } );
      });
    }
    if (drizzleStatus.initialized && window.web3 && drizzle !== null) {
      this.fetchTournaments();
    }
  }

  fetchTournaments = async () => {
    const { drizzle } = this.props

    const contract = drizzle.contracts.Tournaments;
    const tournamentsCount = await contract.methods.getTournamentsCount().call();
    this.setState({
      tournamentsCount,
    })
  }


  onNewTournament = () => {
    this.createTournament()
  }

  createTournament = async () => {
    const { drizzle } = this.props

    const address = this.state.address;
    const contract = drizzle.contracts.Tournaments;

    const timestamp = Date.now() + 10 * 24 * 60 * 60 * 1000
    const data = ''
    const prize = drizzle.web3.utils.toBN(1) // TODO


    this.props.contractMethodSendWrapper(
      "createTournament", // name
      [address, timestamp, data, prize], //contract parameters
      {from: address}, // send parameters
      (txStatus, transaction) => { // callback
      console.log("createTournament callback: ", txStatus, transaction);
      })


    // const receipt = await contract.methods.createTournament(address, timestamp, data, prize)
    //   .send({from: address})

    // const { tournamentId } = receipt.events.TournamentCreated.returnValues

    // // TODO
    // putTournamentData({ id: tournamentId })

    // this.updateTournaments()
  }

  updateTournaments = async () => {
    const { drizzle } = this.props

    const contract = drizzle.contracts.Tournaments;

    const tournamentsCount = await contract.methods.getTournamentsCount().call()
    this.setState({
      tournamentsCount,
    })
  }

  onActivate = (tournament) => {
    this.activateTournament(tournament)
  }

  activateTournament = async (tournament) => {
    const { drizzle } = this.props

    const address = this.state.address;
    const contract = drizzle.contracts.Tournaments;

    await contract.methods.activateTournament(tournament.id, tournament.prize)
      .send({
        from: address,
        value: tournament.prize
      })
    this.updateTournaments()
  }  

  render() {

    /*
    const { drizzle } = this.props
    const { tournamentsCount, contract, ownerView } = this.state
    const { web3, address, contractMethodSendWrapper } = this.props

    const noTournaments = tournamentsCount <= 0

    const allTrnsDivs = []
    for(let i = 0; i < tournamentsCount; i++) {
      allTrnsDivs.push(
        <Tournament
          userAddress={address}
          tournamentId={i}
          contract={drizzle.contracts.Tournaments}
          web3={drizzle.web3}
          onPlay={this.onPlay}
          onActivate={this.onActivate}
          onPlayResult={this.showReplay}
          onDeclareWinner={this.declareWinner}
          showOwn={ownerView}
        />
      )
    }
    return (
      <Fragment>
        <View
          flex={true}
          center={true}
          style={{
            padding: 32,
            flexDirection: 'column',
          }}
        >
          <Fragment>
            <video id="recorded"></video>
          </Fragment>
          <Box
            style={{
              width: 500,
              maxWidth: '100%',
            }}
          >
            { !ownerView && (
              <View
                flex={true}
                style={{
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <Button
                  title="To organizer view"
                  onClick={() => {this.setState({ownerView: true})}}
                  text={'To organizer view'}
                />
              </View>
            )}
            { ownerView && (
              <View
                flex={true}
                style={{
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <Button
                  title="To player view"
                  onClick={() => {this.setState({ownerView: false})}}
                  text={'To player view'}
                />
              </View>
            )}
            { ownerView && (
              <View
                flex={true}
                style={{
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <Button
                  title="Sponsor a tournament"
                  onClick={this.onNewTournament}
                  text={'+ New Tournament'}
                />
              </View>
            )}
            <Space size="xxs" />
            <Separator />
            <Space size="xxs" />
            { noTournaments && (
              <View
                flex={true}
                center={true}
                style={{
                  borderRadius: 8,
                  backgroundColor: '#efefef',
                  color: 'darkgrey',
                  height: 128,
                }}
              >
                {'Active tournaments list here'}
              </View>
            )}
            <>
              <View flex={true} style={{ color: 'darkgrey', height: 32 }}>
                {ownerView && (<SBold>My tournaments</SBold>)}
                {!ownerView && (<SBold>Active tournaments</SBold>)}
              </View>
              <Separator />
              <View flex={true} column={true} >
                { allTrnsDivs }
              </View>
            </>
          </Box>
        </View>
      </Fragment>
    )
*/

  const { drizzle } = this.props
 
  const contractList = drizzle.contractList;

  const contractMethods = drizzle.contracts[this.DEFAULT_CONTRACT].methods;



  const { 
    selectedContract
  } = this.state

  return (
    <Box>
      <Box maxWidth={"1180px"} p={3} mx={"auto"}>
        <Card borderRadius={"15px 15px 15px 15px"} p={0} mx={2} my={2}>
          <RainbowBox
            borderRadius={"15px 15px 0px 0px"}
            height={"10px"}
            borderColor={"#d6d6d6"}
          />

          <Flex alignItems="center">
            <Box ml={3} mt={3} width={1 / 2} style={{ textAlign: "left" }}>
            <Select>

              {
                contractList && contractList.map( (contract) =>
                {
                  const name = contract.contractName;
                  if (name === this.DEFAULT_CONTRACT)
                  {
                    return (
                      <option selected key={name}>{name}</option> 
                       )
                  }
                  else
                  {
                    return (
                    <option key={name}>{name}</option> 
                    )
                  }
                })
              }
            </Select>
            </Box>
            <Box mr={3} mt={3} width={1 / 2} style={{ textAlign: "right" }}>
            <Select>
              {
                contractMethods && 
                Object.keys(contractMethods).map((name) =>
                {

                  if (name === this.DEFAULT_CONTRACT_METHOD)
                  {
                    return (
                      <option selected key={name}>{name}</option> 
                       )
                  }
                  else
                  {
                    return (
                    <option key={name}>{name}</option> 
                    )
                  }
                })
              }
            </Select>
            </Box>
          </Flex>
          
          <Box style={{ textAlign: "center" }}>
            
 

            <Heading.h1 mb={3} textAlign="center">
              Don't rely on wallet UX
            </Heading.h1>
            <Text fontSize="5" textAlign="center">
              • Wallets can't be specific
            </Text>
            <Text fontSize="5" textAlign="center">
              • It's not in their remit to make your dApp usable
            </Text>
            <Text fontSize="5" textAlign="center">
              • Your messaging can speak to the task at hand
            </Text>
            <Text fontSize="5" textAlign="center">
              • Phrase your communication around what the user is doing
            </Text>
          </Box>
          <Box my={4} style={{ textAlign: "center" }}>
            <Button size={"medium"} mr={3} mb={3} 
              onClick={() => {
                // setRoute("Lesson2");
              }}
            >
              Show transaction confirmation
            </Button>
            <Button
              size={"medium"}
              mr={3}
              mb={3}
              onClick={() => {
                // setRoute("Lesson2");
              }}
            >
              Show transaction sending
            </Button>
            <Button
              size={"medium"}
              mr={3}
              mb={3}
              onClick={() => {
                // setRoute("Lesson2");
              }}
            >
              Show No ETH warning
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>    
  )
  }
}

/*
 * Export connected component.
 */
const mapStateToProps = state => {
  return {
    drizzleStatus: state.drizzleStatus,
    address: state.accounts[0],
    networkId: state.web3.networkId
  };
};

export default drizzleConnect(CreateTourneyView, mapStateToProps);
