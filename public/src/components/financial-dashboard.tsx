"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FinancialInsights from "./financial-insights";

const incomeData = [
  { source: 'Guest Signup Fees', amount: 4500.00, date: '2025-07-30' },
  { source: 'Host Event Fees', amount: 1250.00, date: '2025-07-30' },
  { source: 'Venue Subscriptions', amount: 899.99, date: '2025-07-30' },
  { source: 'Fun Court Cases', amount: 75.00, date: '2025-07-30' },
];

const expenseData = [
    { category: 'AI API Costs', item: 'Genkit/Gemini Usage', amount: 650.50, date: '2025-07-30' },
    { category: 'Cloud Services', item: 'Firebase Hosting', amount: 120.00, date: '2025-07-30' },
    { category: 'Payment Processing', item: 'Stripe Fees', amount: 215.25, date: '2025-07-30' },
    { category: 'Marketing', item: 'Social Media Ads', amount: 400.00, date: '2025-07-30' },
];

const chartData = [
  { name: 'Jan', Turnover: 4000, Expenses: 2400 },
  { name: 'Feb', Turnover: 3000, Expenses: 1398 },
  { name: 'Mar', Turnover: 2000, Expenses: 1800 },
  { name: 'Apr', Turnover: 2780, Expenses: 1908 },
  { name: 'May', Turnover: 1890, Expenses: 1800 },
  { name: 'Jun', Turnover: 2390, Expenses: 1800 },
];

const totalTurnover = incomeData.reduce((sum, item) => sum + item.amount, 0);
const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
const netProfit = totalTurnover - totalExpenses;


const FinancialDashboard = () => {
  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Turnover</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">£{totalTurnover.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Allowable Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">£{totalExpenses.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">£{netProfit.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Turnover" fill="#8884d8" />
              <Bar dataKey="Expenses" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <FinancialInsights turnover={totalTurnover} expenses={expenseData} />

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Income Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {incomeData.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                            <span>{item.source}</span>
                            <span className="font-medium">£{item.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {expenseData.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                            <span>{item.category}: <span className="text-muted-foreground">{item.item}</span></span>
                            <span className="font-medium">£{item.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialDashboard;
