import React from 'react'

function TypingSkeleton() {
  return (
    <div className='flex px-7 gap-1 animate-bounce w-fit px-4 py-2'>
    <div className='w-4 h-4 rounded-lg bg-red-700 animate-bounce'></div>
    <div className='w-4 h-4 rounded-lg bg-red-700 animate-bounce'></div>
    <div className='w-4 h-4 rounded-lg bg-red-700 animate-bounce'></div>
    </div>
  )
}

export default TypingSkeleton