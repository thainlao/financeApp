import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";

const ForgetPassword = () => {
    const [email, setEmail] = useState<string>('')
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
      try {
        await axios.post('http://localhost:3000/auth/forget-password', { email });
        navigate('/change-password', { state: { email } });
      } catch (error) {
        console.error(error);
        toast.error('User not found or account not activated');
      }
    };

    return (
        <div className='login'>
        <form onSubmit={(e) => e.preventDefault()}>
          <h2>Введите email</h2>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <button onClick={handleSubmit} type="submit">Найти Email</button>
          <span>вернуться <a href='/login'>к логину</a></span>
        </form>
      </div>
    )
}

export default ForgetPassword