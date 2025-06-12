"use client"

import { actionTypes } from "@/lib/constants"
import {useState, useEffect} from "react"

const TOAST_REMOVE_DELAY = 1000

let count = 0

function genId() {
    count = (count + 1) % Number.MAX_VALUE
    return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [...state.toasts, action.toast],
            }

        case actionTypes.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            }

        case actionTypes.DISMISS_TOAST: {
            const { toastId } = action

            // ! Side effects ! - This could be extracted into a dismissToast() action,
            // but I'll keep it here for simplicity
            if (toastId) {
                addToRemoveQueue(toastId)
            } else {
                state.toasts.forEach((toast) => {
                    addToRemoveQueue(toast.id)
                })
            }

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId || toastId === undefined
                        ? {
                            ...t,
                            open: false,
                        }
                        : t
                ),
            }
        }
        case actionTypes.REMOVE_TOAST:
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                }
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            }
    }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
    memoryState = reducer(memoryState, action)
    listeners.forEach((listener) => {
        listener(memoryState)
    })
}

function addToRemoveQueue(toastId: string) {
    const timeout = setTimeout(() => {
        dispatch({
            type: "REMOVE_TOAST",
            toastId,
        })
    }, TOAST_REMOVE_DELAY)

    toastTimeouts.set(toastId, timeout)
}

function useToast() {
    const [state, setState] = useState<State>(memoryState)

    useEffect(() => {
        listeners.push(setState)
        return () => {
            const index = listeners.indexOf(setState)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }, [state])

    return {
        ...state,
        toast: (props: Omit<ToasterToast, "id" | "open">) => {
            const id = genId()

            const update = (props: Omit<ToasterToast, "id">) =>
                dispatch({
                    type: "UPDATE_TOAST",
                    toast: { ...props, id },
                })
            const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

            dispatch({
                type: "ADD_TOAST",
                toast: {
                    ...props,
                    id,
                    open: true,
                },
            })

            return {
                id,
                dismiss,
                update,
            }
        },
        dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
        clear: () => dispatch({ type: "REMOVE_TOAST" }),
        toasts: state.toasts,
    }
}

export { useToast }
