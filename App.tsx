import React, { ReactElement, useState, useEffect, useCallback } from "react";

////////////////////////////////////////////////
// Closure Time
////////////////////////////////////////////////

const { dangerouslySetMyClosedValue, StateSharingSvc, StateSharingClosure } = (() => {
    let _hiddenGlobalMsg: string = 'Hello World';

    type ListenerMap = { onChange: Function[] }
    const listeners: ListenerMap = { onChange: [] }

    class StateSharingClosure {
        constructor(private id: number) { }
        getMessage = (): string => {
            return `[${this.id}] ${_hiddenGlobalMsg}`
        }

        registerListener = (eventName: string, listener: Function): Function => {
            console.log(`Instance ${this.id} registering listener`)
            listeners[eventName].push(listener);
            return (): void => {
                const fnIndex = listeners[eventName].indexOf(listener);
                listeners[eventName].splice(fnIndex, fnIndex);
            }
        }
    }

    // Create a way to modify the closed value
    const dangerouslySetMyClosedValue = (newMsg: string): void => {
        _hiddenGlobalMsg = newMsg
        listeners.onChange.forEach(listener => listener.call(null, _hiddenGlobalMsg))
    };

    // Init
    const StateSharingSvc = new StateSharingClosure(1);

    return { StateSharingSvc, StateSharingClosure, dangerouslySetMyClosedValue };
})();

// Make the service available to play with in console
window.StateSharingSvc = StateSharingSvc;

////////////////////////////////////////////////
// Component Time
////////////////////////////////////////////////

const containerStyles = {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    width: '100%'
}
export const App = () => {
    const [msg, setMsg] = useState(StateSharingSvc.getMessage());
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setMsg(e.target.value)
    }, [setMsg])

    return (
        <div>
            <h2> The playground has REACTED! </h2>
            <div>
                <label htmlFor="change-msg">Global Message Value</label>
                <input id="change-msg" type="text" value={msg} onChange={handleChange} />
                <button onClick={(): void => { dangerouslySetMyClosedValue(msg) }}>
                    Set Global Message
                </button>
            </div>
            <div style={containerStyles}>
                <Component1 />
                <Component2 />
                <Component3 />
            </div>
        </div>
    );
}

const Component1 = (): ReactElement => {
    const msg = StateSharingSvc.getMessage();
    return (
        <div>
            <h3>Frozen Shared State in Component 1</h3>
            <p>{msg}</p>
        </div>
    )
}

const Component2 = (): ReactElement => {

    const localInstance = new StateSharingClosure(2);

    const onClosureChange = useCallback((newVal: string) => {
        console.log('localInstance can also listen', localInstance.getMessage());
    }, [])

    useEffect(() => {
        const listener = localInstance.registerListener('onChange', onClosureChange);
        return () => listener()
    }, [onClosureChange])

    return (
        <div>
            <h3>Shared State in Component 2 (view won't update, tho) </h3>
            <p>{localInstance.getMessage()}</p>
        </div>
    )
}

const Component3 = (): ReactElement => {
    let hasChanged = false;

    const [localMsg, setLocalMsg] = useState(StateSharingSvc.getMessage());

    const onClosureChange = useCallback((newVal: string) => {
        console.log('running onClosureChange with access to private value', newVal);
        setLocalMsg(StateSharingSvc.getMessage());
    }, [setLocalMsg])

    useEffect(() => { hasChanged = true }, [localMsg])
    useEffect(() => {
        const listner = StateSharingSvc.registerListener('onChange', onClosureChange);
        return () => listner()
    }, [onClosureChange])

    return (
        <div>
            <h3>Shared State in Component 2</h3>
            <p>Has Changed? {hasChanged.toString()}</p>
            <p>Local Message: {localMsg}</p>
        </div>
    )
}