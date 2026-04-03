import React from 'react'
import hexWithAlpha from '../utils/hexWithAlpha'

interface Props {
    children?: React.ReactNode
}


const Layout = ({ children }: Props) => {
    return (
        <div
            className='w-screen h-screen flex justify-center items-center bg-gray-950'
            style={{
                backgroundImage: `
                repeating-linear-gradient(
                    -45deg,
                    ${hexWithAlpha('#f3f4f6', 0.04)} 0px,
                    ${hexWithAlpha('#f3f4f6', 0.04)} 10px,
                    ${hexWithAlpha('#111827', 0.04)} 10px,
                    ${hexWithAlpha('#111827', 0.04)} 20px
                )
            `
            }}
        >
            <div className='relative pt-20! h-[calc(100vh-100px)] w-110 flex flex-col'>
                <div className='absolute w-full flex justify-center luckiest-guy-regular items-center top-0 z-10 text-gray-100 font-bold space-x-3! text-4xl pointer-events-none'>
                    <span className='self-start mt-10'>Lets</span>
                    <div
                        className='w-30 h-30 border-5 border-red-600 rounded-full bg-white bg-no-repeat bg-cover bg-center'
                        style={{
                            backgroundImage: "url('/mario.png')",
                        }}
                    />
                    <span className='self-start mt-10'>Doo</span>
                </div>
                <div
                    className='relative flex flex-col flex-1 border-5 border-red-600 rounded-2xl bg-repeat overflow-hidden'
                    style={{
                        background: "url('/bg-mario.png')",
                        backgroundSize: '130px'
                    }}
                >
                    <main className='h-full w-full' >
                        {children}
                    </main>
                    {/* <div className='absolute left-4 top-4 h-2.5 w-2.5 rounded-full bg-red-600' />
                    <div className='absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-red-600' />
                    <div className='absolute bottom-4 right-4 h-2.5 w-2.5 rounded-full bg-red-600' />
                    <div className='absolute bottom-4 left-4 h-2.5 w-2.5 rounded-full bg-red-600' /> */}
                </div>
            </div>
        </div>
    )
}

export default Layout