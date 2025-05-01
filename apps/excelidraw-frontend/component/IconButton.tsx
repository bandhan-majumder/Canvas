import { LineChart } from 'lucide-react'
import React from 'react'

export function IconButton({ icon, onClick, activated }: { icon: React.ReactNode, onClick: () => void, activated: boolean }) {
  return <div className={`cursor-pointer rounded-full border p-2 bg-black hover:bg-[#4F4D6F] ${activated ? "text-red-400" : "text-white"}`} onClick={onClick}>{icon}</div>
}
