"use client";

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/card';

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface ReviewTrendChartProps {
  data: ChartData[];
}

export function ReviewTrendChart({ data }: ReviewTrendChartProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-6">Review Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="reviews" stroke="#0ea5e9" strokeWidth={2} />
          <Line type="monotone" dataKey="responses" stroke="#10b981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface RatingDistributionChartProps {
  data: ChartData[];
}

export function RatingDistributionChart({ data }: RatingDistributionChartProps) {
  const colors = ['#10b981', '#3b82f6', '#fbbf24', '#ef4444', '#6366f1'];

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-6">Rating Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#0ea5e9" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface SentimentChartProps {
  data: ChartData[];
}

export function SentimentChart({ data }: SentimentChartProps) {
  const colors = ['#10b981', '#fbbf24', '#ef4444'];

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-6">Sentiment Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} label outerRadius={100} fill="#8884d8" dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
