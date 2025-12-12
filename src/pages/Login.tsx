import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            let response;
            const useMock = import.meta.env.VITE_USE_MOCK === 'true';

            if (useMock) {
                // Mock delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                const { MOCK_USERS } = await import('../data/mock_user');
                const mockUser = MOCK_USERS.find(u => u.username === username && u.password === password);

                if (mockUser) {
                    response = {
                        ...mockUser.response,
                        access_token: mockUser.response.access_token + Date.now() // Unique token
                    };
                } else {
                    throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác');
                }
            } else {
                response = await apiService.login({
                    emailOrUsername: username,
                    password: password,
                });
            }

            // Store authentication data
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('user_id', String(response.user_id));
            localStorage.setItem('username', response.username);
            localStorage.setItem('role', response.role);

            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#003366] to-[#004A99] flex items-center justify-center p-4">
            <div className={`w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden p-8 animate-fade-in ${error ? 'animate-shake' : ''}`}>
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-white rounded-xl mx-auto flex items-center justify-center shadow-lg mb-4">
                        <span className="text-3xl font-bold text-[#004A99]">NCB</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-wide">Smart Doc Check</h1>
                    <p className="text-blue-200 text-sm mt-1">Hệ thống Đối soát & Bóc tách Chứng từ</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-100 ml-1">Tên đăng nhập</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-3 text-blue-300 group-hover:text-white transition-colors" size={20} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-blue-900/30 border border-blue-500/30 focus:border-white/50 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                                placeholder="Username"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-100 ml-1">Mật khẩu</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 text-blue-300 group-hover:text-white transition-colors" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-blue-900/30 border border-blue-500/30 focus:border-white/50 rounded-xl py-2.5 pl-10 pr-10 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-blue-300 hover:text-white transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg flex items-center animate-slide-up">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white hover:bg-blue-50 text-[#004A99] font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-[#004A99] border-t-transparent rounded-full animate-spin" />
                        ) : (
                            'Đăng nhập'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-blue-300">
                        &copy; 2025 NCB Bank. All rights reserved. <br />
                        Version 1.0.0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
