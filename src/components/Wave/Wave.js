import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import "./wave.css"
import {BsFillPauseFill, BsFillPlayFill} from "react-icons/bs";

class Waveform extends Component {
    state = {
        playing: false,
        duration: 0
    };

    componentDidMount() {
        const track = document.querySelector(`#${this.props.targetTrack}`);

        function changePlaying (toggle) {
            this.setState({ playing: toggle });
        }

        this.waveform = WaveSurfer.create({
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
        });
        //4 sec = 60
        //15 sec - 15

        function startAudio(track, e){
            this.waveform.load(track);
        }
        
        track.addEventListener('loadedmetadata', startAudio.bind(this, track), false);

        this.waveform.on('finish', changePlaying.bind(this));
        this.waveform.zoom(1)
        function setDuration(e){
            this.setState({ duration: (this.waveform.getDuration() - this.waveform.getCurrentTime()).toFixed(2) });
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
                    <div>
                        <div className={"wave"} id={this.props.targetWave} />
                        <div className={"ml-1 text-blueGray-300"} style={{fontSize: "13px"}}>
                            {this.state.duration}
                        </div>
                    </div>
                    <audio id={this.props.targetTrack} src={this.props.url} />
                </div>
            </div>
        );
    }
};

export default Waveform;