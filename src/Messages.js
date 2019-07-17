import React, { useState, useEffect } from 'react';
import Message from './Message'

function Messages(props) {
  const { glonos, location } = props;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log("EFFECT")
    if (location !== "")
      glonos.find(location).then(results => {
        setMessages(results);
      });
    const handle = setInterval(async () => {
      if (location !== "") {
        const results = await glonos.find(location);
        setMessages(results);

      }
    }, 10000);


    return () => { clearInterval(handle) }
  }, [location]);

  const renderItems = () => {
    return messages.map((data, i) => <Message key={i} message={data.message} timestamp={data.timestamp} />)
  }

  return (<div>
    {messages.length === 0 ? "LOADING" : renderItems()}

  </div>
  )
}

export default Messages