import React, { useState } from 'react';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';


const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setToken, api } = useAuth();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        const body = isLogin ? { email, password } : { name, email, password };


        try {
            const data = await api.post(endpoint, body);
            if (data.token) setToken(data.token);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-center text-gray-900">{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>


                    <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                        {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                        <span>{isLogin ? 'Log In' : 'Sign Up'}</span>
                    </Button>
                </form>


                <p className="text-sm text-center text-gray-600">{isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={() => setIsLogin(!isLogin)} className="ml-1 font-medium text-blue-600 hover:text-blue-500">{isLogin ? 'Sign Up' : 'Log In'}</button>
                </p>
            </div>
        </div>
    );
};
    export default AuthPage;