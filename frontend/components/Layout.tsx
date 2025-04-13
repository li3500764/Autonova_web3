import { ReactNode } from 'react'
import Head from 'next/head'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>DAO Proposal System</title>
        <meta name="description" content="Decentralized Autonomous Organization Proposal Platform" />
      </Head>
      <div className="min-h-screen gradient-bg">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </>
  )
}