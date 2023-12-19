import React from "react";

import "./styles/Scale.css";

import raceScale from "../medias/png/background/scale_background.png";

const Scale = () => {

    return (
        <main className="scale">
            <h1>Classement des Courses</h1>
            <img src={raceScale} alt="Barème des courses" width="1887" height="824" />
        </main>
    );
};

export default Scale;