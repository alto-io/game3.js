import seedrandom from 'seedrandom'

//TODO:
// - record and replicate mouse event per-element
// - handle situation when handlers were added/removed while game is in progress

// events
const AnimationFrameEvt = 1
const MouseDownEvt = 2
const MouseUpEvt = 3
const MouseMoveEvt = 4
const RandomSeedEvt = 5
const SetViewportEvt = 6

// modes
export const idleMode = 1
export const playingMode = 2
export const replicatingMode = 3

const wsOpenState = 1

// TODO: unhardcode
//const wsServerUrl = 'ws://localhost:3005?sessionId=optesting'

class RemotePlayState {
    constructor() {
        this.log = []

        this.sessionId = null
        this.ws = null

        this.seedrandom = null
        this.mode = idleMode

        this.replicationHandlers = new Map()

        this.mouseDownHandlers = new Map()
        this.mouseUpHandlers = new Map()
        this.mouseMoveHandlers = new Map()

        this.gameInitFunction = null
        this.gameReady = false
    }

    initSession = (serverUrl, sessionId) => {
        console.log(`OP Arcade init session: ${sessionId}`)
        this.sessionId = sessionId
        //ws://localhost:3005
        const wsServerUrl = `ws://${serverUrl}?sessionId=${this.sessionId}`
        this.ws = new WebSocket(wsServerUrl)
        this.ws.onopen = (event) => {
            console.log('WebSocket open:')
            console.log(event)
        }
        this.ws.onerror = (event) => {
            console.error('WebSocket error')
            console.error(event)
        }
        this.serverSendQueue()
        if (this.gameInitFunction) {
            console.log(`OP Arcade calling init game function.`)
            this.gameInitFunction()
        }
    }

    closeSession = () => {
        this.mode = idleMode
        this.ws.close()
    }

    initGame = (initFunction) => {
        console.log(`OP Arcade init game.`)
        this.gameInitFunction = initFunction
        if (this.sessionId) {
            console.log(`OP Arcade calling init game function.`)
            this.gameInitFunction()
        }
    }

    serverSendQueue = () => {
        requestAnimationFrame(this.serverSendQueue)
        if (!this.ws || this.ws.readyState !== wsOpenState) {
            return
        }
        if (this.ws && this.log.length > 0) {
            this.ws.send(JSON.stringify(this.log))
            this.log.length = 0
        }
    }

    replicate = async (evt) => {
        const type = evt.e
        const handler = this.replicationHandlers.get(type)
        if (type !== RandomSeedEvt && !handler) {
            console.error(`Handler for event ${type} not found!`)
            return
        }
        switch(type) {
            case RandomSeedEvt:
                this.initSeedrandom(evt.s)
                break
            case AnimationFrameEvt:
                handler(evt.t)
                break
            case MouseDownEvt: 
            case MouseUpEvt: 
            case MouseMoveEvt:
                handler({
                    clientX: evt.clientX,
                    clientY: evt.clientY,
                })
                break
            default:
                break
        }
    }

    startReplicating = () => {
        this.mode = replicatingMode
    }

    startPlay = (width, height) => {
        if (this.mode !== idleMode) {
            return
        }
        this.mode = playingMode
        this.setViewport(width, height)
        this.initSeedrandom()
    }

    stopPlay = () => {
        if (this.mode !== playingMode) {
            return
        }
        this.mode = idleMode
        this.log = []

        // TODO:
        this.closeSession()
    }

    sendEvent = (type, data) => {
        if (this.mode !== playingMode) {
            return
        }
        const evt = {
            e: type,
            ...data,
        }
        if (!evt.t) {
            evt.t = window.performance.now()
        }
        this.log.push(evt)
    }

    setViewport = (width, height) => {
        this.sendEvent(SetViewportEvt, {
            w: width,
            h: height,
        })
    }

    initSeedrandom = (seed) => {
        const useSeed = seed || Math.random().toString()
        this.seedrandom = new seedrandom(useSeed)
        this.sendEvent(RandomSeedEvt, {
            s: useSeed
        })
    }

    random = () => {
        // assuming random is always initialized first
        return this.seedrandom()
    }

    requestAnimationFrame = (handler) => {
        if (this.mode === replicatingMode) {
            this.replicationHandlers.set(AnimationFrameEvt, handler)
            return
        }
        return window.requestAnimationFrame((timestamp) => {
            this.sendEvent(AnimationFrameEvt, {
                t: timestamp
            })
            handler(timestamp)
        })
    }

    addOnMouseDown = (element, handler) => {
        if (this.mode === replicatingMode) {
            this.replicationHandlers.set(MouseDownEvt, handler)
            return
        }
        const wrappedHandler = (e) => {
            this.sendEvent(MouseDownEvt, {
                clientX: e.clientX,
                clientY: e.clientY,
            })
            handler(e)
        }
        element.onmousedown = wrappedHandler
        this.addPerElementHandler(this.mouseDownHandlers, element, wrappedHandler)
    }

    addOnMouseUp = (element, handler) => {
        if (this.mode === replicatingMode) {
            this.replicationHandlers.set(MouseUpEvt, handler)
            return
        }
        const wrappedHandler = (e) => {
            this.sendEvent(MouseUpEvt, {
                clientX: e.clientX,
                clientY: e.clientY,
            })
            handler(e)
        }
        element.onmouseup = wrappedHandler
        this.addPerElementHandler(this.mouseUpHandlers, element, wrappedHandler)
    }

    addOnMouseMove = (element, handler) => {
        console.log('addOnMouseMove')
        if (this.mode === replicatingMode) {
            this.replicationHandlers.set(MouseMoveEvt, handler)
            return
        }
        const wrappedHandler = (e) => {
            this.sendEvent(MouseMoveEvt, {
                clientX: e.clientX,
                clientY: e.clientY,
            })
            handler(e)
        }
        element.onmousemove = wrappedHandler
        this.addPerElementHandler(this.mouseMoveHandlers, element, wrappedHandler)
    }

    addPerElementHandler = (map, element, handler) => {
        let existing = map.get(element)
        if (!existing) {
            existing = []
        }
        existing.push(handler)
        map.set(element, existing)
    }
}

const remotePlay = new RemotePlayState()

export const initSession = (serverUrl, sessionId) => remotePlay.initSession(serverUrl, sessionId)

export const initGame = (initFunction) => remotePlay.initGame(initFunction)

export const startPlay = (width, height) => remotePlay.startPlay(width, height)

export const stopPlay = () => remotePlay.stopPlay()

export const startReplicating = () => remotePlay.startReplicating()

export const replicate = (events) => remotePlay.replicate(events)

export const random = () => remotePlay.random()

export const requestAnimationFrame = (handler) => remotePlay.requestAnimationFrame(handler)

export const addOnMouseDown = (element, handler) => remotePlay.addOnMouseDown(element, handler)

export const removeOnMouseDown = (element, handler) => {}

export const addOnMouseUp = (element, handler) => remotePlay.addOnMouseUp(element, handler)

export const removeOnMouseUp = (element, handler) => {}

export const addOnMouseMove = (element, handler) => remotePlay.addOnMouseMove(element, handler)

export const removeOnMouseMove = (element, handler) => {}

export const addOnClick = (element, handler) => {}

export const removeOnClick = (element, handler) => {}

export const addOnKeydown = (element, handler) => {}

export const removeOnKeyup = (element, handler) => {}