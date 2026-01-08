import React from 'react'
import TopNavigation from './TopNavigation'
import { useSelector } from 'react-redux';

function Tasks() {
   let userDetails = useSelector((store)=>{
          return store.userDetails
      });
  return (
    <div>
        <TopNavigation/>
      <h1>Tasks</h1>
      <h1>{userDetails.firstName} {userDetails.lastName}</h1>
      <img src={`http://localhost:3333/${userDetails.profilePic}`} alt='' className='profilePic'></img>
    </div>
  )
}

export default Tasks
