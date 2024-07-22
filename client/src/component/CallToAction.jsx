import { Button } from 'flowbite-react'
import React from 'react'

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center '>
      <div className='flex-1 flex flex-col justify-center'>
        <h2 className='text-2xl'>want to learn more about javaScript</h2>
        <p className='text-gray-500'>Check out this resources with 500 projects</p>
        <Button gradientDuoTone={"purpleToPink"} className='rounded-tl-xl rounded-bl-none rounded-tr-none rounded-br-xl'>
            <a href="https://www.github.com/Sadar786/" target='_blank' rel='noopner noreferrer'>Check Out Projects</a>
        </Button>
      </div>
      <div className='p-7 flex-1'>
        <img className='rounded-2xl' src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg" />
      </div>
    </div>
  )
}
