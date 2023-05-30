import React from "react";
import {useRecorder} from "voice-recorder-react";
import EmojiPicker from 'emoji-picker-react';
import {AddFileDropdown} from "../Dropdowns/AddFileDropdown";
import {useStoreon} from "storeon/react";
import {getFileName} from "../../tools/other";
import TextareaAutosize from 'react-textarea-autosize';



export const ChatTextInput = (props) => {
    const { dispatch, customize } = useStoreon('customize')
    const [showEmoji, setShowEmoji] = React.useState(false)
    const toggleEmoji = () => {
        setShowEmoji(t => !t)
    }
    const ref = React.useRef(null);
    const btnDropdownRef = React.useRef(null);
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target) && !btnDropdownRef.current.contains(event.target)) {
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
            {props.state.files?.length ? <div className={"text-sm flex text-blueGray-600"}>
                {Array.from(props.state.files).map((file, key) => {
                    return <div key={key} onClick={() => props.deleteFile(key)} style={{maxWidth: "100px"}} className={"hover:text-blueGray-500 mr-3 cursor-pointer overflow-ellipsis whitespace-nowrap"}>
                        <i className={"fa fa-file"}></i> {file.name}
                    </div>
                })}
            </div> : null}
            {props.state.prevFiles?.length ? <div className={"text-sm flex text-blueGray-600"}>
                {props.state.prevFiles.map((file, key) => {
                    return <div key={key} onClick={() => props.deleteFilePrev(key)} style={{maxWidth: "100px"}} className={"hover:text-blueGray-500 mr-3 cursor-pointer overflow-ellipsis whitespace-nowrap"}>
                        <i className={"fa fa-file"}></i> {getFileName(file.url)}
                    </div>
                })}
            </div> : null}
        <div className={"flex w-full"}>
            <div className={"mr-3 flex"}>
                <AddFileDropdown handleFiles={props.handleFiles} startRecord={props.startRecord}/>
            </div>
            <form className={"w-full"} onSubmit={(e) => {
                e.preventDefault();
                if (props.state.message !== "") props.onSendMessage();
            }}>
                <div className="relative">
                    <TextareaAutosize 
                        maxRows={10}
                        minRows={1}
                        onHeightChange={props.onChangeHeight}
                        onChange={e => props.onChange(e.target.value)}
                        value={props.state.message}
                        placeholder="Сообщение"
                        style={{paddingRight: "2rem", resize: "none"}}
                        className="focus:shadow-none px-3 py-1 border border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                    />
                    <div className={"absolute right-0 mr-2 flex"} style={{bottom: "15px"}}>
                        <i ref={btnDropdownRef} className={"fa fa-smile my-auto cursor-pointer text-blueGray-700 hover:text-blueGray-500"} onClick={toggleEmoji}></i>
                        {showEmoji ? 
                            <div className={"absolute bottom-0 right-0 mb-5"} ref={ref}>
                                <EmojiPicker width={customize.isMobile ? "90%" : "" } onEmojiClick={e => {
                                    props.onChangeEmoji(e.emoji)
                                }}/>
                            </div>: null}
                    </div>
                </div>
            </form>
            <div className={"ml-3 text-center flex"}>
                {props.state.message || props.state.files?.length || props.state.prevFiles?.length ? <i style={{marginBottom: "8px"}} onClick={props.onSendMessage} className={"mt-auto fa fa-paper-plane cursor-pointer text-lightBlue-500 text-xl"}></i> :
                    <i onClick={props.startRecord} style={{marginBottom: "8px"}} className={"mt-auto fa fa-microphone w-5 cursor-pointer text-blueGray-700 hover:text-blueGray-500 text-xl"}></i>}
            </div>
        </div>
        </>
    )
}