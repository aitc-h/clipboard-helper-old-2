import React = require('react');
import { useState, useEffect } from 'react';
import { render } from 'react-dom';
import './style.css';
import { nanoid } from 'nanoid';

const EXAMPLE_DATA = [
  { text: 'abc', id: nanoid(), row: 0, col: 0 },
  { text: 'def', id: nanoid(), row: 0, col: 1 },
  { text: 'foo', id: nanoid(), row: 1, col: 0 },
  { text: 'bar', id: nanoid(), row: 2, col: 0 },
] as ButtonData[];

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

function ConditionalButton(props: {
  text: string;
  conditional: boolean;
  onClick?: (arg0: any) => void;
}) {
  if (props.conditional) {
    return <button onClick={props.onClick}>{props.text}</button>;
  } else {
    return null;
  }
}

interface AppProps {}
function App(props: AppProps) {
  /* State */
  const [editMode, setEditMode] = useState(false);
  const [currentClipboard, setCurrentClipboard] = useState('');

  const [listID, setListID] = useState(() => {
    const saved = localStorage.getItem('listID');
    const initialValue = JSON.parse(saved);
    return initialValue || nanoid();
  });
  const [buttons, setButtons] = useState(() => {
    const saved = localStorage.getItem(listID);
    const initialValue = JSON.parse(saved) as ButtonData[];
    return initialValue || EXAMPLE_DATA;
  });

  /* Callback functions */
  function setButtonText(id: string, text: string) {
    let i = buttons.findIndex((b) => b.id == id);
    setButtons((prevState: ButtonData[]) => {
      let newState = [...prevState];
      newState[i].text = text;
      return newState;
    });
  }

  function addButtonToRow(row: number) {
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

  function deleteButton(id: string) {
    setButtons((prevState: ButtonData[]) =>
      prevState.filter((e) => e.id != id)
    );
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

  function deleteRow(row: number) {
    setButtons((prevState: ButtonData[]) =>
      prevState.filter((e) => e.row != row)
    );
  }

  function save() {
    localStorage.setItem('listID', listID);
    localStorage.setItem(listID, JSON.stringify(buttons));
  }

  /* Components */
  const buttonView = (
    <div>
      {/* For each unique row number */}
      {[...new Set(buttons.map((e) => e.row))].sort().map((rowNumber) => (
        <div className="button-row">
          <ConditionalButton
            conditional={editMode}
            text="X Delete Row"
            onClick={() => deleteRow(rowNumber)}
          />
          {buttons
            .filter((e) => e.row == rowNumber)
            .sort((a, b) => a.col - b.col)
            .map((button) => (
              <div className="button">
                <ConditionalButton
                  conditional={editMode}
                  text="X"
                  onClick={() => deleteButton(button.id)}
                />
                <Button
                  data={button}
                  editMode={editMode}
                  setButtonText={setButtonText}
                  copyToClipboard={setCurrentClipboard}
                />
              </div>
            ))}
          <ConditionalButton
            text="+"
            conditional={editMode}
            onClick={() => {
              addButtonToRow(rowNumber);
            }}
          />
        </div>
      ))}
      <ConditionalButton
        conditional={editMode}
        text="+ Add Row"
        onClick={addRow}
      />
    </div>
  );

  const saveButton = <button onClick={save}>Save</button>;

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
