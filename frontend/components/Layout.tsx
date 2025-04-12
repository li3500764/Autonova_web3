import { ReactNode } from 'react'
import Head from 'next/head'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>DAO 提案系统</title>
        <meta name="description" content="去中心化自治组织提案平台" />
      </Head>
      <div className="min-h-screen gradient-bg">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </>
  )
}