import React from 'react'
import TopNavigation from './TopNavigation'
import { useSelector } from 'react-redux'


function Dashboard() {
    let userDetails = useSelector((store)=>{
        return store.userDetails
    });

    let onDeleteProfile = async ()=>{
      let dataToSend = new FormData();
      dataToSend.append("email",userDetails.email);

      let reqOptions ={
        method:"DELETE",
        body:dataToSend
      }

      let JSONData = await fetch("/deleteProfile",reqOptions);

      let JSOData = await JSONData.json();
      alert(JSOData.msg)
    }
   
  return (
    <div>
        <TopNavigation></TopNavigation>
      <h1>Dashboard</h1>
      <button type='button' onClick={()=>{
        onDeleteProfile();
      }}>Delete Profile</button>
      <h1>{userDetails.firstName} {userDetails.lastName}</h1>
      <img src={`/${userDetails.profilePic}`} alt='' className='profilePic'></img>
    </div>
  )
}

export default Dashboard
