import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "./App.css";

function App() {
  const [examData, setExamData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [count, setCount] = useState(1);

  const contentURL =
    "https://docs.google.com/spreadsheets/d/1q_Qc184RvL0QYzMRDR93bjKPcpnIH1XIJ8yUOkVkwyI/export?format=csv&gid=0";

  const questionURL =
    "https://docs.google.com/spreadsheets/d/1q_Qc184RvL0QYzMRDR93bjKPcpnIH1XIJ8yUOkVkwyI/export?format=csv&gid=1898958849";

  useEffect(() => {
    Promise.all([
      fetch(contentURL).then(res => res.text()),
      fetch(questionURL).then(res => res.text())
    ]).then(([contentCSV, questionCSV]) => {

      const contents = Papa.parse(contentCSV, { header: true }).data;
      const questions = Papa.parse(questionCSV, { header: true }).data;

      const finalData = contents.map(content => ({
        ...content,
        questions: questions
          .filter(q => q.content_id === content.id)
          .map(q => ({
            question: q.question,
            options: [q.option1, q.option2, q.option3, q.option4],
            answer: q.answer
          }))
      }));

      setAllData(finalData);
    });
  }, []);

  // Random selection function
  const generateExam = () => {
    const shuffled = [...allData].sort(() => 0.5 - Math.random());
    setExamData(shuffled.slice(0, count));
  };

  return (
    <div className="exam-container">

      <div className="top-bar">
        <input
          type="number"
          value={count}
          min="1"
          onChange={(e) => setCount(Number(e.target.value))}
          placeholder="Kitne Anuched?"
        />
        <button onClick={generateExam}>Generate Exam</button>
      </div>

      {examData.map((item, index) => (
        <div key={index} className="card">
          <h2>{item.title}</h2>
          <p className="passage">{item.text}</p>

          {item.questions.map((q, i) => (
            <div key={i} className="question-block">
              <p><strong>Q{i + 1}.</strong> {q.question}</p>

              {q.options.map((opt, j) => (
                <label key={j} className="option">
                  <input type="radio" name={`q${i}`} />
                  {opt}
                </label>
              ))}
            </div>
          ))}
        </div>
      ))}

    </div>
  );
}

export default App;