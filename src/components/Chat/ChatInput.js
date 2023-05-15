import React from "react";
//import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { useRecorder } from "voice-recorder-react";
import {ChatTextInput} from "./ChatTextInput";
import {ChatRecorder} from "./ChatRecorder";
import {sleep} from "../../tools/other";
import {useStoreon} from "storeon/react";


export const ChatInput = (props) => {
    const { dispatch, customize } = useStoreon('customize')
    const audioRef = React.useRef(null);
    const [hasRecording, setHasRecording] = React.useState(false);
    const [timeRecording, setTimeRecording] = React.useState(null);
    const [currentTime, setCurrentTime] = React.useState(0)
    const [duration, setDuration] = React.useState(0);
    const [sendToggle, setSendToggle] = React.useState(false);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [file, setFile] = React.useState(null);
    const {
        time,
        data,
        stop,
        start,
        pause,
        paused,
        resume,
        recording
    } = useRecorder();
    const onChangeText = (e) => {
        props.setMessage(e)
    }
    const onChangeEmoji = (e) => {
        props.setMessage(props.state.message + e)
    }
    const startRecord = () => {
            if (!recording) {
                start();
                setHasRecording(false);
            }
    }
    
    const deleteRecord = () => {
        if (recording) {
            stop();
        }
        setTimeRecording(null)
        setHasRecording(false)
        setFile(null)
    }
    
    const stopRecord = () => {
        if (recording) {
            stop();
            setHasRecording(true)
            setTimeRecording(time)
        }
    }
    
    const sendRecord = (r) => {
        if (file === null){
            return null
        }
        if (file){
            props.sendRecord(file)
            setTimeRecording(null)
            setHasRecording(false)
            setSendToggle(true)
            setFile(null)   
        }
    }
    
    const playRecord = () => {
        if (audioRef.current?.paused) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    }

    React.useEffect(() => {
        if (data.url) {
            setFile(data.blob)
            audioRef.current.src = data.url;
        }
    }, [data.url]);
    const playAnimationRef = React.useRef();

    const repeat = React.useCallback(() => {
        setCurrentTime(audioRef.current?.currentTime)
        setIsPlaying(!audioRef.current?.paused)
        playAnimationRef.current = requestAnimationFrame(repeat);
    }, []);
    React.useEffect(() => {
        function getTime(){
            setDuration(audioRef.current.currentTime)
        }
        audioRef.current?.addEventListener("timeupdate", getTime)
        return () => {
            audioRef.current?.removeEventListener('timeupdate', getTime);
        };
    }, [])
    React.useEffect(() => {
        playAnimationRef.current = requestAnimationFrame(repeat);
        return () => {
            playAnimationRef.current = null
        }
    }, [audioRef, repeat]);
    const onSendMessage = () => {
        if (props.isEdit){
            props.onEditMessage()
        } else {
            props.onSend()   
        }
        props.setMessage("")
    }
    return (
        <div className={"items-center bg-blueGray-100 px-4" } style={{bottom: "calc(1rem + env(safe-area-inset-bottom))", position: "fixed", width: customize.isMobile ? "100%" : "calc(100% - 265px)"}}>
            <audio ref={audioRef} hidden />
            {recording || hasRecording ? <ChatRecorder duration={duration} currentTime={currentTime} isPlaying={isPlaying} hasRecording={hasRecording} timeRecording={timeRecording} stopRecord={stopRecord} time={time}
                                                       deleteRecord={deleteRecord} sendRecord={sendRecord} playRecord={playRecord}/> :
            <ChatTextInput deleteFilePrev={props.deleteFilePrev} deleteFile={props.deleteFile} handleFiles={props.handleFiles} isEdit={props.isEdit} onCancelEdit={props.onCancelEdit} onSendMessage={onSendMessage}  onChange={onChangeText} onChangeEmoji={onChangeEmoji} state={props.state} startRecord={startRecord}/> }
        </div>
    )
}