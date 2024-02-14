import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
        <div className="flex-1 justify-center flex flex-col">
            <h2 className="text-2xl">Want to learn HTML, CSS and JavaScript by building fun and engaging projects?</h2>
            <p className="text-gray-500 my-2">Checkout these resources with 50 Real world Javascript Projects</p>
            <Button gradientDuoTone='purpleToPink'  className="rounded-tl-xl rounded-bl-none">
                <a href="https://www.youtube.com/watch?v=EGHP_mP2Iuk" target="_blank" rel="noopener noreferrer">Learn more</a>
            </Button>
        </div>
        <div className="p-7 flex-1">
            <img  src="https://blog.interfell.com/hubfs/JavaScript%20un%20lenguaje%20de%20programaci%C3%B3n.jpg" />
        </div>
    </div>
  )
}

