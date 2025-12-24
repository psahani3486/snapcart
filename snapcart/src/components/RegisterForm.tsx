"use client"
import { ArrowLeft, EyeIcon, EyeOff, Key, Leaf, Loader2, Lock, LogIn, Mail, User } from 'lucide-react'
import React, { useState } from 'react'
import {motion} from "motion/react"
import Image from 'next/image'
import googleImage from "@/assets/google.png"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
type propType={
previousStep:(s:number)=>void
}
function RegisterForm({previousStep}:propType) {
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [role,setRole]=useState("user")
    const [showPassword,setShowPassword]=useState(false)
    const [loading,setLoading]=useState(false)
    const router= useRouter()
    const handleRegister=async (e:React.FormEvent)=>{
        e.preventDefault()
        setLoading(true)
        try {
            const result=await axios.post("/api/auth/register",{
              name,email,password,role
            })
            router.push("/login")
            setLoading(false)
        } catch (error) {
          // log full response body when available
          // eslint-disable-next-line no-console
          console.log(error)
          // @ts-ignore
          if (error?.response?.data) console.log("server response:", error.response.data)
            setLoading(false)
        }
    }
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative'>
      <div className='absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors cursor-pointer '
      onClick={()=>previousStep(1)}
      >
        <ArrowLeft className='w-5 h-5'/>
        <span className='font-medium'>Back</span>
      </div>
      <motion.h1
      initial={{
        y:-10,
        opacity:0
      }}
      animate={{
         y:0,
        opacity:1
      }}
      transition={{
        duration:0.6
      }}
       className='text-4xl font-extrabold text-green-700 mb-2'>Create Account</motion.h1>
       <p className='text-gray-600 mb-8 flex items-center'>Join Snapcart today <Leaf className='w-5 h-5 text-green-600'/></p>
       <motion.form
       onSubmit={handleRegister}
       initial={{
        opacity:0
      }}
      animate={{
        opacity:1
      }}
      transition={{
        duration:0.6
      }} className='flex flex-col gap-5 w-full max-w-sm'>

      <div className='relative'>
        <User className='absolute left-3 top-3.5 w-5 h-5 text-gray-400'/>
        <input type="text" placeholder='Your Name' className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none'
        onChange={(e)=>setName(e.target.value)}
        value={name}
        />
       </div>
       <p className='text-xs text-red-500 mt-1' hidden={/^[A-Za-z\s]+$/.test(name) || name===""}>Name must contain only letters and spaces</p>
        <div className='relative'>
        <Mail className='absolute left-3 top-3.5 w-5 h-5 text-gray-400'/>
        <input type="email" placeholder='Your Email' className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none'
        onChange={(e)=>setEmail(e.target.value)}
        value={email}
        />
        <p className='text-xs text-red-500 mt-1' hidden={/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email===""}>Enter a valid email</p>
        </div> 
        <div className='relative'>
        <Lock className='absolute left-3 top-3.5 w-5 h-5 text-gray-400'/>
        <input type={showPassword?"text":"password"} placeholder='Your Password' className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none'
        onChange={(e)=>setPassword(e.target.value)}
        value={password}
        />
        <p className='text-xs text-red-500 mt-1' hidden={(/^[A-Za-z0-9]+$/.test(password) && password.length>=6) || password===""}>Password must be alphanumeric and at least 6 characters</p>
        {
            showPassword?<EyeOff className='absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer' onClick={()=>setShowPassword(false)}/>:<EyeIcon className='absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer'  onClick={()=>setShowPassword(true)}/>
        }
        </div> 

        <div className='relative'>
          <label className='block text-sm text-gray-600 mb-1'>Select role</label>
          <select value={role} onChange={(e)=>setRole(e.target.value)} className='w-full border border-gray-300 rounded-xl py-3 pl-4 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none'>
            <option value="user">User</option>
            <option value="deliveryBoy">Delivery Boy</option>
            <option value="admin">Admin</option>
          </select>
        </div>

{
   (()=>{
  const nameValid = /^[A-Za-z\s]+$/.test(name)
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const passwordValid = /^[A-Za-z0-9]+$/.test(password) && password.length>=6
  const formValidation = nameValid && emailValid && passwordValid
    return <button disabled={!formValidation || loading} className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${
          formValidation 
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}>
{loading?<Loader2 className='w-5 h-5 animate-spin'/>:"Register"}
            
    </button>
  })()
}

<div className='flex items-center gap-2 text-gray-400 text-sm mt-2'>
    <span className='flex-1 h-px bg-gray-200'></span>
    OR
    <span className='flex-1 h-px bg-gray-200'></span>
</div>

<div className='w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200' onClick={()=>signIn("google",{callbackUrl:"/"})}>
    <Image src={googleImage} width={20} height={20} alt='google'/>
    Continue with Google
</div>
 
       </motion.form>

       <p className='cursor-pointer text-gray-600 mt-6 text-sm flex items-center gap-1' onClick={()=>router.push("/login")}>Already have an account ? <LogIn className='w-4 h-4'/> <span className='text-green-600'> Sign in</span></p>
    </div>
  )
}

export default RegisterForm
