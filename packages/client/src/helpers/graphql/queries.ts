import { gql } from '@apollo/client';

export const GET_TOURNAMENT = gql`
  query GetTournament($id: ID!) {
    tournament(id: $id) {
      id
      state
      data
      shares
    }
  }
`

export const GET_TOURNAMENT_RESULTS = gql`
  query GetTournamentResults($id: ID!) {
    getTournamentResults(id: $id) {
      session {
        id
        sessionData {
          sessionId
          gameName
          tournamentId
          playerData
        }
      }
    }
  }
`