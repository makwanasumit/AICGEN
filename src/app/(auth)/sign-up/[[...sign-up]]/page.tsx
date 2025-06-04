'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'
import Image from 'next/image'

export default function SignUpPage() {
  return (
    <div className="grid h-full w-full flex-grow items-center bg-black px-4 sm:justify-center">
      <SignUp.Root>
        <SignUp.Step
          name="start"
          className="w-full flex-grow space-y-6 rounded-2xl bg-neutral-900 bg-[radial-gradient(circle_at_50%_0%,theme(colors.white/10%),transparent)] px-4 py-10 ring-1 ring-inset ring-white/5 sm:w-96 sm:px-8"
        >
          <header className="text-center">
            <div className='relative w-20 h-20 mx-auto'>
              <Image src="/AICGEN.png" alt="Logo" fill className='object-cover' />
            </div>
            <h1 className="mt-4 text-xl font-medium tracking-tight text-white">
              Create your AICGEN account
            </h1>
          </header>

          <Clerk.GlobalError className="block text-sm text-red-400" />

          <div className="space-y-2">
            <Clerk.Connection
              name="google"
              className="flex w-full items-center justify-center gap-x-3 rounded-md bg-neutral-700 px-3.5 py-2.5 text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/5%)_inset,0_0_0_1px_theme(colors.white/2%)_inset] outline-none hover:bg-gradient-to-b hover:from-white/5 hover:to-white/5 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-white active:bg-gradient-to-b active:from-black/20 active:to-black/20 active:text-white/70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 16"
                className="w-4"
                aria-hidden
              >
                <path
                  fill="currentColor"
                  d="M8.82 7.28v2.187h5.227c-.16 1.226-.57 2.124-1.192 2.755-.764.765-1.955 1.6-4.035 1.6-3.218 0-5.733-2.595-5.733-5.813 0-3.218 2.515-5.814 5.733-5.814 1.733 0 3.005.685 3.938 1.565l1.538-1.538C12.998.96 11.256 0 8.82 0 4.41 0 .705 3.591.705 8s3.706 8 8.115 8c2.382 0 4.178-.782 5.582-2.24 1.44-1.44 1.893-3.475 1.893-5.111 0-.507-.035-.978-.115-1.369H8.82Z"
                />
              </svg>
              Sign up with Google
            </Clerk.Connection>
            <Clerk.Connection
              name="github"
              className="flex w-full items-center justify-center gap-x-3 rounded-md bg-neutral-700 px-3.5 py-2.5 text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/5%)_inset,0_0_0_1px_theme(colors.white/2%)_inset] outline-none hover:bg-gradient-to-b hover:from-white/5 hover:to-white/5 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-white active:bg-gradient-to-b active:from-black/20 active:to-black/20 active:text-white/70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.262.793-.582 0-.288-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.42-1.304.763-1.605-2.665-.304-5.466-1.335-5.466-5.935 0-1.312.47-2.382 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.48 11.48 0 0 1 3-.404c1.02.005 2.045.138 3 .404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.838 1.235 1.908 1.235 3.22 0 4.61-2.807 5.628-5.48 5.924.43.372.823 1.103.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.192.698.8.58C20.565 21.796 24 17.296 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Sign up with GitHub
            </Clerk.Connection>
          </div>

          <SignUp.Captcha />

          <p className="text-center text-sm text-neutral-400">
            Already have an account?{' '}
            <Clerk.Link
              navigate="sign-in"
              className="font-medium text-white decoration-white/20 underline-offset-4 outline-none hover:underline focus-visible:underline"
            >
              Sign in
            </Clerk.Link>
          </p>
        </SignUp.Step>
      </SignUp.Root>
    </div>
  )
}
