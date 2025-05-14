import Authentication from '@/component/Auth'
import React from 'react'

function SignUp() {
  return (
    <div>
      <Authentication isSignIn={false} />
    </div>
  )
}

export default SignUp