import React from "react";
//import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { useRecorder } from "voice-recorder-react";
import {ChatTextInput} from "./ChatTextInput";
import {ChatRecorder} from "./ChatRecorder";


export const ChatInput = (props) => {
    const [state, setState] = React.useState({message: ""})
    const audioRef = React.useRef(null);
    const [hasRecording, setHasRecording] = React.useState(false);
    const [timeRecording, setTimeRecording] = React.useState(null);
    const [audioPaused, setAudioPaused] = React.useState(false);
    const [currentTime, setCurrentTime] = React.useState(0)
    const [sendToggle, setSendToggle] = React.useState(false);
    const [isPlaying, setIsPlaying] = React.useState(false);
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
        setState({...state, message: e})
    }
    const onChangeEmoji = (e) => {
        setState({...state, message: state.message + e})
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
    }
    
    const stopRecord = () => {
        if (recording) {
            stop();
            setHasRecording(true)
            setTimeRecording(time)
        }
    }

    const sendRecord = (r) => {
        if (recording) {
            stop();
            console.log("send")
        }
        setTimeRecording(null)
        setHasRecording(false)
        setSendToggle(true)
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
            if (sendToggle){
                setSendToggle(false)
            } else {
                audioRef.current.src = data.url;
            }
        }
    }, [data.url, sendToggle]);
    const togglePlayPause = () => {
        setIsPlaying((prev) => !prev);
    };
    const playAnimationRef = React.useRef();

    const repeat = React.useCallback(() => {
        setCurrentTime(audioRef.current?.currentTime)
        setIsPlaying(!audioRef.current?.paused)
        playAnimationRef.current = requestAnimationFrame(repeat);
    }, []);
    React.useEffect(() => {
        playAnimationRef.current = requestAnimationFrame(repeat);
        return () => {
            playAnimationRef.current = null
        }
    }, [audioRef, repeat]);
    return (
        <div className={"flex h-100 items-center"} style={{height: "50px"}}>
            <audio ref={audioRef} hidden />
            {recording || hasRecording ? <ChatRecorder currentTime={currentTime} isPlaying={isPlaying} hasRecording={hasRecording} timeRecording={timeRecording} stopRecord={stopRecord} time={time}
                                                       deleteRecord={deleteRecord} sendRecord={sendRecord} playRecord={playRecord}/> :
            <ChatTextInput  onChange={onChangeText} onChangeEmoji={onChangeEmoji} state={state} startRecord={startRecord}/> }
        </div>
    )
}