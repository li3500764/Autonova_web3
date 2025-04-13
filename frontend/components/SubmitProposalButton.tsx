'use client'
import { useState, useEffect } from 'react'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { useAccount } from 'wagmi'
import { checkIsManager } from '@/pages/api/daoContract'
import SubmitProposalModal from './SubmitProposalModal'

export default function SubmitProposalButton() {
  const { address } = useAccount()
  const [isManager, setIsManager] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // 检查管理员权限
  useEffect(() => {
    const checkManagerStatus = async () => {
      if (address) {
        try {
          const managerStatus = await checkIsManager(address)
          setIsManager(managerStatus)
        } catch (error) {
          console.error('Failed to check administrator privileges.', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
    checkManagerStatus()
  }, [address])

  // 提交提案的处理函数
  async function handleSubmit(proposalText: string) {
    // TODO: 调用合约方法提交提案
    console.log("提交提案：", proposalText)
  }

  if (loading) {
    return (
      <div className="h-10 w-24 bg-gray-800/50 rounded-lg animate-pulse" />
    )
  }

  if (!isManager) {
    return null // 非管理员不渲染按钮
  }

  return (
    <>
      <button 
        className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all"
        onClick={() => setIsModalOpen(true)}
      >
        <PlusCircleIcon className="h-5 w-5" />
        New Proposal
      </button>
      <SubmitProposalModal 
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
    </>
  )
}