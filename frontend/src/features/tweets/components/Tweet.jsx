import React from 'react'
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Tweet = ({ tweet }) => {
    const navigate = useNavigate();

    const handleUpdate = () => {
        navigate(`/update-tweet/${tweet._id}`);
    }

    return (
        <div className="border rounded p-4 shadow-sm flex flex-col">
            <text className="text-lg font-semibold">{tweet.content}</text>
            <text className="text-sm text-gray-500">{tweet.createdAt.split("T")[0]}</text>
            <Button className="mt-4 w-20" variant="outline" onClick={handleUpdate}>Update</Button>
        </div>
    )
}

export default Tweet