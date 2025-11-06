import { getElementsByRoomId } from "@/lib/supabase/action";
import { redirect } from "next/navigation";
import RoomClient from "@/components/RoomClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RoomPage({ params }: Props) {
  const param = await params;
  const room = param.id;

  let elements;
  // checks if it's a valid roomId or not
  try {
    elements = await getElementsByRoomId(room);
  } catch {
    // that room does not exist
    redirect("/");
  }

  return <RoomClient roomId={room} initialElements={elements || []} />;
}
