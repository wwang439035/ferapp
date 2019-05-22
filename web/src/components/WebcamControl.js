import React, { Component, Fragment } from "react";
import Webcam from "react-webcam";
import SummaryPieChart from './SummaryPieChart'

const EXPRESSION_MAP = {
    angry: {
        gifurl:"https://giphy.com/embed/11tTNkNy1SdXGg",
        comment: "You look ANGRY!!!!",
    },
    sad: {
        gifurl: "https://giphy.com/embed/9Y5BbDSkSTiY8",
        comment: "You look SAD. Cheer Up!!!",
    },
    happy: {
        gifurl: "https://giphy.com/embed/rdma0nDFZMR32",
        comment: "WOW! You look HAPPY!! This is your day",
    },
    neutral: {
        gifurl: "https://giphy.com/embed/3o6nUYhmHg75WFGHHG",
        comment: "You are NEUTRAL!!! Are you not human",
    },
    none: {
        gifurl: "https://giphy.com/embed/5QW76Ww9bquHdg1fTv",
        comment: "Are you invisible! I can't find you!!!",
    },
    disgust: {
        gifurl: "https://giphy.com/embed/R0jWWtH1CtFEk",
        comment: "You are DISGUSTED!! Who cut the cheese???",
    },
    surprise: {
        gifurl: "https://giphy.com/embed/kym4u59Xx1V2U",
        comment: "You look SURPRISED!!!",
    }
};

class WebcamControl extends Component {
    setRef = webcam => {
        this.webcam = webcam;
    };

    constructor(props) {
        super(props);
        this.state = {
            expression: '',
            videoId: '',
            imageSrc: '',
            angry: 0,
            sad: 0,
            happy: 0,
            neutral: 0,
            surprise: 0,
            disgust: 0,
        }
    }


    capture = () => {
        const imageSrc = this.webcam.getScreenshot();
        this.setState({imageSrc});
        fetch("http://localhost:8000/ferapp/retrieve", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: imageSrc
            })
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                let expression = data.expressionFromGCP
                    ? data.expressionFromGCP.toLowerCase()
                    : data.expression.toLowerCase();
                this.setState({
                    expression: expression,
                });
                let count = 0;
                switch (expression) {
                    case 'angry':
                        count = this.state.angry + 1;
                        this.setState({
                            angry: count,
                        });
                        break;
                    case 'happy':
                        count = this.state.happy + 1;
                        this.setState({
                            happy: count,
                        });
                        break;
                }
            });
    };

    renderResult() {
        const {
            expression,
        } = this.state;
        const {gifurl, comment} = EXPRESSION_MAP[expression];
        return (
            <Fragment>
                <div> {comment} </div>
                <iframe src={gifurl} width="480" height="267" frameBorder="0" className="giphy-embed"
                        allowFullScreen></iframe>
                <button onClick={this.renderWebCam}>Try Again</button>
            </Fragment>
        );
    }

    renderWebCam() {
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: "user"
        };
        const {
            imageSrc,
        } = this.state;

        return (
            <Fragment>
                <Webcam
                    audio={false}
                    height={600}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={600}
                    videoConstraints={videoConstraints}
                />
                <button onClick={this.capture}>Capture photo</button>
                {imageSrc && <img src={imageSrc} alt={"Loading"}/>}
            </Fragment>
        );
    }

    render() {
        const {
            expression,
            angry,
            sad,
            happy,
            neutral,
            surprise,
            disgust,
        } = this.state;
        return (
            <Fragment>
                {this.renderWebCam()}
                {expression && this.renderResult()}
                <SummaryPieChart
                    angry={angry}
                    sad={sad}
                    happy={happy}
                    neutral={neutral}
                    surprise={surprise}
                    disgust={disgust}
                />
            </Fragment>
        );
    }
}

export default WebcamControl;
