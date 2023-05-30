import React from "react";
//import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { useRecorder } from "voice-recorder-react";
import {ChatTextInput} from "./ChatTextInput";
import {ChatRecorder} from "./ChatRecorder";
import {sleep} from "../../tools/other";
import {useStoreon} from "storeon/react";
import MicRecorder from "mic-recorder-to-mp3"

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}


export const ChatInput = (props) => {
    const { dispatch, customize } = useStoreon('customize')
    const audioRef = React.useRef(null);
    const [hasRecording, setHasRecording] = React.useState(false);
    const [timeRecording, setTimeRecording] = React.useState(null);
    const [currentTime, setCurrentTime] = React.useState(0)
    const [duration, setDuration] = React.useState(0);
    const [recording, setRecording] = React.useState(false);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [file, setFile] = React.useState(null);
    const [time, setTime] = React.useState(0);
    const [isRunning, setIsRunning] = React.useState(false);
    
    const recordRef = React.useRef(new MicRecorder({
        bitRate: 128
    }))
    const onChangeText = (e) => {
        props.setMessage(e)
    }
    const onChangeEmoji = (e) => {
        props.setMessage(props.state.message + e)
    }
    React.useEffect(() => {
        let intervalId;
        if (isRunning) {
            intervalId = setInterval(() => setTime(time + 1), 10);
        }
        return () => clearInterval(intervalId);
    }, [isRunning, time]);
    const startAndStop = () => {
        setIsRunning(!isRunning);
    };
    const startRecord = () => {
        setRecording(true)
        startAndStop()
        recordRef.current.start()
        setHasRecording(false);
    }
    
    const deleteRecord = () => {
        setRecording(false)
        recordRef.current.stop()
        setIsRunning(false);
        setTime(0)
        setTimeRecording(null)
        setHasRecording(false)
        setFile(null)
    }
    
    const stopRecord = async () => {
        setRecording(false)
        recordRef.current.stop().getMp3().then(([buffer, blob]) => {
            const file = new File(buffer, `voice_${makeid(4)}.mp3`, {
                type: blob.type,
                lastModified: Date.now()
            });
            audioRef.current.src = URL.createObjectURL(file)
            setHasRecording(true)
            setIsRunning(false);
            setFile(file)
        })
    }
    
    const sendRecord = (r) => {
        if (recording){
            setRecording(false)
            recordRef.current.stop().getMp3().then(([buffer, blob]) => {
                const file = new File(buffer, `voice_${makeid(4)}.mp3`, {
                    type: blob.type,
                    lastModified: Date.now()
                });
                setIsRunning(false);
                setTime(0)
                setTimeRecording(null)
                setHasRecording(false)
                setFile(null)
                props.sendRecord(file)
            })
        } else {
            setIsRunning(false);
            setTime(0)
            setTimeRecording(null)
            setHasRecording(false)
            setFile(null)
            props.sendRecord(file)
        }
    }
    
    const playRecord = () => {
        if (audioRef.current?.paused) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    }
    
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
    const onChangeHeight = (h) => {
        dispatch("customize/setTextareaHeight", h)
    }
    return (
        <div className={"items-center bg-blueGray-100 px-4" } style={{bottom: "calc(1rem + env(safe-area-inset-bottom))", position: "fixed", width: customize.isMobile ? "100%" : "calc(100% - 265px)"}}>
            <audio ref={audioRef} hidden />
            {recording || hasRecording ? <ChatRecorder duration={duration} currentTime={currentTime} isPlaying={isPlaying} hasRecording={hasRecording} timeRecording={timeRecording} stopRecord={stopRecord} time={time}
                                                       deleteRecord={deleteRecord} sendRecord={sendRecord} playRecord={playRecord}/> :
            <ChatTextInput onChangeHeight={onChangeHeight} deleteFilePrev={props.deleteFilePrev} deleteFile={props.deleteFile} handleFiles={props.handleFiles} isEdit={props.isEdit} onCancelEdit={props.onCancelEdit} onSendMessage={onSendMessage}  onChange={onChangeText} onChangeEmoji={onChangeEmoji} state={props.state} startRecord={startRecord}/> }
        </div>
    )
}