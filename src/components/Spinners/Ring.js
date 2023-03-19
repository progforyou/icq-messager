import React from "react";

export const RingSpinner = () => {
    return (
        <div style={{width: "80px", height: "80px"}}>
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}