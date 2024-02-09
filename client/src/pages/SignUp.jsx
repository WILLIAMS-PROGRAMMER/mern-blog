import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SignUp() {

  // State
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  // Hooks for navigation (to redirect the user to another page)
  const navigate = useNavigate();

  const handleChange = (e) => {          //trim removes white spaces
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() }); // Spread the previous state and add the new value
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submit ,so the page won't refresh
    if(!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill in all fields');
    }
    try {
      setLoading(true); // here we are starting the loading state
      setErrorMessage(null); // Reset the error message because we are trying to submit the form again
      const res = await fetch('/api/auth/signup', {
        method: 'POST', // POST because we are sending data to the server
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Convert the object to a JSON string
      });
      const data = await res.json();
      if(data.success === false) {
        setErrorMessage(data.message);
      }
      setLoading(false); // here we are stopping the loading state
      if(res.ok) {
        navigate('/sign-in');
      }
      //check network tab for response
    } catch (error) {
        setErrorMessage(error.message);
        setLoading(false); // here we are stopping the loading state
    }
  }
  
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
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <div>
                <Label value='Your username' htmlFor='username' />
                <TextInput type='text' placeholder='Username' id='username' onChange={handleChange} />
              </div>
              <div>
                <Label value='Your email' htmlFor='email' />
                <TextInput type='email' placeholder='name@company.com' id='email' onChange={handleChange} />
              </div>
              <div>
                <Label value='Your password' htmlFor='password' />
                <TextInput type='password' placeholder='Password' id='password' onChange={handleChange} />
              </div>
              <Button gradientDuoTone='purpleToPink' pill type='submit' disabled={loading} >
                  {
                    loading ? (
                      <>
                      <Spinner size='sm' />
                      <span className='pl-3'>Loading...</span>
                      </>
                    ) : 'Sign Up'
                  }
              </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className='text-purple-500'>
              Sign In
            </Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure' pill>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}
