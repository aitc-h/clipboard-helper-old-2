import React = require('react');
import { render } from 'react-dom';
import './style.css';
import { nanoid } from 'nanoid';

interface ButtonData {
  text: string;
  id: string;
  row: number;
  col: number;
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
    { text: 'abc', id: nanoid(), row: 0, col: 0 },
    { text: 'def', id: nanoid(), row: 0, col: 1 },
    { text: 'foo', id: nanoid(), row: 1, col: 0 },
    { text: 'bar', id: nanoid(), row: 2, col: 0 },
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

  function addRow() {
    setButtons((prevState: ButtonData[]) => [
      ...prevState,
      {
        text: '',
        id: nanoid(),
        row:
          buttons
            .map((e) => e.row)
            .sort()
            .slice(-1)[0] + 1,
        col: 0,
      },
    ]);
  }

  function addButton(row: number) {
    setButtons((prevState: ButtonData[]) => {
      let col =
        prevState
          .filter((button) => button.row == row)
          .map((button) => button.col)
          .sort()
          .splice(-1)[0] + 1;
      return [
        ...prevState,
        {
          text: '',
          id: nanoid(),
          row: row,
          col: col,
        },
      ];
    });
  }

  /* Components */
  const buttonView = (
    <div>
      {/* For each unique row number */}
      {[...new Set(buttons.map((e) => e.row))].sort().map((rowNumber) => (
        <div className="button-row">
          {editMode ? <button>X</button> : null}
          {buttons
            .filter((e) => e.row == rowNumber)
            .sort((a, b) => a.col - b.col)
            .map((button) => (
              <Button
                data={button}
                editMode={editMode}
                setButtonText={setButtonText}
                copyToClipboard={setCurrentClipboard}
              />
            ))}
          {editMode ? (
            <button
              onClick={() => {
                addButton(rowNumber);
              }}
            >
              +
            </button>
          ) : null}
        </div>
      ))}
      {editMode ? <button onClick={addRow}>+ Add Row</button> : null}
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

  const editButton = (
    <button
      onClick={() => {
        setEditMode(!editMode);
      }}
    >
      Edit
    </button>
  );

  return (
    <div>
      <div>Current clipboard: {currentClipboard}</div>
      <br />
      <div className="button-list">{buttonView}</div>
      <br />
      {saveButton}
      {editButton}
    </div>
  );
}

render(<App />, document.getElementById('root'));
