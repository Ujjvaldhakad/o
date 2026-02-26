import React, { useEffect, useState } from "react";
import Papa from "papaparse";


const CSV_URL = "https://docs.google.com/spreadsheets/d/1-sV_ney5N8IYYPMlmZ35p6PBHD_DEyqug-H8gYPc1-M/export?format=csv&gid=0";

const SCIENCE_FILTERS = [
    { label: "Living & Non-Living", from: 1, to: 120 },
    { label: "Plants", from: 121, to: 260 },
    { label: "Animals", from: 261, to: 380 },
    { label: "Human Body & Health", from: 381, to: 500 },
    { label: "Food & Nutrition", from: 501, to: 620 },
    { label: "Matter", from: 621, to: 760 },
    { label: "Force & Motion", from: 761, to: 890 },
    { label: "Energy", from: 891, to: 1010 },
    { label: "Earth & Space", from: 1011, to: 1120 },
    { label: "Environment", from: 1121, to: 1213 }
];

/* ===== Universal Image Converter ===== */
const convertImageUrl = (url) => {
    if (!url) return null;

    url = url.replace(/^"|"$/g, "").trim();

    if (url.includes("res.cloudinary.com")) return url;

    if (url.includes("/file/d/")) {
        const fileId = url.split("/file/d/")[1]?.split("/")[0];
        return `https://lh3.googleusercontent.com/d/${fileId}`;
    }

    if (url.includes("open?id=")) {
        const fileId = url.split("open?id=")[1];
        return `https://lh3.googleusercontent.com/d/${fileId}`;
    }

    if (url.startsWith("http")) return url;

    return null;
};

