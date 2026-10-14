import { createElement, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const Setauthtoken = () => {
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!params.authtoken || params.authtoken === "") {  
            navigate('/login');
        }
        else {
            sessionStorage.setItem('auth-token', params.authtoken);
            navigate('/');
        }
    }, [params.authtoken, navigate])

  return (
    createElement('div', null, 'Loading...')
  )
}

export default Setauthtoken;
