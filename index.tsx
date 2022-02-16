import React = require('react');
import { render } from 'react-dom';
import './style.css';
import { nanoid } from 'nanoid';

interface ButtonData {
  text: string;
  id: string;
  row: number;
}

interface ButtonProps {
  editMode: boolean;
  data: ButtonData;
  setButtonText: (id: string, text: string) => void;
  copyToClipboard: (text: string) => void;
}

function Button(props: ButtonProps) {
  const handleClick = () => props.copyToClipboard(props.data.text);
  const handleChange = (e) =>
    props.setButtonText(props.data.id, e.target.value);

  return props.editMode ? (
    <input value={props.data.text} onChange={handleChange} />
  ) : (
    <button onClick={handleClick}>{props.data.text}</button>
  );
}

interface AppProps {}
function App(props: AppProps) {
  /* State */
  const [editMode, setEditMode] = React.useState(false);
  const [currentClipboard, setCurrentClipboard] = React.useState('');
  const [buttons, setButtons] = React.useState([
    { text: 'abc', id: nanoid(), row: 0 },
    { text: 'def', id: nanoid(), row: 0 },
    { text: 'foo', id: nanoid(), row: 1 },
    { text: 'bar', id: nanoid(), row: 2 },
  ] as ButtonData[]);

  /* Callback functions */
  function setButtonText(id: string, text: string) {
    let i = buttons.findIndex((b) => b.id == id);
    setButtons((prevState: ButtonData[]) => {
      let newState = [...prevState];
      newState[i].text = text;
      return newState;
    });
  }

  /* Components */
  const buttonView = (
    <div>
      {[...new Set(buttons.map((e) => e.row))].sort().map((rowNumber) => (
        <div className="button-row">
          {buttons
            .filter((e) => e.row == rowNumber)
            .map((button) => (
              <Button
                data={button}
                editMode={editMode}
                setButtonText={setButtonText}
                copyToClipboard={setCurrentClipboard}
              />
            ))}
        </div>
      ))}
    </div>
  );

  const saveButton = (
    <button
      onClick={() => {
        console.log('save');
      }}
    >
      Save
    </button>
  );

  return (
    <div>
      <div>Current clipboard: {currentClipboard}</div>
      <br />
      <div className="button-list">{buttonView}</div>
      <br />
      {saveButton}
      <button
        onClick={() => {
          setEditMode(!editMode);
        }}
      >
        Edit
      </button>
    </div>
  );
}

render(<App />, document.getElementById('root'));
