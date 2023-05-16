import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import "./wave.css"
import {BsFillPauseFill, BsFillPlayFill} from "react-icons/bs";

class Waveform extends Component {
    state = {
        playing: false,
        duration: 0,
        percent: 100
    };

    componentDidMount() {
        const track = document.querySelector(`#${this.props.targetTrack}`);

        function changePlaying (toggle) {
            this.setState({ playing: toggle });
        }

        let wavesurferArgs = {
            barWidth: 3,
            cursorWidth: 1,
            container: `#${this.props.targetWave}`,
            backend: 'WebAudio',
            height: 30,
            progressColor: '#2D5BFF',
            responsive: true,
            waveColor: '#EFEFEF',
            cursorColor: 'transparent',
            fillParent: true,
            barHeight: 2,
            forceDecode: true
        };

        /*const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent || '') ||
            /iPad|iPhone|iPod/i.test(navigator.userAgent || '');

        if (isSafari) {
            wavesurferArgs.backend = 'MediaElement';
        }*/
        

        this.waveform = WaveSurfer.create(wavesurferArgs);
        //4 sec = 60
        //15 sec - 15

        /*function startAudio(track, e){
            this.waveform.load(this.props.url);
        }*/
        
        //track.addEventListener('loadedmetadata', startAudio.bind(this, track), false);

        this.waveform.load(this.props.url);
        this.waveform.on('finish', changePlaying.bind(this));
        this.waveform.setVolume(1)
        this.waveform.zoom(1)
        function setDuration(e){
            this.setState({ duration: (this.waveform.getDuration() - this.waveform.getCurrentTime()).toFixed(2) });
            this.setState({ percent: (this.waveform.getCurrentTime()/this.waveform.getDuration() * 100).toFixed() });
        }
        this.waveform.on('audioprocess', setDuration.bind(this));
        this.waveform.on('ready', setDuration.bind(this));
    };

    handlePlay = () => {
        this.setState({ playing: !this.state.playing });
        this.waveform.playPause();
    };

    render() {

        return (
            <div>
                <div className={"waveform_contianer"}>
                    <div className={'play_button'} onClick={this.handlePlay} >
                        {!this.state.playing ? <BsFillPlayFill/> : <BsFillPauseFill/>}
                    </div>
                    <div className={"relative"}>
                        <div className={"wave"} id={this.props.targetWave} />
                        <div className={"wave_line"}></div>
                        <div className={"wave_progress_line"} style={{width: `calc(${this.state.percent}% - 8px)`}}></div>
                        <div className={"ml-1 text-blueGray-300"} style={{fontSize: "13px"}}>
                            {this.state.duration}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Waveform;