class RemotePlayState {
    constructor() {
        this.mouseDownHandlers = new Map()
        this.mouseUpHandlers = new Map()
        this.mouseMoveHandlers = new Map()
    }

    sendAnimationFrame = (timestamp) => {
        // console.log(`frame: ${timestamp}`)
    }

    sendMouseDown = (e) => {
        console.log(`sendMouseDown: ${e}`)
    }

    sendMouseUp = (e) => {
        console.log(`sendMouseUp: ${e}`)
    }

    sendMouseMove = (e) => {
        console.log(`sendMouseMove: ${e}`)
    }

    requestAnimationFrame = (handler) => {
        return window.requestAnimationFrame((timestamp) => {
            this.sendAnimationFrame(timestamp)
            handler(timestamp)
        })
    }

    addOnMouseDown = (element, handler) => {
        const wrappedHandler = (e) => {
            this.sendMouseDown(e)
            handler(e)
        }
        element.onmousedown = wrappedHandler
        this.addPerElementHandler(this.mouseDownHandlers, element, wrappedHandler)
    }

    addOnMouseUp = (element, handler) => {
        const wrappedHandler = (e) => {
            this.sendMouseUp(e)
            handler(e)
        }
        element.onmouseup = wrappedHandler
        this.addPerElementHandler(this.mouseUpHandlers, element, wrappedHandler)
    }

    addOnMouseMove = (element, handler) => {
        const wrappedHandler = (e) => {
            this.sendMouseMove(e)
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