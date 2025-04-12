
import { useState } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'

export default function VoteButton() {
  const [voted, setVoted] = useState<'yes'|'no'|null>(null)

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setVoted('yes')}
        className={`p-2 rounded-lg ${voted === 'yes' 
          ? 'bg-green-500/20 border border-green-500/50'
          : 'bg-white/5 hover:bg-white/10'}`}
      >
        <CheckIcon className="h-6 w-6 text-green-400" />
      </button>
      <button
        onClick={() => setVoted('no')}
        className={`p-2 rounded-lg ${voted === 'no' 
          ? 'bg-red-500/20 border border-red-500/50'
          : 'bg-white/5 hover:bg-white/10'}`}
      >
        <XMarkIcon className="h-6 w-6 text-red-400" />
      </button>
    </div>
  )
}