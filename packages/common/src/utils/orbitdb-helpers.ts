import * as IPFS from 'ipfs'
import Orbit from 'orbit_'

export const IPFSCreate = async (options) => {
    const ipfs = await IPFS.create(options);
    return ipfs;
}

export const OrbitCreate = async (ipfs, options) => {
    const orbit = await Orbit.create(ipfs, options);
    return orbit;
}