export default function Science() {
    const [questions, setQuestions] = useState([]);
    const [generatedPaper, setGeneratedPaper] = useState([]);
    const [categoryCounts, setCategoryCounts] = useState({});
    const [totalMarks, setTotalMarks] = useState("");
    const [showAnswerSheet, setShowAnswerSheet] = useState(false);

    /* ===== Load CSV ===== */
    useEffect(() => {
        fetch(CSV_URL)
            .then((res) => res.text())
            .then((csvText) => {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const parsed = results.data.map((row) => ({
                            id: Number(row.q_id),
                            question: row.question?.trim(),
                            question_image: convertImageUrl(row.question_image),
                            imgWidth: 220,
                            options: [
                                {
                                    text: row.option1_text?.trim(),
                                    image: convertImageUrl(row.option1_image),
                                    imgWidth: 150
                                },
                                {
                                    text: row.option2_text?.trim(),
                                    image: convertImageUrl(row.option2_image),
                                    imgWidth: 150
                                },
                                {
                                    text: row.option3_text?.trim(),
                                    image: convertImageUrl(row.option3_image),
                                    imgWidth: 150
                                },
                                {
                                    text: row.option4_text?.trim(),
                                    image: convertImageUrl(row.option4_image),
                                    imgWidth: 150
                                }
                            ],
                            answer: row.answer?.trim()
                        }));

                        setQuestions(parsed);
                    }
                });
            });
    }, []);

    /* ===== Generate Random Paper ===== */
    const generatePaper = () => {
        let selected = [];

        SCIENCE_FILTERS.forEach((cat) => {
            const count = categoryCounts[cat.label] || 0;

            if (count > 0) {
                const filtered = questions.filter(
                    (q) => q.id >= cat.from && q.id <= cat.to
                );

                const shuffled = [...filtered].sort(() => 0.5 - Math.random());
                selected.push(...shuffled.slice(0, count));
            }
        });

        setGeneratedPaper(selected);
    };

    /* ===== Update Functions ===== */
    const updateQuestion = (i, value) => {
        const updated = [...generatedPaper];
        updated[i].question = value;
        setGeneratedPaper(updated);
    };

    const updateOption = (i, j, value) => {
        const updated = [...generatedPaper];
        updated[i].options[j].text = value;
        setGeneratedPaper(updated);
    };

    const updateQuestionImageWidth = (i, value) => {
        const updated = [...generatedPaper];
        updated[i].imgWidth = Number(value) || 0;
        setGeneratedPaper(updated);
    };

    const updateOptionImageWidth = (i, j, value) => {
        const updated = [...generatedPaper];
        updated[i].options[j].imgWidth = Number(value) || 0;
        setGeneratedPaper(updated);
    };

    return (
        <div className="science-container">

            {/* ===== CONFIG SECTION ===== */}
            <div className="no-print config-box">
                <h2>Science Exam Generator</h2>

                {SCIENCE_FILTERS.map((cat, i) => (
                    <div key={i} className="config-row">
                        {cat.label}
                        <input
                            type="number"
                            className="custom"
                            min="0"
                            onChange={(e) =>
                                setCategoryCounts({
                                    ...categoryCounts,
                                    [cat.label]: Number(e.target.value)
                                })
                            }
                        />
                    </div>
                ))}

                <div className="config-row">
                    Total Marks:
                    <input
                        type="number"
                        className="custom"
                        onChange={(e) => setTotalMarks(e.target.value)}
                    />
                </div>

                <button onClick={generatePaper}>Generate Exam</button>
            </div>

            {/* ===== EXAM PAPER ===== */}
            {generatedPaper.length > 0 && (
                <div className="print-area">

                    <div className="exam-header">
                        <h2>SCIENCE EXAMINATION</h2>
                        <div className="meta">
                            <span>Name: ____________________</span>
                            <span>Date: ____________________</span>
                        </div>
                        <div>Total Marks: {totalMarks}</div>
                    </div>

                    {generatedPaper.map((q, i) => (
                        <div key={i} className="question-block">

                            <div className="question-edit">
                                <p className="numbering">{i + 1})</p>
                                <textarea
                                    value={q.question}
                                    onChange={(e) => updateQuestion(i, e.target.value)}
                                />
                            </div>

                            {q.question_image && (
                                <>
                                    <img
                                        src={q.question_image}
                                        alt=""
                                        loading="lazy"
                                        style={{ width: `${q.imgWidth}px` }}
                                        onError={(e) => (e.target.style.display = "none")}
                                    />
                                    <div className="no-print resize-box">
                                        Width:
                                        <input
                                            type="range"
                                            min="50"
                                            max="600"
                                            value={q.imgWidth}
                                            onChange={(e) =>
                                                updateQuestionImageWidth(i, e.target.value)
                                            }
                                        />
                                    </div>
                                </>
                            )}

                            <div className="options">
                                {q.options.map((opt, j) => (
                                    <div key={j} className="option-item">
                                        {String.fromCharCode(65 + j)})  
                                        <input
                                            value={opt.text}
                                            onChange={(e) =>
                                                updateOption(i, j, e.target.value)
                                            }
                                            style={{marginLeft:"0.5rem", padding:'1rem'}}
                                        />

                                        {opt.image && (
                                            <>
                                                <img
                                                    src={opt.image}
                                                    alt=""
                                                    loading="lazy"
                                                    style={{ width: `${opt.imgWidth}px` }}
                                                    onError={(e) =>
                                                        (e.target.style.display = "none")
                                                    }
                                                />
                                                <div className="no-print resize-box">
                                                    Width:
                                                    <input
                                                        type="number"
                                                        value={opt.imgWidth}
                                                        onChange={(e) =>
                                                            updateOptionImageWidth(i, j, e.target.value)
                                                        }
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}

                    <div className="no-print buttons">
                        <button onClick={() => setShowAnswerSheet(true)}>
                            Answer Sheet
                        </button>
                        <button onClick={() => window.print()}>
                            Print Final Exam
                        </button>
                    </div>
                </div>
            )}

            {/* ===== ANSWER SHEET POPUP ===== */}
            {showAnswerSheet && (
                <div className="answer-overlay">
                    <div className="answer-popup">
                        <h3>Answer Sheet</h3>
                        <div className="answer-grid">
                            {generatedPaper.map((q, i) => (
                                <div key={i} className="answer-box">
                                    {i + 1} - {q.answer}
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowAnswerSheet(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}