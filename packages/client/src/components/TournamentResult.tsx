import * as React from 'react'

import { View, Button } from '../components'

const TournamentResult = (props: any) => {
  const { result, onPlayResult, onDeclareWinner, canDeclareWinner } = props
  const { tournamentId, resultId, isWinner, playerAddress, fileHash } = result
  return (
      <View
        flex={true}
        column={true}
        style={{
          borderRadius: 4,
          backgroundColor: '#efefef',
          marginTop: '5px',
          marginBottom: '5px',
          padding: '10px'
        }}>
          <View flex={true}>Player: {playerAddress}</View>
          <View flex={true} style={{width: '100%'}}>
           <View flex={true}>Replay: </View>
           <View flex={true} style={{ flexGrow: 1 }} ><div/></View>
           <View flex={true}>
            <Button
              title="Watch replay"
              onClick={() => {onPlayResult(fileHash)}}
              text={'Watch'}
            />
          </View>
          {!isWinner && canDeclareWinner && (
            <View flex={true}>
              <Button
                title="Declare winner"
                onClick={() => {onDeclareWinner(tournamentId, resultId)}}
                text={'Declare winner'}
              />
            </View>
          )}
          </View>
      </View>
  )
}

export default TournamentResult
