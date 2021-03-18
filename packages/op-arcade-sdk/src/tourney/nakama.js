import CONSTANTS from '../constants.js'
import * as nakamajs from '@heroiclabs/nakama-js';

// const axios = require('axios')
import axios from 'axios'

const TEST_ID = "test_id"

const getTourneyProvider = async (options, auth_provider) => {

    let provider = new NakamaTourneyProvider(auth_provider);

    if (provider != null) {

        console.log('%c%s',
            'color: blue; background: white;',
            "Nakama Tourney Provider : --- "
            + options.url + ":" + options.port + " ---"
        )

        return provider;
    }

    console.error("unable to initialize SDK")
    return null;
}

class NakamaTourneyProvider {

    authProvider = null;
    client = null;
    session = null;
    tournamentId = null;

    constructor(auth_provider) {
        this.authProvider = auth_provider;
    }

    refreshSession = async () => {
        this.authProvider.refreshSession();
        this.client = this.authProvider.client;
        this.session = this.authProvider.session;
    }

    getTourney = async (options) => {

        try {
            await this.refreshSession();

            let tourneyInfo = await this.client.apiClient.listLeaderboardRecords(
                this.session,
                options.tourney_id);

            return tourneyInfo;

        } catch (e) {
            console.error("getTourney failed [" + e.status + ":" + e.statusText + "]");
            return (e);
        }
    }

    attemptTourney = async (options) => {

        try {

            await this.refreshSession();

            let socket = await this.client.createSocket(false, false);
            let socketSession = await socket.connect(this.session, false);

            let response = await socket.createMatch()

            console.log(response)

            return response;

        } catch (e) {
            console.error("attemptTourney failed [" + e.status + ":" + e.statusText + "]");
            return (e);
        }
    }

    postScore = async (options) => {
        await this.refreshSession();
        try {
            const args = {
                tournament_id: options.tournament_id,
                metadata: JSON.parse(options.metadata)
            }
    
            const config = {
                headers: {
                    Authorization: `Bearer ${this.session.token}`,
                    'Content-Type': 'application/json'
                }
            }
    
            const dev = 'http://127.0.0.1:3001/oparcade/api/tournaments/post-score'
            const prod = 'http://op-arcade-dev.herokuapp.com/oparcade/api/tournaments/post-score'
            const isDevelopment = false
            const requestURL = isDevelopment ? dev : prod
            const res = await axios.post(requestURL, args, config)
            return res
        } catch (e) {
            console.error("postScore failed [" + e.status + ":" + e.statusText + "]");
            return (e);
        }
    }

    joinTourney = async (options) => {

        try {
            await this.refreshSession();

            let tourneyInfo = await this.client.joinTournament(
                this.session,
                options.tournament_id);

            return tourneyInfo;

        } catch (e) {
            console.error("joinTourney failed [" + e.status + ":" + e.statusText + "]");
            return (e);
        }
    }

    saveTournamentId = (options) => {
        this.tournamentId = options.tournamentId;
    }

    getTournamentId = () => {
        return this.tournamentId;
    }
}

export {
    getTourneyProvider
};