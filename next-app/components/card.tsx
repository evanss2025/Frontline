import * as React from 'react'

export default function Card({id, className, title, body}: {id: string, className:any, title: string, body: any}) {
    return(
        <div id={id} className="flex-1 text-white text-shadow-lg/30 border-3 hover:text-red-450 p-4 bg-red-800 font-bold text-xl hover:text-red-500 hover:bg-red-900">
            <h1>{title}</h1>
            <div className={className}>
                <p>{body}</p>
            </div>
        </div>

    )

}