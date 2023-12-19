import React, { useState } from "react";

import "./styles/Faq.css";

import questions from "../config/faqConfig.json";

const Faq = () => {
    const [openQuestions, setOpenQuestions] = useState({});

    const toggleQuestion = (id) => {
        setOpenQuestions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <main className="faq">
            <h1>FAQ</h1>
            <div className="faq-container">
                {questions.map(({ id, question, answer }) => (
                    <div key={id} onClick={() => toggleQuestion(id)}>
                        <div className="faq-question">
                            {question}
                            <span>{openQuestions[id] ? '-' : '+'}</span>
                        </div>
                        {openQuestions[id] && <div className="faq-answer">{answer}</div>}
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Faq;