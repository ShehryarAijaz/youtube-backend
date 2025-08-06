import React from 'react'

const Tweet = ({ tweet }) => {
    return (
        <div className="border rounded p-4 shadow-sm flex flex-col">
            <text className="text-lg font-semibold">{tweet.content}</text>
            <text className="text-sm text-gray-500">{tweet.createdAt.split("T")[0]}</text>
        </div>
    )
}

export default Tweet