import React from "react";

export const EllipsisSpinner = () => {
    return (
        <div style={{width: "80px", height: "80px"}}>
            <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}