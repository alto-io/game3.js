import React, { Component, Fragment } from 'react';
import { drizzleConnect } from "@drizzle/react-plugin";

import {
  Select, Flex, Button, Card, Field, Input,
  Box, Pill, Heading, Text, Form
} from "rimble-ui";

import RainbowBox from './RainbowBox';
import Tournament from './Tournament';

import web3 from 'web3';

import Datetime from 'react-datetime';
import '../react-datetime.css';

import { Constants } from '@game3js/common';

import { newTournament, updateTournament, getTourneyWinners } from '../helpers/database'

class CreateTourneyView extends Component<any, any> {

  DEFAULT_CONTRACT = "Tournaments";
  DEFAULT_CONTRACT_METHOD = "createTournament";

  constructor(props) {
    super(props)


    this.state = {
      selectedContract: this.DEFAULT_CONTRACT,
      selectedMethod: this.DEFAULT_CONTRACT_METHOD,
      payableAmount: null,
      payable: false,
      view: false,
      contractOutput: "",
      contractInputs: [],
      currentNetwork: null,
      address: null,
      tournamentsCount: 0,
      updater: false,
      selectedGame: "",
      selectedStage: "Tourney"
    }
  }

  async componentDidMount() {
    const { address, networkId, drizzleStatus, drizzle } = this.props

    this.updateAddress(address)
    this.updateDrizzle(networkId, drizzleStatus, drizzle)

    this.storeInputsToState(this.DEFAULT_CONTRACT, this.DEFAULT_CONTRACT_METHOD);

    // Listen when tournament is created so we can add the id to the db
    await drizzle.contracts.Tournaments.events.TournamentCreated().on('data', async (event) => {
      let tId = event.returnValues.tournamentId;
      const raw = await drizzle.contracts.Tournaments.methods.getTournament(tId).call();
      const shares = await drizzle.contracts.Tournaments.methods.getShares(tId).call();

      const tournament = {
        id: tId,
        endTime: raw['1'],
        state: raw['3'],
        pool: raw['4'],
        data: raw['5'],
        shares
      }
      console.log("TID PUT TO DB", tournament);
      await newTournament(tournament);
    });

    // Listen when tournament is activated
    await drizzle.contracts.Tournaments.events.TournamentActivated().on('data', async (event) => {
      let tId = event.returnValues.tournamentId;
      const raw = await drizzle.contracts.Tournaments.methods.getTournament(tId).call();

      const updatedTournament = {
        state: raw['3'],
        pool: raw['4']
      }
      console.log("TID UPDATE TO DB", tId);
      await updateTournament(tId, updatedTournament);
    });

    // Listen to a new tournament BuyIn
    await drizzle.contracts.Tournaments.events.TournamentNewBuyIn().on('data', async (event) => {
      let tId = event.returnValues.tournamentId;
      const raw = await drizzle.contracts.Tournaments.methods.getTournament(tId).call();

      const updatedTournament = {
        pool: raw['4']
      }
      console.log("TID UPDATE TO DB", tId);
      await updateTournament(tId, updatedTournament);
    });
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
      this.setState({ currentNetwork: networkId });
    }
    if (!drizzleStatus.initialized && window.web3 && drizzle !== null) {
      window.web3.version.getNetwork((error, networkId) => {
        this.setState({ currentNetwork: parseInt(networkId) });
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
    const shares = [2, 3, 5];
    const buyInAmount = 1;
    const triesPerBuyin = 1;

    this.props.contractMethodSendWrapper(
      "createTournament", // name
      [address, timestamp, data, prize, shares, buyInAmount, triesPerBuyin], //contract parameters
      { from: address }, // send parameters
      (txStatus, transaction) => { // callback
        console.log("createTournament callback: ", txStatus, transaction);
      })

    // const receipt = await contract.methods.createTournament(address, timestamp, data, prize, shares, buyInAmount, triesPerBuyin)
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

  changeSelectedContract = (event) => {
    this.setState({
      selectedContract: event.target.value,
      contractInputs: [],
    });

    this.storeInputsToState(event.target.value, null);
    this.forceUpdate();
  }

  changeSelectedMethod = (event) => {
    this.setState({
      selectedMethod: event.target.value,
      contractInputs: [],
    });

    this.storeInputsToState(null, event.target.value);
    this.forceUpdate();
  }

  applyConversions = (param) => {
    let value = param.value;

    switch (param.name) {
      case "prize":
      case "buyInAmount":
      case "value":
        value = web3.utils.toWei(param.value.toString(), 'ether');
        break;
      default:

        break;
    }

    return value;
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    const { drizzle } = this.props
    const {
      selectedContract, selectedMethod, contractInputs
    } = this.state


    //   const data = new FormData(e.target);

    //   for(var pair of data.entries()) {
    //     console.log(pair[0]+ ', '+ pair[1]); 
    //  }
    //  console.log(this.state.contractInputs);

    let contractParams = []

    contractInputs.map((param) => {
      switch (param.type) {
        // TODO: can refactor this to just parse [] and make it an array?
        case 'address[]':
          console.log("VALUE", param.value);
          console.log("TYPE OF VALUE", typeof param.value);
          let addressArr = typeof param.value === 'object' ? param.value : param.value.split(',');
          contractParams.push(addressArr);
          break;
        case 'uint256[]':
          let arr = param.value.split(',');
          contractParams.push(arr);
          break;
        default:
          // TODO: refactor to support other contracts aside from Tournament
          let value = this.applyConversions(param);
          contractParams.push(value);
          break;
      }



    })

    console.log(contractParams);

    let sendParams = {
      from: this.props.address
    }

    if (this.state.payable) {
      sendParams["value"] = web3.utils.toWei(this.state.payableAmount.toString(), "ether");
    }

    if (this.state.view) {
      const output = await (await drizzle.contracts[selectedContract].methods[selectedMethod].call()).call(); //double call: weird
      this.setState(
        {
          contractOutput: output
        }
      )
    }


    else {
      this.props.contractMethodSendWrapper(
        selectedMethod, // name
        contractParams,
        sendParams, // send parameters
        this.handleTransactionCallback
      )
    }
  };

  handleTransactionCallback = (txStatus, transaction) => {
    const outputLog = "status: " + txStatus + " ---- \n"
      + "hash: " + transaction.transactionHash + " ---- \n"
      + JSON.stringify(transaction, null, 2);

    this.setState(
      {
        contractOutput: outputLog
      }
    )
  }

  handleInputChange = (e) => {
    const index = e.target.id.split('.')[0];
    const name = e.target.id.split('.')[1];

    let currentInputs = this.state.contractInputs;
    let value = e.target.value;

    // special case for data
    if (name === "selectedGame" || name === "selectedStage")
    {
      let bufferedValue = value;
      if (name === "selectedGame")
      {
        this.setState({selectedGame: value})
        value = bufferedValue + "," + this.state.selectedStage;
      }
      else 
      {
        this.setState({selectedStage: value})
        value = this.state.selectedGame + "," + bufferedValue;
      }
    }

    currentInputs[index].value = value;


    this.setState({
      contractInputs: currentInputs
    })

  }

  handlePayableAmountChange = (e) => {
    this.setState({
      payableAmount: e.target.value
    })

  }


  // TODO: special case for endTime, can this be abstracted?
  handleDatetimeChange = (momentObj) => {
    const index = [1]; // e.target.id.split('.')[0];  
    let currentInputs = this.state.contractInputs;
    currentInputs[index].value = momentObj.format('x');

    this.setState({
      contractInputs: currentInputs
    })

  }

  validateInput = (e) => {
    const id = e.target.id;
    const type = id.split('(')[1].split(')')[0];
    const value = e.target.value;
    const colorValid = "#28C081";
    const colorInvalid = "#DC2C10";

    switch (type) {
      case 'address':
        e.target.valid = web3.utils.isAddress(value);
        e.target.style['border-color'] = e.target.valid ? colorValid : colorInvalid;
        break;
    }

  }


  renderDatetimeInput = (props) => {
    return (
      <Input {...props} />
    )
  }

  storeInputsToState = (newContract, newMethod) => {

    const { drizzle } = this.props

    let storedContract = newContract;
    let storedMethod = newMethod;

    const {
      selectedContract, selectedMethod, updater
    } = this.state

    if (storedContract === null) storedContract = selectedContract;
    if (storedMethod === null) storedMethod = selectedMethod;


    const contractAbi = drizzle.contracts[storedContract].abi;

    const contractMethodArray = contractAbi.filter(obj => {
      return obj.name === storedMethod
    });

    let abiInputs = null;
    let isPayable;
    let isView;

    if (contractMethodArray.length > 0) {
      abiInputs = contractMethodArray[0].inputs;
      isPayable = contractMethodArray[0].payable;
      if (contractMethodArray[0].stateMutability) {
        isView = contractMethodArray[0].stateMutability === "view";
      }
    }

    let inputs = []

    abiInputs.map((input) => {
      let newInput =
      {
        name: input.name,
        type: input.type,
        value: input.value,
        placeholder: ''
      }
      switch (input.name) {
        case "organizer":
          newInput.value = this.props.address;
          break;
        case "endTime":
          newInput.value = Date.now() + 10 * 24 * 60 * 60 * 1000;
          break;
        case "uintParams":
          newInput.placeholder = "prize,buyInAmt,maxTries";
          break;
        default:
          newInput.value = input.value;
          break;

      }

      inputs.push(newInput);
    })

    this.setState({
      contractInputs: inputs,
      contractOutput: null,
      payable: isPayable,
      view: isView
    });
  }

  populatePlayerIds = async(e) => {
    e.preventDefault();
    const {contractInputs} = this.state;

    let winners = await getTourneyWinners(parseInt(contractInputs[0].value));

    console.log("WINNERS ARRAY", winners);

    contractInputs.forEach((input, idx) => {
      switch(input.name) {
        case "playerIds":
          contractInputs[idx].value = winners;
          break;
        default:
          break;
      }

    console.log("CONTRACT INPUT", contractInputs);


      this.setState({
        contractInputs
      })
    })
  }

  render() {

    const { drizzle } = this.props

    const {
      selectedContract, selectedMethod, contractInputs, contractOutput
    } = this.state

    const contractList = drizzle.contractList;
    const contractAbi = drizzle.contracts[selectedContract].abi;

    console.log(contractInputs)

    return (
      <Form onSubmit={this.handleSubmit}>
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
                  <Select id="selectedContract" name="selectedContract"
                    onChange={this.changeSelectedContract}
                    value={selectedContract}>

                    {
                      contractList && contractList.map((contract) => {
                        return (
                          <option key={contract.address}>{contract.contractName}</option>
                        )
                      })
                    }
                  </Select>
                </Box>
                <Box mr={3} mt={3} width={1 / 2} style={{ textAlign: "right" }}>
                  <Select id="selectedMethod" name="selectedMethod"
                    onChange={this.changeSelectedMethod}
                    value={selectedMethod}>
                    >
                  {
                      contractAbi && contractAbi.map((abi) => {
                        return (
                          <option key={abi.signature}>{abi.name}</option>
                        )
                      })
                    }
                  </Select>
                </Box>
              </Flex>

              <Box style={{ textAlign: "center" }}>

                {
                  contractInputs && contractInputs.map((input, index) => {

                    switch (input.name) {

                      // Tourney special cases
                      case "data":
                        return (
                          <>
                            <Field
                              size={"medium"}
                              mt={3} mr={3} mb={3}
                              label={"Select Game"}>
                              {
                                <Select required id={index + "." + "selectedGame"}
                                  name={"selectedGame"}
                                  onChange={this.handleInputChange}
                                  options={Constants.GAME_ID_ARRAY}
                                />
                              }
                            </Field>
                            <Field
                              size={"medium"}
                              mt={3} mr={3} mb={3}
                              label={"Select Stage"}>
                              {
                                <Select required id={index + "." + "selectedStage"}
                                  name={"selectedStage"}
                                  onChange={this.handleInputChange}
                                  options={Constants.WOM_COUNTRIES_ARRAY}
                                />
                              }
                            </Field>
                          </>
                        )
                        break;
                        
                      case "endTime":
                        return (
                          <Field
                            size={"medium"}
                            mt={3} mr={3} mb={3}
                            label={input.name + " (" + input.type + ")"}>
                            {
                              <Datetime id={index + "." + input.name + " (" + input.type + ")"}
                                name={input.name}
                                required={true}
                                onChange={this.handleDatetimeChange}
                                renderInput={this.renderDatetimeInput}
                                value={this.state.contractInputs[index].value}
                              />
                            }
                          </Field>
                        );
                        break;

                      case "organizer":
                        return (
                          <Field
                            size={"medium"}
                            mt={3} mr={3} mb={3}
                            label={input.name + " (" + input.type + ")"}>
                            {
                              <Input id={index + "." + input.name + " (" + input.type + ")"}
                                name={input.name}
                                required={true}
                                onChange={this.handleInputChange}
                                value={this.state.contractInputs[index].value}
                              />
                            }
                          </Field>
                        );
                        break;
                      case "playerIds":
                        return (
                          <>
                            <Field
                              size={"medium"}
                              mt={3} mr={3} mb={3}
                              label={input.name + " (" + input.type + ")"}>
                              {
                                <Input id={index + "." + input.name + " (" + input.type + ")"}
                                  name={input.name}
                                  onChange={this.handleInputChange}
                                  value={this.state.contractInputs[index].value}
                                />
                              }
                            </Field>
                            <Field
                              size={"medium"}
                              mt={3} mr={3} mb={3}
                            >
                              {
                                <Button size={"medium"} mr={3} mb={3} onClick={this.populatePlayerIds}>
                                  Get Winners From DB
                                </Button>
                              }
                            </Field>
                          </>
                        )
                        break;

                      default:
                        return (
                          <Field
                            size={"medium"}
                            mt={3} mr={3} mb={3}
                            label={input.name + " (" + input.type + ")"}>
                            {
                              <Input id={index + "." + input.name + " (" + input.type + ")"}
                                name={input.name}
                                required={true}
                                onChange={this.handleInputChange}
                                value={this.state.contractInputs[index].value}
                                placeholder={this.state.contractInputs[index].placeholder}
                              />
                            }
                          </Field>
                        );
                        break;
                    }
                  })
                }
              </Box>

              <Box my={4} style={{ textAlign: "center" }}>
                <Button size={"medium"} mr={3} mb={3}>
                  Call Contract Method
                </Button>
                {
                  this.state.payable &&
                  <Input id={"payableAmount"}
                    name={"payableAmount"}
                    onChange={this.handlePayableAmountChange}
                    placeholder="ETH payable"
                    value={this.state.payableAmount}
                  />
                }
              </Box>

              <Box
                mt={3} mb={3}
                style={{ textAlign: "center" }}>
                <Card>
                  <Pill>{"Output"}</Pill>
                  <Text fontSize="2" textAlign="center">
                    {contractOutput}
                  </Text>
                </Card>
              </Box>



            </Card>
          </Box>
        </Box>
      </Form>
    )
  }
}

/*
 * Export connected component.
 */
const mapStateToProps = state => {
  console.log("state", state);
  return {
    drizzleStatus: state.drizzleStatus,
    address: state.accounts[0],
    networkId: state.web3.networkId
  };
};

export default drizzleConnect(CreateTourneyView, mapStateToProps);



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
