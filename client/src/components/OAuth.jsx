import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from '../firebase';
import { signInSuccess } from '../redux/user/userSlice';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { ACTION_IDS } from "./actions/action.constants";
import api from "../components/util/fetchers.js"
export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const { data } = await api.post(ACTION_IDS.GOOGLE_AUTH_API, { name: result.user.displayName, email: result.user.email, photo: result.user.photoURL })
            dispatch(signInSuccess(data))
            navigate('/')
        } catch (error) {
            console.log('could not sign in with google', error);
        }
    }
    return (
        <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue with Google</button>
    )
}
