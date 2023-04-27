import React from "react";
import {useRecorder} from "voice-recorder-react";
import {sleep} from "../../tools/other";

function writeTime(t) {
    const model = (x) => x > 9 ? `${x}` : `0${x}`
    return `${model(t.h)}:${model(t.m)},${model(t.s)}`
}

export const ChatRecorder = (props) => {
    return (
        <div className={"flex"}>
            <div className={"mr-3"}>
                <i onClick={props.deleteRecord} className={"fa fa-trash cursor-pointer text-blueGray-700 hover:text-blueGray-500 text-xl"}></i>
            </div>
            <div className={"cursor-pointer text-base flex bg-lightBlue-500 w-full h-8 rounded text-center px-3"} onClick={props.stopRecord}>
                <div className={"flex w-full my-auto"}>
                    {props.hasRecording ? !props.isPlaying ? <i className={"fa fa-play text-blueGray-700 hover:text-blueGray-500 my-auto mr-2 z-10"}
                        onClick={(e) => {
                            props.playRecord()
                            e.stopPropagation()  
                        }}></i> : <i className={"fa fa-pause text-blueGray-700 hover:text-blueGray-500 my-auto mr-2 z-10"}
                                     onClick={(e) => {
                                         props.playRecord()
                                         e.stopPropagation()
                                     }}></i> :
                    <i className={"fa fa-stop text-blueGray-700 hover:text-blueGray-500 my-auto mr-2 z-10"} onClick={(e) => {
                        props.stopRecord()
                        e.stopPropagation()
                    }}></i> }
                    <div className={"ml-auto"}>
                        {writeTime(props.timeRecording ? props.timeRecording : props.time)}
                    </div>
                </div>
            </div>
            <div className={"ml-3 text-center"}>
                <i onClick={() => {
                    props.stopRecord()
                    props.sendRecord()
                }} className={"fa fa-paper-plane cursor-pointer text-lightBlue-500 text-xl"}></i> 
            </div>
        </div>
    )
}