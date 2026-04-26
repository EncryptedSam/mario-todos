import React from 'react'
import hexWithAlpha from '../utils/hexWithAlpha'

interface Props {
    children?: React.ReactNode
}

const Layout = ({ children }: Props) => {

    return (
        <div
            className='w-screen h-screen flex justify-center items-center bg-gray-950 p-2'
            style={{
                backgroundImage: `
                repeating-linear-gradient(
                    -45deg,
                    ${hexWithAlpha('#f3f4f6', 0.04)} 0px,
                    ${hexWithAlpha('#f3f4f6', 0.04)} 20px,
                    ${hexWithAlpha('#111827', 0.04)} 20px,
                    ${hexWithAlpha('#111827', 0.04)} 40px
                )
            `
            }}
        >
            <div className='relative pt-20! max-h-215 h-full w-110 flex flex-col'>
                <div
                    className='absolute w-full flex justify-center items-center top-0 z-10 text-gray-100 font-bold space-x-3! text-4xl pointer-events-none'
                >
                    <span className='self-start mt-10 luckiest-guy-regular'>Lets</span>
                    <div
                        className='w-30 h-30 border-5 border-red-600 rounded-full bg-white bg-no-repeat bg-cover bg-center'
                        style={{
                            backgroundSize: '90%',
                            backgroundImage: "url('/mario-todos//mario.png')",
                        }}
                    />
                    <span className='self-start mt-10 luckiest-guy-regular'>Doo</span>
                </div>
                <div
                    className='relative flex flex-col flex-1 border-5 border-red-600 rounded-4xl bg-repeat overflow-hidden'
                    style={{
                        background: "url('/mario-todos/bg-mario.png')",
                        backgroundSize: '130px'
                    }}
                >
                    <main className='relative flex flex-col w-full h-full px-2' >
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Layout
