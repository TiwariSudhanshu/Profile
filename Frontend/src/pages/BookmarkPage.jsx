import React from 'react'
import Bookmark from '../components/bookmark'
import Sidebar from '../components/Sidebar'
import Rightbar from '../components/Rightbar'

function BookmarkPage() {
  return (
    <div className='flex justify-start'>
        <div className="w-1/8">
      <Sidebar/>
        </div>
        <div className="w-[70%] ml-[7vmax]">
      <Bookmark/>
        </div>
      <div >
      <Rightbar/>
      </div>
    </div>
  )
}

export default BookmarkPage
