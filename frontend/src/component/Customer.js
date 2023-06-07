import React, { useEffect, useState  } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import addNotification from "react-push-notification";
import logo from '../svgs/icons8-building-arrow-pastel-glyph-96.png'
import './index.css';
// import Navbar from "./Navbar";

const Customer=()=>{
    const navigate=useNavigate();
    const [userData,setUserData]=useState({});
    const [messageData,setMessageData]=useState({firstName:"",email:"",message:""});
    // const callAboutPage=()=>{
    //   try{
    //     const res=await fetch('/about',{
    //         method:"GET",
    //             headers:{
    //                 Accept:"application/json",
    //                 "Content-Type":"application/json"
    //              },
    //             credentials:"include"
    //     })
    //   } catch(){

    //   } 
    // }
    // useEffect(()=>{
    //     callAboutPage();
    // },[])

    const callCustomerPage=async()=>{
        try{
            const res =await fetch('/aboutCustomer',{
                method:"GET",
                headers:{
                    Accept:"application/json",
                    "Content-Type":"application/json"
                 },
                credentials:"include"
            });
           
            const data=await res.json();
            console.log(data);
            setUserData(data);

            if(!res.status===200){
                const error= new Error(res.error);
                throw error;
            }

        }catch(err){
            // console.log("HN BHAI TERI MAA KAA")
            console.log(err);
            navigate('/loginForCustomers');
        }
    };
    const userContact=async()=>{
        try{
            const res =await fetch('/getMessage',{
                method:"GET",
                headers:{
                    "Content-Type":"application/json"
                 },
            });
           
            const data=await res.json();
            console.log(messageData);
            setMessageData({...data,firstName:data.firstName,email:data.email,phone:data.phone});

            if(!res.status===200){
                const error= new Error(res.error);
                throw error;
            }

        }catch(err){
            // console.log("HN BHAI TERI MAA KAA")
            console.log(err);
        }
    };
    useEffect(()=>{
        callCustomerPage();
    },[]);
    useEffect(()=>{
        userContact();
    },[]);

    const handleInputs=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        setMessageData({...messageData,[name]:value});
    }
    const contactForm=async(e)=>{
        e.preventDefault(); 
        const {firstName,email,phone,message}=messageData;
        const res=await fetch('/contact',{
            method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            firstName:firstName,email:email,phone:phone,message:message
        })
        });
        const data=await res.json();

        if(!data){
            console.log("message not sent");
        }else{
            toast.success('Message Sent!', {
                autoClose: 3000,
                theme: "dark",
                });
            setMessageData({...messageData,message:" "});
        }
       
    }

    //NOTIFICATIONS

    const titles = [
        'Welcome',
        'For Interactions'   
      ];
    
      const messages = [
        'Hello There ;) .',
        'Use RELPE Chat for interaction and information sharing.'
      ];

    const [index, setIndex] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);
    const [showRedCircle, setShowRedCircle] = useState(true);
    const [lastNotificationTime, setLastNotificationTime] = useState(Date.now());

  useEffect(() => {
    if (notificationCount >= 2) {
      setShowRedCircle(false);

      const timeout = setTimeout(() => {
        setShowRedCircle(true);
        setNotificationCount(0); // Reset notification count after 20 minutes
        setIndex(0); // Reset index to start from the first message
      }, 20 * 60 * 1000); // 20 minutes in milliseconds

      return () => clearTimeout(timeout);
    } else {
      setShowRedCircle(true);
    }
  }, [notificationCount]);

  const clickToNotify = () => {
    if (notificationCount < 2) {
      const title = titles[index];
      const message = messages[index];

      addNotification({
        title: title,
        message: message,
        duration: 4000,
        icon: logo,
        native: true,
      });

      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
      setNotificationCount((prevCount) => prevCount + 1);
      setLastNotificationTime(Date.now());
    }
  };

  useEffect(() => {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastNotificationTime;

    if (timeDifference >= 20 * 60 * 1000) {
      setShowRedCircle(true);
    }
  }, [lastNotificationTime]);

    return(
        <>
        <section class="user-dashboard">
        <div class="dashboard-nav"> 
            <nav class="dashnav">
                <NavLink to="/"><h1 class="logo">RELPE</h1></NavLink>
                    <ul class="dash-svg-nav">
                    <NavLink onClick={clickToNotify}> 
                            <li>
                                <svg className="notification-icon" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                                    {showRedCircle && <circle cx="20" cy="4" r="4" fill="red" />}
                                    {notificationCount > 0 && (
                                        <text className="notification-text" x="20" y="8" textAnchor="middle" fontSize="10">
                                        {2 - notificationCount}
                                        </text>
                                    )}
                                    <path d="M1 20v-2.946c1.993-.656 2.575-2.158 3.668-6.077.897-3.218 1.891-6.784 4.873-8.023-.027-.147-.041-.299-.041-.454 0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5c0 .156-.014.309-.042.458 2.987 1.244 3.984 4.813 4.884 8.033 1.103 3.95 1.697 5.423 3.658 6.062v2.947h-7c0 2.208-1.792 4-4 4s-4-1.792-4-4h-7zm14 0h-6c0 1.656 1.344 3 3 3s3-1.344 3-3zm-13-1h20v-1.241c-2.062-.918-2.82-3.633-3.621-6.498-1.066-3.814-2.167-7.758-6.379-7.761-4.21 0-5.308 3.937-6.369 7.745-.8 2.872-1.559 5.593-3.631 6.514v1.241zm11.492-16.345l.008-.155c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5l.008.152c.455-.099.949-.152 1.487-.152.542 0 1.039.054 1.497.155z" />
                                    <title>NOTIFICATIONS</title>
                                </svg>
                            </li>
                        </NavLink>
                        <a href="http://localhost:3003/" target="_blank"><li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/><title>RELPE CHAT</title></svg></li></a>
                        <NavLink to="/logout"><li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14 12h-4v-12h4v12zm4.213-10.246l-1.213 1.599c2.984 1.732 5 4.955 5 8.647 0 5.514-4.486 10-10 10s-10-4.486-10-10c0-3.692 2.016-6.915 5-8.647l-1.213-1.599c-3.465 2.103-5.787 5.897-5.787 10.246 0 6.627 5.373 12 12 12s12-5.373 12-12c0-4.349-2.322-8.143-5.787-10.246z"/><title>LOGOUT</title></svg></li></NavLink>
                    </ul>
            </nav>
        </div>
        <div class="dashboard">
            <div class="welcome">
                <h1 style={{textTransform:"capitalize"}}>Welcome to Real-Estate Land Parcel Explorer {userData.firstName}</h1>
            </div>
            <h1 class="info-heading">Your Information</h1>
            <div class="information">
                
                <div class="table-flex">
                    <table>
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                            </tr>
                            <tr>
                                <td style={{textTransform:"capitalize"}}>{userData.firstName} {userData.lastName}</td>
                                <td>{userData.phone}</td>
                                <td>{userData.email}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="contact information">
                <h1>Get in Touch</h1>
                <form method="POST">
                    <div className="input-flex">
                        <input type="text" style={{color:'black'}} name="firstName" value={messageData.firstName} onChange={handleInputs}/>
                        <input type="email" style={{color:'black'}} name="email" value={messageData.email} onChange={handleInputs}/>
                        <input type="text"  style={{color:'black'}} name="phone" value={messageData.phone}  onChange={handleInputs}/>
                    </div>
                    <div>
                        <textarea  cols="30" rows="10" placeholder="Feedback of our system" name="message" value={messageData.message} onChange={handleInputs}></textarea>
                    </div>
                </form>
                <button onClick={contactForm}>Send Message</button>
            </div>
            
        </div>
           
        <ToastContainer
                    style={{fontSize:"14px"}}
                />
    </section>
        </>
    );
}

export default Customer;