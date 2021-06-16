const AnimationFrameEvt = 1
const MouseDownEvt = 2
const MouseUpEvt = 3
const MouseMoveEvt = 4

class RemotePlayState {
    constructor() {
        this.playing = false

        this.mouseDownHandlers = new Map()
        this.mouseUpHandlers = new Map()
        this.mouseMoveHandlers = new Map()

        this.log = []
    }

    startPlay = () => {
        this.playing = true
    }

    stopPlay = () => {
        this.playing = false
        console.log(JSON.stringify(this.log))
        this.log = []
    }

    sendEvent = (type, data) => {
        if (!this.playing) {
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

    requestAnimationFrame = (handler) => {
        return window.requestAnimationFrame((timestamp) => {
            this.sendEvent(AnimationFrameEvt, {
                t: timestamp
            })
            handler(timestamp)
        })
    }

    addOnMouseDown = (element, handler) => {
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

export const random = () => {
}

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