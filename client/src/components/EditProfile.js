import React, { useEffect, useRef,useState } from 'react'
import TopNavigation from './TopNavigation';
import { useSelector } from 'react-redux';

function EditProfile() {
    let firstNameInputRef = useRef();
    let lastNameInputRef = useRef();
    let emailInputRef = useRef();
    let passwordInputRef = useRef();
    let ageInputRef = useRef();
    let mobileNoInputRef = useRef();
    let profilePicInputRef = useRef();

    let [profilePic,setProfilePic]= useState("https://pulse.brninfotech.com/media/auth/images/no-pic3.png");

    let userDetails = useSelector((store)=>{
        return store.userDetails;
    });

    useEffect(()=>{
    firstNameInputRef.current.value = userDetails.firstName;
    lastNameInputRef.current.value = userDetails.lastName;
    emailInputRef.current.value = userDetails.email;
    ageInputRef.current.value = userDetails.age;
    mobileNoInputRef.current.value = userDetails.mobileNo;
    setProfilePic(`/${userDetails.profilePic}`)
    },[])


    let onUpdateProfile = async()=>{
        let dataToSend = new FormData();
        dataToSend.append("firstName",firstNameInputRef.current.value);
        dataToSend.append("lastName",lastNameInputRef.current.value);
        dataToSend.append("email",emailInputRef.current.value);
        dataToSend.append("password",passwordInputRef.current.value);
        dataToSend.append("age",ageInputRef.current.value);
        dataToSend.append("mobileNo",mobileNoInputRef.current.value);

    for(let i=0;i<profilePicInputRef.current.files.length;i++){
      dataToSend.append("profilePic",profilePicInputRef.current.files[i])
    }
    

        let reqOptions ={
            method:"PATCH",
            body:dataToSend,
        
        }

        let JSONData = await fetch("/updateProfile",reqOptions);
        let JSOData = await JSONData.json();
        console.log(JSOData);
        alert(JSOData.msg)


    }
  return (
    <div className='App'>
        <TopNavigation></TopNavigation>
      <form>
        <h2>EditProfile</h2>
        <div>
            <label>First Name</label>
            <input ref={firstNameInputRef}></input>
        </div>
        <div>
            <label>Last Name</label>
            <input ref={lastNameInputRef}></input>
        </div>
        <div>
            <label>Email</label>
            <input ref={emailInputRef} readOnly></input>
        </div>
        <div>
            <label>Password</label>
            <input ref={passwordInputRef}></input>
        </div>
        <div>
            <label>Age</label>
            <input ref={ageInputRef}></input>
        </div>
        <div>
            <label>Mobile No</label>
            <input ref={mobileNoInputRef}></input>
        </div>
        <div>
            <label>Profile Pic</label>
            <input ref={profilePicInputRef} type="file" onChange={(e)=>{
              console.log(e.target.files);
              let selectedPath = URL.createObjectURL(e.target.files[0]);
              setProfilePic(selectedPath)
            }}></input>
        </div>
        <div>
            <img src={profilePic} alt=""  className='profilePic'></img>
        </div>
        <div>
            <button type='button' onClick={()=>{
             onUpdateProfile()
            }}>update profile</button>
        </div>

      </form>
      
    </div>
  )
}

export default EditProfile;
