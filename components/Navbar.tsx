import React from "react"
import Image from "next/image"
import Link from "next/link"
import { GoogleLogin, googleLogout } from "@react-oauth/google"
import { createOrGetUser } from "../utils"
import { useRouter } from "next/router"
import { AiOutlineLogout } from "react-icons/ai"
import { BiSearch } from "react-icons/bi"
import { IoMdAdd } from "react-icons/io"

import Logo from "../utils/logo.png"

const Navbar = () => {
  const user = null

  return (
    <div className='w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4'>
      <Link href='/'>
        <div className='w-[100px] md:w-[130px]'>
          <Image
            className='cursor-pointer'
            src={Logo}
            alt='logo'
            layout='responsive'
          />
        </div>
      </Link>
      <div className=''>SEARCH</div>
      <div className=''>
        {user ? (
          <div>Logged in</div>
        ) : (
          <GoogleLogin
            onSuccess={response => {
              createOrGetUser(response)
            }}
            onError={() => {
              console.log("error")
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Navbar
