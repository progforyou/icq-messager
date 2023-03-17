import React from "react";
import {useRecorder} from "voice-recorder-react";
import EmojiPicker from 'emoji-picker-react';


export const ChatTextInput = (props) => {
    const [showEmoji, setShowEmoji] = React.useState(false)
    const toggleEmoji = () => {
        setShowEmoji(t => !t)
    }
    const ref = React.useRef(null);
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowEmoji(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
    return (
        <>
            <div className={"mr-3"}>
                <i className={"fa fa-plus-circle cursor-pointer text-blueGray-700 hover:text-blueGray-500 text-xl"}></i>
            </div>
            <form className={"w-full"}>
                <div className="pt-0 relative">
                    <input
                        onChange={e => props.onChange(e.target.value)}
                        value={props.state.message}
                        type="text"
                        placeholder="Сообщение"
                        className="focus:shadow-none border-0 px-3 py-2 h-8 border border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                    />
                    <div className={"absolute top-0 right-0 mr-2 flex h-full"}>
                        <i className={"fa fa-smile my-auto cursor-pointer text-blueGray-700 hover:text-blueGray-500"} onClick={toggleEmoji}></i>
                        {showEmoji ? 
                            <div className={"absolute bottom-0 right-0 mb-5"} ref={ref}>
                                <EmojiPicker onEmojiClick={e => {
                                    props.onChangeEmoji(e.emoji)
                                }}/>
                            </div>: null}
                    </div>
                </div>
            </form>
            <div className={"ml-3 text-center"}>
                {props.state.message ? <i className={"fa fa-paper-plane cursor-pointer text-lightBlue-500 text-xl"}></i> :
                    <i onClick={props.startRecord} className={"fa fa-microphone w-5 cursor-pointer text-blueGray-700 hover:text-blueGray-500 text-xl"}></i>}
            </div>
        </>
    )
}