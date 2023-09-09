import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import useToggle from "../hooks/useToggle"
import axios from '../api/axios';
import useInput from "../hooks/useInput"




const LOGIN_URL = '/auth';




const Login = () => {
    const { setAuth,persist,setPersist } = useAuth();



    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    // const [user, setUser] = useLocalStorage("user",'');

    const [user,reset,attributeObj]=useInput("user","")
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [check,toggleCheck]=useToggle("persist",false)

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, pwd, roles, accessToken });
            // setUser('');
            reset()

            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }
    
    // const persistToggler=()=>{
    //     setPersist(prev=>!prev)
    // }

    // useEffect(()=>{
    //     localStorage.setItem("persist",JSON.stringify(persist))

    // },[persist])




    return (

        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    // onChange={(e) => setUser(e.target.value)}
                    // value={user}
                    {...attributeObj}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button>Sign In</button>

                <div className=''>
                    <input id='persist' type='checkbox' checked={check} onChange={toggleCheck}/>
                    <label htmlFor='persist'>Trusted Device</label>
                </div>
              
            </form>
            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>
        </section>

    )
}

export default Login
