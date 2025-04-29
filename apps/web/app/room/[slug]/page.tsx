import React from 'react'
import axios from 'axios';
import { BACKEND_URL } from '../../config';
import { ChatRoom } from '../../../components/ChatRoom';

async function getRoom(slug: string) {
  const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
  return response.data.room.id;
}

async function Room({
  params
}: {
  params: {
    slug: string
  }
}) {

  const slug = (await params).slug;
  const roomId = await getRoom(slug)
  return (
    <div>
      <ChatRoom id={roomId} />
    </div>
  )
}

export default Room