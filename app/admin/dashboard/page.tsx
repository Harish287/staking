'use client';

import { Card } from '@/components/ui/card';
import { CircleDollarSign, Users, Wallet, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const registrationData = [
  { day: 'Thu', value: 45 },
  { day: 'Fri', value: 62 },
  { day: 'Sat', value: 35 },
  { day: 'Sun', value: 28 },
  { day: 'Mon', value: 38 },
  { day: 'Tue', value: 35 },
  { day: 'Wed', value: 30 },
  { day: 'Thu', value: 35 },
  { day: 'Fri', value: 28 },
  { day: 'Sat', value: 28 },
  { day: 'Sun', value: 18 },
  { day: 'Mon', value: 50 },
  { day: 'Tue', value: 75 },
  { day: 'Wed', value: 20 },
  { day: 'Thu', value: 30 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Contracts Card */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm text-gray-500 dark:text-gray-400">TOTAL CONTRACTS</h2>
                <CircleDollarSign className="text-red-500 h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-semibold">310,041,347</span>
              </div>
              <button className="text-violet-500 text-sm">VIEW</button>
            </div>
          </Card>

          {/* Total Users Card */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm text-gray-500 dark:text-gray-400">TOTAL USERS</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">KYC</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">USER</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-semibold">24,472</span>
                <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded">90%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">181 since last week</span>
                <button className="text-violet-500 text-sm">VIEW</button>
              </div>
            </div>
          </Card>

          {/* KAIT Wallet Card */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm text-gray-500 dark:text-gray-400">KAIT WALLET</h2>
                <div className="flex gap-2">
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">USDT</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">OTHERS</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">CORPORATE</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="text-red-500 h-4 w-4" />
                  <span className="text-2xl font-semibold">171,057,527</span>
                </div>
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="text-red-500 h-4 w-4" />
                  <span className="text-2xl font-semibold">0</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Important Metrics Card */}
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-medium">Important Metrics</h2>
                <button className="text-violet-500 text-sm flex items-center gap-1">
                  VIEW ALL
                  <span className="text-lg">&gt;</span>
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Total ROI', value: '118,079,430', status: 'success' },
                  { label: 'Total Level', value: '86,319,651', status: 'success' },
                  { label: 'Total Earnings', value: '204,399,082', status: 'success' },
                  { label: 'Total Withdraw', value: '76,208,917', status: 'warning' },
                  { label: 'Total Balance', value: '5,162,012', status: 'warning' },
                ].map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-300">{metric.label}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <CircleDollarSign className="text-red-500 h-4 w-4" />
                        <span>{metric.value}</span>
                      </div>
                      {metric.status === 'success' ? (
                        <CheckCircle className="text-green-500 h-5 w-5" />
                      ) : (
                        <AlertCircle className="text-yellow-500 h-5 w-5" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Registration Statistics Card */}
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-medium">Registration Statistics</h2>
                <select className="bg-transparent border-none text-sm text-gray-500">
                  <option>15 DAYS</option>
                  <option>30 DAYS</option>
                  <option>60 DAYS</option>
                </select>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={registrationData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}