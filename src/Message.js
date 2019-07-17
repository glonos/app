import React, { useState, useEffect } from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

function Message(props) {
  const { message, timestamp } = props;
  console.log(message)
  const { title, content, } = message;
  const d = new Date(timestamp * 1000);
  return (

    <Card >
      <CardHeader
        title={title || 'no title'}
        subheader={d.toDateString() + ' ' + d.toLocaleTimeString()}
      />
      <CardContent>
        <Typography component="p">
          {content || 'no content'}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Message;