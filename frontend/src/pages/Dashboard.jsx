import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Activity, BrainCircuit, Users, TrendingUp, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [predictions, setPredictions] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user.isAdmin) {
                    const analyticsRes = await api.get('/predictions/analytics');
                    setAnalytics(analyticsRes.data);
                } else {
                    const predRes = await api.get('/predictions/my-predictions');
                    setPredictions(predRes.data);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const renderScoreCircle = (score) => {
        // Score range 300 - 850
        const percentage = ((score - 300) / 550) * 100;
        let color = '#10B981'; // Green
        if (score < 600) color = '#EF4444'; // Red
        else if (score < 700) color = '#F59E0B'; // Yellow

        return (
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8" style={{ borderColor: `${color}40`, borderTopColor: color, transform: `rotate(${(percentage/100)*360}deg)`}}>
                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ transform: `rotate(-${(percentage/100)*360}deg)`}}>
                    <span className="text-3xl font-bold" style={{ color }}>{score}</span>
                    <span className="text-xs text-textMuted text-center mt-1">Credit Score</span>
                </div>
            </div>
        );
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading Dashboard...</div>;

    if (user.isAdmin && analytics) {
        return (
            <div className="min-h-screen p-8 relative">
                <nav className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <Activity className="text-primary" /> Admin Analytics Center
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-textMuted">Admin: {user.name}</span>
                        <button onClick={logout} className="p-2 bg-danger/10 text-danger rounded-lg hover:bg-danger/20 transition-colors"><LogOut size={20}/></button>
                    </div>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="glass-panel p-6 flex items-center gap-4">
                        <div className="p-4 bg-primary/20 text-primary rounded-xl"><Users size={32} /></div>
                        <div>
                            <p className="text-textMuted">Total Predictions</p>
                            <h3 className="text-3xl font-bold">{analytics.totalPredictions}</h3>
                        </div>
                    </div>
                    <div className="glass-panel p-6 flex items-center gap-4">
                        <div className="p-4 bg-danger/20 text-danger rounded-xl"><ShieldAlert size={32} /></div>
                        <div>
                            <p className="text-textMuted">High Risk Detected</p>
                            <h3 className="text-3xl font-bold">{analytics.highRisk}</h3>
                        </div>
                    </div>
                    <div className="glass-panel p-6 flex items-center gap-4">
                        <div className="p-4 bg-secondary/20 text-secondary rounded-xl"><ShieldCheck size={32} /></div>
                        <div>
                            <p className="text-textMuted">Low Risk Detected</p>
                            <h3 className="text-3xl font-bold">{analytics.lowRisk}</h3>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-8">
                    <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-textMuted border-b border-white/10">
                                    <th className="pb-4">Date</th>
                                    <th className="pb-4">User</th>
                                    <th className="pb-4">Score</th>
                                    <th className="pb-4">Risk Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.recentActivity.map(item => (
                                    <tr key={item._id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                                        <td className="py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td className="py-4">{item.user?.name || 'Unknown'}</td>
                                        <td className="py-4 font-semibold">{item.result.credit_score}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.result.prediction_class === 1 ? 'bg-danger/20 text-danger' : 'bg-secondary/20 text-secondary'}`}>
                                                {item.result.risk_label}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 relative">
            {/* Nav */}
            <nav className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                <h1 className="text-2xl font-bold flex items-center gap-3">
                    <BrainCircuit className="text-primary" /> My Predictions Overview
                </h1>
                <div className="flex gap-4">
                    <Link to="/predict" className="btn-primary py-2 px-4 shadow-none">New Assessment</Link>
                    <button onClick={logout} className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"><LogOut size={20}/></button>
                </div>
            </nav>

            {predictions.length === 0 ? (
                <div className="text-center py-20 text-textMuted glass-panel">
                    <div className="inline-block p-6 bg-white/5 rounded-full mb-4">
                        <TrendingUp size={48} className="text-white/20" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white mb-2">No data yet</h2>
                    <p className="mb-6">Run your first credit risk assessment to see results here.</p>
                    <Link to="/predict" className="btn-primary">Generate Score</Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {predictions.map((item, index) => (
                        <div key={item._id} className="glass-panel overflow-hidden">
                            <div className="border-b border-white/10 p-6 flex flex-wrap justify-between items-center bg-white/[0.02]">
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Assessment #{predictions.length - index}</h3>
                                    <p className="text-sm text-textMuted">{new Date(item.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-6 mt-4 sm:mt-0">
                                    <div className="text-right">
                                        <p className="text-sm text-textMuted mb-1">Risk Classification</p>
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${item.result.prediction_class === 1 ? 'bg-danger/20 text-danger' : 'bg-secondary/20 text-secondary'}`}>
                                            {item.result.risk_label}
                                        </span>
                                    </div>
                                    {renderScoreCircle(item.result.credit_score)}
                                </div>
                            </div>
                            
                            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-sm font-semibold text-textMuted uppercase tracking-wider mb-4">Key Inputs</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-background/50 p-3 rounded-lg border border-white/5">
                                            <p className="text-xs text-textMuted">Income</p>
                                            <p className="font-semibold">₹{item.inputs.income.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-background/50 p-3 rounded-lg border border-white/5">
                                            <p className="text-xs text-textMuted">Loan Amount</p>
                                            <p className="font-semibold">₹{item.inputs.loan_amount.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-background/50 p-3 rounded-lg border border-white/5">
                                            <p className="text-xs text-textMuted">Default Rate Probability</p>
                                            <p className="font-semibold">{(item.result.default_probability * 100).toFixed(1)}%</p>
                                        </div>
                                        <div className="bg-background/50 p-3 rounded-lg border border-white/5">
                                            <p className="text-xs text-textMuted">Behavioral Reliability</p>
                                            <p className="font-semibold">{(item.inputs.repayment_behavior * 100).toFixed(0)} / 100</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="text-sm font-semibold text-textMuted uppercase tracking-wider mb-4">AI Feature Importance (SHAP)</h4>
                                    <div className="h-[200px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={item.result.top_factors} layout="vertical" margin={{ top: 0, right: 0, left: 50, bottom: 0 }}>
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="feature" type="category" tick={{fill: '#94A3B8', fontSize: 12}} width={120} />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#1A202C', borderColor: '#334155' }}
                                                    itemStyle={{ color: '#F8FAFC' }}
                                                />
                                                <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                                                    {item.result.top_factors.map((entry, i) => (
                                                        <Cell key={`cell-${i}`} fill={entry.impact > 0 ? '#EF4444' : '#10B981'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <p className="text-xs text-textMuted text-right mt-2">
                                        <span className="text-danger">Red</span> forces risk up (bad) • <span className="text-secondary">Green</span> forces risk down (good)
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
