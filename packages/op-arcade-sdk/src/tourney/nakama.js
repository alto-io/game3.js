import CONSTANTS from '../constants.js'
import * as nakamajs from '@heroiclabs/nakama-js';

const TEST_ID = "test_id"

const getTourneyProvider = async (options, auth_provider) => {

    let provider = new NakamaTourneyProvider(auth_provider);

    if (provider != null)
    {

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
            return(e);
         }
    }    

    attemptTourney = async (options) => {

        try {

            await this.refreshSession();

            let socket = await this.client.createSocket(false, false);
            let socketSession = await  socket.connect(this.session, false);

            let response = await socket.createMatch()

            console.log(response)

            return response;

        } catch (e) {
            console.error("attemptTourney failed [" + e.status + ":" + e.statusText + "]"); 
            return(e);
         }
    }    

    postScore = async (options) => {

        try {

            await this.refreshSession();

            let result = await this.client.rpc(
                this.session,
                "clientrpc.post_tourney_score",
                options);

            return result.payload;

        } catch (e) {
            console.error("postScore failed [" + e.status + ":" + e.statusText + "]"); 
            return(e);
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
            return(e);
         }
    }        

}

export {
    getTourneyProvider
};