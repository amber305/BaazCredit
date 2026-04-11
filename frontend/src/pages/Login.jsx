import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const { login, register } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLoginView) {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
             {/* Background blobs */}
             <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
             
             <div className="glass-panel p-8 w-full max-w-md z-10 relative">
                 <h2 className="text-3xl font-bold mb-2">
                     {isLoginView ? 'Welcome Back' : 'Create Account'}
                 </h2>
                 <p className="text-textMuted mb-8">
                     {isLoginView ? 'Log in to access your predictions.' : 'Sign up to start analyzing credit risk.'}
                 </p>

                 {error && <div className="bg-danger/20 text-danger border border-danger/50 p-3 rounded-lg mb-6 text-sm">{error}</div>}

                 <form onSubmit={handleSubmit} className="space-y-4">
                     {!isLoginView && (
                         <div>
                             <label className="label-text">Full Name</label>
                             <input 
                                 type="text" 
                                 className="input-field" 
                                 placeholder="John Doe"
                                 value={name}
                                 onChange={(e) => setName(e.target.value)}
                                 required={!isLoginView}
                             />
                         </div>
                     )}
                     <div>
                         <label className="label-text">Email Address</label>
                         <input 
                             type="email" 
                             className="input-field" 
                             placeholder="name@company.com"
                             value={email}
                             onChange={(e) => setEmail(e.target.value)}
                             required
                         />
                     </div>
                     <div>
                         <label className="label-text">Password</label>
                         <input 
                             type="password" 
                             className="input-field" 
                             placeholder="••••••••"
                             value={password}
                             onChange={(e) => setPassword(e.target.value)}
                             required
                         />
                     </div>

                     <button type="submit" className="btn-primary w-full mt-6">
                         {isLoginView ? 'Log In' : 'Sign Up'}
                     </button>
                 </form>

                 <div className="mt-6 text-center text-sm text-textMuted">
                     {isLoginView ? "Don't have an account? " : "Already have an account? "}
                     <button 
                         type="button"
                         onClick={() => setIsLoginView(!isLoginView)}
                         className="text-primary hover:text-primaryHover font-medium"
                     >
                         {isLoginView ? 'Sign up' : 'Log in'}
                     </button>
                 </div>
                 
                 <div className="mt-4 text-center">
                    <Link to="/" className="text-xs text-textMuted hover:text-white transition-colors">Back to Home</Link>
                 </div>
             </div>
        </div>
    );
};

export default Login;
