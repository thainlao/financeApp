import { useNavigate } from 'react-router-dom';
import './FAQ.css';
import { useState } from 'react';

const FAQ = () => {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const toggleAnswer = () => {
        setIsOpen(!isOpen);
    };

    const [isOpen2, setIsOpen2] = useState(false);
    const toggleAnswer2 = () => {
        setIsOpen2(!isOpen2);
    };

    const [isOpen3, setIsOpen3] = useState(false);
    const toggleAnswer3 = () => {
        setIsOpen3(!isOpen3);
    };

    return (
        <div className="setting">
            <div className='sett'>
                <h5>FAQ</h5>
                <h5 onClick={() => navigate('/')}>ВЕРНУТЬСЯ К ФИНАНСАМ</h5>
            </div>
            <h2>Актуальные вопросы / ответы</h2>

            <div className='faq-item'>
                <div className='faq-question' onClick={toggleAnswer}>
                    <span>Какие технологии использовались?</span>
                    <span className={`arrow ${isOpen ? 'open' : ''}`}>&#9660;</span>
                </div>
                {isOpen && (
                    <div className='faq-answer'>
                        <p>Frontend: React, Typescript, CSS, Redux, Redux Toolkit</p>
                        <p>Backend: NOSQL(MongoDB) Nest JS</p>
                    </div>
                )}
            </div>

            <div className='faq-item'>
                <div className='faq-question' onClick={toggleAnswer2}>
                    <span>Для чего создан сервис?</span>
                    <span className={`arrow ${isOpen2 ? 'open' : ''}`}>&#9660;</span>
                </div>
                {isOpen2 && (
                    <div className='faq-answer'>
                        <p>Данное приложение создано для отслеживание своих доходов / расходов и ведения учетов инвестиций.</p>
                    </div>
                )}
            </div>

            <div className='faq-item'>
                <div className='faq-question' onClick={toggleAnswer3}>
                    <span>Все ссылки данного проекта</span>
                    <span className={`arrow ${isOpen3 ? 'open' : ''}`}>&#9660;</span>
                </div>
                {isOpen3 && (
                    <div className='faq-answer'>
                        <p>github: <a href='google.com'>link</a></p>
                        <p>автор: <a href='google.com'>link</a></p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FAQ;