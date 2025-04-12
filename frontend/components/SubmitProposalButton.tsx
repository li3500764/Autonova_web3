'use client'
import { useState } from 'react'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import SubmitProposalModal from './SubmitProposalModal'

export default function SubmitProposalButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 提交提案的处理函数，后续可接入智能合约或者 API
  function handleSubmit(proposalText: string) {
    console.log("提交提案：", proposalText)
    // TODO: 调用后端接口或合约方法提交提案
  }

  return (
    <>
      <button 
        className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all"
        onClick={()=> setIsModalOpen(true)}
      >
        <PlusCircleIcon className="h-5 w-5" />
        新提案
      </button>
      <SubmitProposalModal 
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSubmit={handleSubmit}
      />
    </>
  )
}