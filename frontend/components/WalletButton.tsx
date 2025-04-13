'use client'
import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { checkIsMember, joinDAO } from '@/pages/api/daoContract'
import toast from 'react-hot-toast'

export default function WalletButton() {
  const { address, isConnected } = useAccount()
  const [isMember, setIsMember] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 修复hydration错误的关键
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const checkMembership = async () => {
      if (isConnected && address) {
        try {
          const memberStatus = await checkIsMember(address)
          setIsMember(memberStatus)
        } catch (error) {
          console.error('Failed to check membership status:', error)
          setIsMember(null)
        }
      }
    }
    checkMembership()
  }, [isConnected, address])

  const handleJoinDAO = async () => {
    console.log('Joining DAO initiated')
    setIsLoading(true)
    try {
      console.log('Attempting to join DAO')
      await joinDAO()
      setIsMember(true)
      toast.success('Successfully joined DAO!')
    } catch (error) {
      console.log('DAO join failed')
      toast.error(`Join failed: ${(error as Error).message}`);
    } finally {
      console.log('Join process completed')
      setIsLoading(false)
    }
  }

  if (!mounted) {
    // 服务端渲染时返回空div保持一致性
    return <div className="h-10 w-32" /> 
  }

  if (!isConnected) {
    return (
      <ConnectButton
        accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
        chainStatus="none"
        showBalance={false}
        label="Connect Governance Account"
      />
    )
  }

  return (
    <div className="relative">
      <ConnectButton
        accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
        chainStatus="none"
        showBalance={false}
      />

      {isConnected && isMember === false && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg p-4 z-50">
          <p className="text-white mb-4">You are not a DAO member yet. Join now?</p>
          <div className="flex gap-2">
            <button
              onClick={handleJoinDAO}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Join DAO'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}