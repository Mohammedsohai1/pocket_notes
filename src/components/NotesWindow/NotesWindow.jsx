import React, { useState, useEffect } from 'react';
import styles from './NotesWindow.module.scss';
import sendIcon from '../../assets/sendIcon.png';
import sendIconColored from '../../assets/sendIconColored.png';
import { useAppContext } from '../AppContext';
import { v4 as uuidv4 } from 'uuid';
import FormattedDate from '../../Utils/Date';
import FormattedTime from '../../Utils/Time';
import { useNavigate } from 'react-router-dom';
import backArrow from '../../assets/backArrow.png';

const NotesWindow = () => {
  const [text, setText] = useState('');
  const { selectedGroup } = useAppContext();
  const [notes, setNotes] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedGroup && selectedGroup.groupName) {
      const storedNotes = JSON.parse(localStorage.getItem(`notesOf ${selectedGroup.groupName}`)) || [];
      setNotes(storedNotes);
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedGroup && selectedGroup.groupName) {
      localStorage.setItem(`notesOf ${selectedGroup.groupName}`, JSON.stringify(notes));
    }
  }, [notes, selectedGroup]);

  const handleSend = () => {
    if (text.trim() !== '') {
      const newNote = {
        id: uuidv4(),
        text,
        timeStamp: FormattedTime(),
        dateStamp: FormattedDate(),
      };

      setNotes((prevNotes) => [...prevNotes, newNote]);
      setText('');
    }
  };

  const changeHandler = (e) => {
    setText(e.target.value);
  };

  const circleColor = {
    backgroundColor: selectedGroup ? selectedGroup.color : 'initial',
  };

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        {isMobile ? (
          <img
            src={backArrow}
            alt=""
            className={styles.backArrow}
            onClick={() => navigateToHome()}
          />
        ) : null}
        <div className={styles.circle} style={circleColor}>
          <p className={styles.shortName}>{selectedGroup ? selectedGroup.upperCaseName : ''}</p>
        </div>
        <p className={styles.groupName}>{selectedGroup ? selectedGroup.groupName : ''}</p>
      </div>
      <div className={styles.body}>
        <div className={styles.notesContainer}>
          {notes.map((note) => (
            <div key={note.id} className={styles.note}>
              {note.text}
              <div className={styles.dateAndTimeContainer}>
                <p className={styles.dateAndTime}>{note.dateStamp}</p>
                <p className={styles.seperator}></p>
                <p className={styles.dateAndTime}>{note.timeStamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <textarea
          className={styles.textBox}
          placeholder='Enter your text here...........'
          value={text}
          onChange={(e) => changeHandler(e)}
        ></textarea>
        {text ? (
          <img
            src={sendIconColored}
            alt=""
            className={styles.button}
            onClick={handleSend}
          />
        ) : (
          <img src={sendIcon} alt="" className={styles.button} />
        )}
      </div>
    </div>
  );
};

export default NotesWindow;
