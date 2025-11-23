
-- Create the rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  elements TEXT NOT NULL,
  randomUsername TEXT NOT NULL,
  isShared BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on randomUsername for faster queries
CREATE INDEX idx_rooms_username ON rooms(randomUsername);

-- Create an index on isShared for filtering shared rooms
CREATE INDEX idx_rooms_isShared ON rooms(isShared);

-- Create a composite index for the isRoomOwner query
CREATE INDEX idx_rooms_username_shared ON rooms(randomUsername, isShared);