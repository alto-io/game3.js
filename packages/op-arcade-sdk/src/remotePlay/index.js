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
const StartPlayEvt = 7
const ListenerEvt = 8
const PassiveEvt = 9
const ClickEvt = 10

// events replicated "globally" through puppeteer
const GlobalMouseDownEvt = 11
const GlobalMouseUpEvt = 12
const GlobalMouseMoveEvt = 13

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
        this.randomseed = null
        this.randomSeedCallback = null

        this.mode = idleMode

        // TODO: currently only one handler is supported
        this.replicationHandlers = new Map()
        // object => (string => func)
        this.replicationEventListeners = new Map()

        // TODO: these intended to use for handler removal (not implemented yet)
        this.clickHandlers = new Map()
        this.mouseDownHandlers = new Map()
        this.mouseUpHandlers = new Map()
        this.mouseMoveHandlers = new Map()

        this.gameInitFunction = null
        this.gameReady = false

        this.lastClientNow = 0.0
        this.lastClientNowUpdateTime = 0.0

        // Map for fired passive events: string => { bool, bool } (evtId => { client fired, server fired }
        this.passiveEventRegistry = new Map()
        this.replicationPaused = false
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
            this.ws.onmessage = (event) => {
                console.log('WebSocket message:')
                console.log(event.data)
                if (event.data === 'scoreSubmitted') {
                    this.refreshPage()
                }
            }
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

    initGame = (initFunction = null) => {
        console.log(`OP Arcade init game.`)
        this.gameInitFunction = initFunction
        if (this.sessionId) {
            console.log(`OP Arcade calling init game function.`)
            this.gameInitFunction()
        }
    }

    postScore = async (options) => {
        if (window.postScoreHandler) {
            return await window.postScoreHandler(options)
        }
        return null
    }

    serverSendQueue = () => {
        window.requestAnimationFrame(this.serverSendQueue)
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

        if (type === PassiveEvt) {
            remotePlay.catchPassiveEvent(evt.id, true)
            return true
        }

        if (this.replicationPaused) {
            return false
        }

        if (evt.t) {
            this.lastClientNow = evt.t
            this.lastClientNowUpdateTime = window.performance.now()
        }

        let simpleHandler = null
        const needsSimpleHandler = [AnimationFrameEvt, MouseDownEvt, MouseUpEvt, MouseMoveEvt, ClickEvt]
            .includes(type)
        if (needsSimpleHandler) {
            simpleHandler = this.replicationHandlers.get(type)
            if (!simpleHandler) {
                //console.error(`Handler for event ${type} not found!`)
                return true
            }
        }

        let listenerHandler = null
        if (type === ListenerEvt) {
            listenerHandler = this.findReplicationListenerHandler(evt)
            if (!listenerHandler) {
                console.error(`Handler for event ${type} not found!`)
                return true
            }
        }

        switch(type) {
            case RandomSeedEvt:
                this.initSeedrandom(evt.s)
                break
            case AnimationFrameEvt:
                simpleHandler(evt.t)
                break
            case ClickEvt:
            case MouseDownEvt:
            case MouseUpEvt:
            case MouseMoveEvt:
                simpleHandler({
                    clientX: evt.clientX,
                    clientY: evt.clientY,
                    pageX: evt.pageX,
                    pageY: evt.pageY,
                })
                break
            case ListenerEvt:
                const e = {
                    target: document.getElementById(evt.tid),
                    type: evt.type,
                    keyCode: evt.kc,
                    preventDefault: () => {},
                    pageX: evt.px,
                    pageY: evt.py,
                    timeStamp: evt.ts,
                    ctrlKey: evt.ck,
                    button: evt.b,
                    movementX: evt.mx,
                    movementY: evt.my,
                }
                listenerHandler(e)
                break
            default:
                break
        }
        return true
    }

    startReplicating = () => {
        this.mode = replicatingMode
    }

    startPlay = (width, height) => {
        if (this.mode !== idleMode) {
            console.log(`[Op SDK]: start play ignored, current mode: ${this.mode}`)
            return
        }
        this.mode = playingMode
        this.sendEvent(StartPlayEvt, {
            w: width,
            h: height,
        })
        this.initSeedrandom()
    }

    stopPlay = () => {
        if (this.mode !== playingMode) {
            return
        }
        this.mode = idleMode
        this.log = []

        // TODO:
        // this.closeSession()
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
        console.log('[Op SDK] initSeedrandom.')
        this.randomseed = seed || Math.random().toString()
        this.seedrandom = new seedrandom(this.randomseed)
        if (this.randomSeedCallback) {
            this.randomSeedCallback(this.randomseed)
        }
        this.sendEvent(RandomSeedEvt, {
            s: this.randomseed
        })
    }

    random = () => {
        if (!this.seedrandom) {
            console.error('[Op SDK] seedrandom is called before initialization.')
            return 0.5
        }
        return this.seedrandom()
    }

    requestAnimationFrame = (handler) => {
        if (this.mode === replicatingMode) {
            this.replicationHandlers.set(AnimationFrameEvt, handler)
            return
        }
        if (this.mode === playingMode) {
            return window.requestAnimationFrame((timestamp) => {
                this.sendEvent(AnimationFrameEvt, {
                    t: timestamp,
                })
                handler(timestamp)
            })
        }
    }

    addOnClick = (element, handler) => {
        if (this.mode === replicatingMode) {
            this.replicationHandlers.set(ClickEvt, handler)
            return
        }
        const wrappedHandler = (e) => {
            this.sendEvent(ClickEvt, {
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
            })
            handler(e)
        }
        element.onclick = wrappedHandler
        this.addPerElementHandler(this.clickHandlers, element, wrappedHandler)
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
                pageX: e.pageX,
                pageY: e.pageY,
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
                pageX: e.pageX,
                pageY: e.pageY,
            })
            handler(e)
        }
        element.onmouseup = wrappedHandler
        this.addPerElementHandler(this.mouseUpHandlers, element, wrappedHandler)
    }

    addOnMouseMove = (element, handler) => {
        if (this.mode === replicatingMode) {
            this.replicationHandlers.set(MouseMoveEvt, handler)
            return
        }
        const wrappedHandler = (e) => {
            this.sendEvent(MouseMoveEvt, {
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
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

    addEventListener = (object, eventName, handler) => {
        if (this.mode === replicatingMode) {
            this.saveReplicationListenerHandler(object, eventName, handler)
            return
        }
        const wrappedHandler = (e) => {
            this.sendEvent(ListenerEvt, {
                t: e.type,
                oid: object.id || null,
                w: object === window,
                en: eventName,
                tid: (e.target && e.target.id) || null,
                kc: e.keyCode,
                px: e.pageX,
                py: e.pageY,
                ts: e.timeStamp,
                ck: e.ctrlKey,
                b: e.button,
                mx: e.movementX,
                my: e.movementY,
                // TODO: add more properties as necessary
            })
            handler(e)
        }
        object.addEventListener(eventName, wrappedHandler)
    }

    saveReplicationListenerHandler = (object, eventName, handler) => {
        if (!this.replicationEventListeners.has(object)) {
            this.replicationEventListeners.set(object, new Map())
        }
        const objListeners = this.replicationEventListeners.get(object)
        objListeners.set(eventName, handler)
    }

    findReplicationListenerHandler = (event) => {
        const object = event.w ? window : document.getElementById(event.oid)
        const objListeners = this.replicationEventListeners.get(object)
        if (!objListeners) {
            return null
        }
        return objListeners.get(event.en)
    }

    refreshPage = () => {
        setTimeout(() => window.top.postMessage("refreshPage", '*'), 500)
    }

    now = () => {
        if (this.mode === replicatingMode) {
            return this.lastClientNow + (window.performance.now() - this.lastClientNowUpdateTime)
        }
        return window.performance.now()
    }

    firePassiveEvent = (evtId) => {
        if (this.mode === replicatingMode) {
            this.catchPassiveEvent(evtId, false)
            return
        }
        this.sendEvent(PassiveEvt, {
            id: evtId,
        })
    }

    catchPassiveEvent = (evtId, fromClient) => {
        console.log(`catchPassiveEvent: ${evtId}, fromClient: ${fromClient.toString()}`)
        if (this.passiveEventRegistry.has(evtId)) {
            const existing = this.passiveEventRegistry.get(evtId)
            if (fromClient) {
                existing.client = true
            } else {
                existing.server = true
            }
        } else {
            this.passiveEventRegistry.set(evtId, {
                client: fromClient,
                server: !fromClient,
            })
        }
        // pause replication if there are unsynced passive events
        this.replicationPaused = [...this.passiveEventRegistry.entries()]
            .some(([k, v]) => v.client && !v.server)
        console.log(`replicationPaused: ${this.replicationPaused.toString()}`)
    }

    registerGlobalInput = () => {
        if (!window) {
            return
        }
        window.addEventListener('mousedown', evt => 
            this.sendEvent(GlobalMouseDownEvt, {
                x: evt.clientX,
                y: evt.clientY,
                b: evt.button,
            })
        )
        window.addEventListener('mouseup', evt => 
            this.sendEvent(GlobalMouseUpEvt, {
                x: evt.clientX,
                y: evt.clientY,
                b: evt.button,
            })
        )
        window.addEventListener('mousemove', evt =>
            this.sendEvent(GlobalMouseMoveEvt, {
                x: evt.clientX,
                y: evt.clientY,
            })
        )
    }
}

const remotePlay = new RemotePlayState()

export const initSession = (serverUrl, sessionId) => remotePlay.initSession(serverUrl, sessionId)

export const initGame = (initFunction) => remotePlay.initGame(initFunction)

export const startPlay = (width, height) => remotePlay.startPlay(width, height)

export const stopPlay = () => remotePlay.stopPlay()

export const setPostScoreHandler = (handler) => remotePlay.setPostScoreHandler(handler)

export const postScore = (options) => remotePlay.postScore(options)

export const setViewport = (width, height) => remotePlay.setViewport(width, height)

export const startReplicating = () => remotePlay.startReplicating()

export const replicate = (event) => remotePlay.replicate(event)

export const random = () => remotePlay.random()

export const requestAnimationFrame = (handler) => remotePlay.requestAnimationFrame(handler)

export const addOnClick = (element, handler) => remotePlay.addOnClick(element, handler)

export const addOnMouseDown = (element, handler) => remotePlay.addOnMouseDown(element, handler)

// TODO
export const removeOnMouseDown = (element, handler) => {}

export const addOnMouseUp = (element, handler) => remotePlay.addOnMouseUp(element, handler)

// TODO
export const removeOnMouseUp = (element, handler) => {}

export const addOnMouseMove = (element, handler) => remotePlay.addOnMouseMove(element, handler)

export const addEventListener = (object, eventName, handler) => remotePlay.addEventListener(object, eventName, handler)

export const now = () => remotePlay.now()

export const firePassiveEvent = (evtId) => remotePlay.firePassiveEvent(evtId)

export const registerGlobalInput = () => remotePlay.registerGlobalInput()

export const setRandomSeedCallback = (cb) => {
    remotePlay.randomSeedCallback = cb
    if (remotePlay.randomseed) {
        remotePlay.randomSeedCallback(remotePlay.randomseed)
    }
}

export const getRandomSeed = () => remotePlay.randomseed