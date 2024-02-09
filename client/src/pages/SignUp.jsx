import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left size */}
        <div className='flex-1'>
          <Link to="/" className=' font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Williams</span>
            Blog
          </Link>
          <p className='text-sm mt-5 font-medium'>This is a personal Blog. You can sign in with your email and password or with Google.</p>
        </div>

        {/* right size */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4'>
              <div>
                <Label value='Your username' htmlFor='username' />
                <TextInput type='text' placeholder='Username' id='username' />
              </div>
              <div>
                <Label value='Your email' htmlFor='email' />
                <TextInput type='text' placeholder='name@company.com' id='email' />
              </div>
              <div>
                <Label value='Your password' htmlFor='password' />
                <TextInput type='text' placeholder='Password' id='password' />
              </div>
              <Button gradientDuoTone='purpleToPink' pill type='submit' >
                Sign Up
              </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className='text-purple-500'>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
