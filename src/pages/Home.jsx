import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const [level, setLevel] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [subject, setSubject] = useState("");

    const primaryClasses = ["1", "2", "3", "4", "5"];
    const middleClasses = ["6", "7", "8"];

    const primarySubjects = ["hindi", "math", "english", "evs"];
    const middleSubjects = [
        "hindi",
        "math",
        "science",
        "social-science",
        "english",
        "sanskrit"
    ];

    const classes = level === "primary" ? primaryClasses : middleClasses;
    const subjects = level === "primary" ? primarySubjects : middleSubjects;

    const handleGenerate = () => {
        if (!level || !selectedClass || !subject) {
            alert("Please select all options");
            return;
        }

        // Navigate with dynamic URL
        navigate(`/${level}/${selectedClass}/${subject}`);
    };

    return (
        <div className="home-container">
            <div className="card">
                <h1 className="title">Exam Generator</h1>

                <div className="field">
                    <label>Select Level</label>
                    <select onChange={(e) => {
                        setLevel(e.target.value);
                        setSelectedClass("");
                        setSubject("");
                    }}>
                        <option value="">Choose Level</option>
                        <option value="primary">Primary</option>
                        <option value="middle">Middle</option>
                    </select>
                </div>

                {level && (
                    <>
                        <div className="field">
                            <label>Select Class</label>
                            <select onChange={(e) => setSelectedClass(e.target.value)}>
                                <option value="">Choose Class</option>
                                {classes.map((cls, index) => (
                                    <option key={index} value={cls}>
                                        Class {cls}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label>Select Subject</label>
                            <select onChange={(e) => setSubject(e.target.value)}>
                                <option value="">Choose Subject</option>
                                {subjects.map((sub, index) => (
                                    <option key={index} value={sub}>
                                        {sub.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                <button className="generate-btn" onClick={handleGenerate}>
                    Generate Exam
                </button>
            </div>
        </div>
    );
}

export default Home;