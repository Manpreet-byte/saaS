// Mock data for dashboard
export const mockDashboardData = {
  kpis: [
    { label: 'Total Reviews', value: '1,284', change: 12, trend: 'up' as const, icon: '⭐' },
    { label: 'Positive Reviews', value: '1,089', change: 18, trend: 'up' as const, icon: '😊' },
    { label: 'Negative Reviews', value: '195', change: -5, trend: 'down' as const, icon: '😞' },
    { label: 'Response Rate', value: '87%', change: 8, trend: 'up' as const, icon: '📧' },
  ],
  trendData: [
    { name: 'Jan', reviews: 120, responses: 95 },
    { name: 'Feb', reviews: 145, responses: 110 },
    { name: 'Mar', reviews: 160, responses: 135 },
    { name: 'Apr', reviews: 180, responses: 155 },
    { name: 'May', reviews: 200, responses: 180 },
    { name: 'Jun', reviews: 220, responses: 200 },
  ],
  ratingData: [
    { name: '5 Stars', count: 850 },
    { name: '4 Stars', count: 239 },
    { name: '3 Stars', count: 120 },
    { name: '2 Stars', count: 50 },
    { name: '1 Star', count: 25 },
  ],
  sentimentData: [
    { name: 'Positive', value: 1089 },
    { name: 'Neutral', value: 120 },
    { name: 'Negative', value: 195 },
  ],
  reviews: [
    {
      id: '1',
      author: 'Sarah Johnson',
      rating: 5,
      text: 'Excellent service and very professional staff. Highly recommended!',
      date: '2 hours ago',
      responded: true,
    },
    {
      id: '2',
      author: 'Michael Chen',
      rating: 4,
      text: 'Great experience overall. Minor wait time but worth it.',
      date: '5 hours ago',
      responded: true,
    },
    {
      id: '3',
      author: 'Emma Davis',
      rating: 3,
      text: 'Average service. Room for improvement in customer support.',
      date: '1 day ago',
      responded: false,
    },
    {
      id: '4',
      author: 'James Wilson',
      rating: 5,
      text: 'Outstanding! Will definitely return and recommend to friends.',
      date: '2 days ago',
      responded: false,
    },
    {
      id: '5',
      author: 'Lisa Martinez',
      rating: 2,
      text: 'Not satisfied with the service provided. Expected better quality.',
      date: '3 days ago',
      responded: true,
    },
  ],
};

export const mockReviewFunnelData = {
  steps: [
    { id: 1, name: 'QR Code Scan', completed: 5234, percentage: 100 },
    { id: 2, name: 'Review Started', completed: 3892, percentage: 74 },
    { id: 3, name: 'Review Submitted', completed: 2451, percentage: 47 },
    { id: 4, name: 'Published', completed: 2284, percentage: 44 },
  ],
};

export const mockAISuggestions = [
  {
    id: '1',
    original: 'Thank you for your review.',
    suggested: 'Thank you so much for taking the time to share your positive feedback! We truly appreciate your kind words and look forward to serving you again soon.',
    status: 'pending',
    date: 'Today, 2:30 PM',
  },
  {
    id: '2',
    original: 'We appreciate your feedback.',
    suggested: 'We truly appreciate you taking the time to share your feedback. Your insights help us improve our services. We would love the opportunity to address your concerns.',
    status: 'applied',
    date: 'Yesterday, 4:15 PM',
  },
  {
    id: '3',
    original: 'Sorry to hear about your experience.',
    suggested: 'We sincerely apologize for the disappointing experience you had. This is not the standard of service we strive for. Please reach out to us directly so we can make this right.',
    status: 'pending',
    date: 'Yesterday, 10:20 AM',
  },
];

export const mockAutomatedResponses = [
  {
    id: '1',
    reviewer: 'John Smith',
    review: 'Great experience! The team was very friendly and helpful.',
    rating: 5,
    suggested: 'Thank you for your wonderful review! We are delighted to hear about your positive experience.',
    status: 'draft',
    date: 'Today',
  },
  {
    id: '2',
    reviewer: 'Emma Wilson',
    review: 'Had some issues with the booking process.',
    rating: 2,
    suggested: 'We apologize for the inconvenience. Please contact us to discuss how we can improve your experience.',
    status: 'scheduled',
    date: 'Tomorrow, 9:00 AM',
  },
  {
    id: '3',
    reviewer: 'Michael Brown',
    review: 'Fantastic service, will recommend to friends!',
    rating: 5,
    suggested: 'Thank you so much! Your recommendation means the world to us.',
    status: 'posted',
    date: '2 hours ago',
  },
];

export const mockSettings = {
  businessProfile: {
    name: 'Your Business Name',
    email: 'business@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business St, City, State 12345',
  },
  integrations: {
    googleMaps: {
      connected: true,
      status: 'Active',
    },
  },
  notifications: {
    newReviews: true,
    suggestions: true,
    responses: true,
    daily: false,
    email: true,
  },
};
