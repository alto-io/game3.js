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

// modes
const idleMode = 1
const playingMode = 2
const replicatingMode = 3

class RemotePlayState {
    constructor() {
        this.log = []

        this.seedrandom = null
        this.mode = idleMode

        this.replicationHandlers = new Map()

        this.mouseDownHandlers = new Map()
        this.mouseUpHandlers = new Map()
        this.mouseMoveHandlers = new Map()

        this.startReplicating()
    }

    startReplicating = () => {
        this.mode = replicatingMode
    }

    replicate = async (events) => {
        if (!Array.isArray(events)) {
            return
        }
        let prevT = 0
        for (let i = 0; i < events.length; i++) {
            const evt = events[i]
            const type = evt.e
            const handler = this.replicationHandlers.get(type)
            switch(type) {
                case RandomSeedEvt: {
                    this.initSeedrandom(evt.s)
                    break
                }
                case AnimationFrameEvt: {
                    handler(evt.t)
                    break
                }
                case MouseDownEvt: 
                case MouseUpEvt: 
                case MouseMoveEvt: {
                    handler({
                        clientX: evt.clientX,
                        clientY: evt.clientY,
                    })
                    break
                }
            }
/*
            console.log(`evt type: ${type}`)
            const delay = evt.t - prevT
            prevT = evt.t
            await new Promise(resolve => setTimeout(resolve, delay))
*/
        }
    }

    startPlay = () => {
        if (this.mode === idleMode) {
            this.mode = playingMode
            this.initSeedrandom()
        }
    }

    stopPlay = () => {
        if (this.mode === playingMode) {
            this.mode = idleMode
            console.log(JSON.stringify(this.log))
            this.log = []
        }
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

export const startPlay = () => remotePlay.startPlay()

export const stopPlay = () => remotePlay.stopPlay()

export const replicate = (events) => remotePlay.replicate(events)

export const random = () => remotePlay.random()

export const requestAnimationFrame = (handler) => remotePlay.requestAnimationFrame(handler)

export const addOnMouseDown = (element, handler) => remotePlay.addOnMouseDown(element, handler)

export const removeOnMouseDown = (element, handler) => {}

export const addOnMouseUp = (element, handler) => remotePlay.addOnMouseUp(element, handler)

export const removeOnMouseUp = (element, handler) => {}

export const addOnMouseMove = (element, handler) => remotePlay.addOnMouseMove(element, handler)

export const removeOnMouseMove = (element, handler) => {}

export const addOnClick = (element, handler) => {
}

export const removeOnClick = (element, handler) => {
}

export const addOnKeydown = (element, handler) => {
}

export const removeOnKeyup = (element, handler) => {
}