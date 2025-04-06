"use client"
import Image from "next/image"
import LoginForm from '@/components/forms/login-form'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-lg overflow-hidden">
          <div className="p-10 flex items-center justify-center">
            <LoginForm />
          </div>
          <div className="relative h-full min-h-[400px] md:min-h-[600px]">
            <Image src="/background.png" alt="Modern IRM office building" fill style={{ objectFit: "cover" }} priority />
          </div>
        </div>
      </div>
    </div>
  )
}