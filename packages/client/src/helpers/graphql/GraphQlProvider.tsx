import React, { createContext, useEffect, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';

import {
  GET_TOURNAMENT,
  GET_TOURNAMENT_RESULTS
} from './queries'

export const GraphQlContext = createContext({});

export default function GraphQlProvider(props) {
  const [getTournament, tournamentData] = useLazyQuery(GET_TOURNAMENT);
  const [getResults, tournamentResults] = useLazyQuery(GET_TOURNAMENT_RESULTS);

  const getTournamentResults = id => {
    console.log("CALLED");
    return new Promise((resolve, reject) => {
      getResults({ variables: { id } });

      if (!tournamentResults.loading) {
        console.log("RESOLVED");
        const {data} = tournamentResults;
        console.log("THE DATA", data);
        resolve(data);
      }
      if (tournamentResults.error) {
        reject(tournamentResults.error);
      }
    })
  }

  const getTournamentData = id => {
    console.log("CALLED");
    return new Promise((resolve, reject) => {
      getTournament({ variables: { id } });

      if (!tournamentData.loading) {
        console.log("RESOLVED");
        resolve(tournamentData.data);
      }
      if (tournamentData.error) {
        reject(tournamentData.error);
      }
    })
  }

  return (
    <GraphQlContext.Provider value={{
      getTournamentData,
      getTournamentResults
    }}>
      {props.children}
    </GraphQlContext.Provider>
  )
}