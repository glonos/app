import React, { useState, useEffect } from 'react';
import Messages from './Messages'
import './App.css';
import { Glonos } from 'glonos'
import { composeAPI } from '@iota/core'
import CircularProgress from '@material-ui/core/CircularProgress';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 4),
    outline: 'none',
  },
}));


function App() {
  const classes = useStyles();

  const glonos = new Glonos(composeAPI({ provider: 'https://nodes.thetangle.org:443' }));

  const [location, setLocation] = useState('');
  const [open, setOpen] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [geolocation, setGeolocation] = useState(undefined);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSend = () => {
    async function send() {
      setSending(true);
      await glonos.generate({ lat: geolocation.latitude, long: geolocation.longitude }, title, content);
      setSending(false);
      handleClose();
    }

    send();
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async pos => {
        const data = glonos.locationTag({ lat: pos.coords.latitude, long: pos.coords.longitude })
        setLocation(data);
        setGeolocation(pos.coords);
      })
    }
    const handle = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async pos => {
          const data = glonos.locationTag({ lat: pos.coords.latitude, long: pos.coords.longitude })
          if (location !== data) {

            setLocation(data)
            setGeolocation(pos.coords);
          }
        })
      }
    }, 5000);

    return () => {
      clearInterval(handle);
    }

  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={handleClose}
        >

          <div style={modalStyle} className={classes.paper}>
            <div>
              <TextField
                id="outlined-name"
                label="Title"
                //className={classes.textField}
                value={title}
                onChange={(event) => { setTitle(event.target.value) }}
                margin="normal"

                variant="outlined"
              />
            </div>
            <div>

              <TextField
                id="outlined-name"
                label="Content"
                //className={classes.textField}
                value={content}
                onChange={(event) => { setContent(event.target.value) }}
                margin="normal"
                variant="outlined"
                multiline={true}
              />

            </div>
            <Fab color="primary" aria-label="Send" onClick={handleSend}>
              {sending ? <CircularProgress /> :
                <SendIcon />
              }
            </Fab>
            <h2 id="modal-title">Text in a modal</h2>
            <p id="simple-modal-description">
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </p>

          </div>
        </Modal>
        <Messages glonos={glonos} location={location} />
        <Fab color="primary" aria-label="Add" onClick={handleOpen}>
          <AddIcon />
        </Fab>
        <p>
          Your location is {location}
        </p>
      </header>
    </div>
  );
}

export default App;
