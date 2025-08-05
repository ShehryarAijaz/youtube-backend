import React from 'react'

const Tweet = ({ tweet }) => {
    return (
        <div className="border rounded p-4 shadow-sm">
            <text className="text-lg font-semibold">{tweet.content}</text>
        </div>
    )
}

export default Tweet