'use client'
import { Dialog } from '@headlessui/react'
import { useEffect } from 'react'

interface FundModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  balance: string
  isManager: boolean
  onWithdraw?: () => void
}

export default function FundModal({ 
  isOpen, 
  setIsOpen, 
  balance, 
  isManager,
  onWithdraw 
}: FundModalProps) {
  // 禁用背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 自定义遮罩层 - 替代 Dialog.Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="relative bg-gray-900 border border-purple-500/30 rounded-xl max-w-md w-full p-8 z-50">
          {/* 关闭按钮 */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6">
            Community public fund
          </h2>
          
          {/* 货币符号设计 */}
          <div className="relative flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center border-2 border-purple-500/20">
              <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
                $
              </span>
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/10 animate-pulse pointer-events-none"></div>
            </div>
          </div>
          
          {/* 余额显示 */}
          <div className="text-center mb-8">
            <p className="text-gray-400 mb-1">Current available balance</p>
            <p className="text-4xl font-mono text-blue-300">
              {balance} <span className="text-purple-300">ETH</span>
            </p>
          </div>
          
          {/* 管理员操作区 */}
          {isManager && (
            <div className="mt-6 border-t border-gray-800 pt-6">
              <button
                onClick={() => {
                  onWithdraw?.()
                  setIsOpen(false)
                }}
                className="w-full py-3 bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg"
              >
                Withdraw funds
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}