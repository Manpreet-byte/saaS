import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody } from '@/components/ui/card';
import { MessageSquare, Clock } from 'lucide-react';

interface ReviewItemProps {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  responded: boolean;
}

export function ReviewList({ reviews }: { reviews: ReviewItemProps[] }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-6">Recent Reviews</h3>
      <CardBody className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex items-start gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 last:border-0 last:pb-0"
          >
            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex-shrink-0"></div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-slate-900 dark:text-white">{review.author}</h4>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < review.rating
                          ? 'text-yellow-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{review.text}</p>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {review.date}
                </span>
                <Badge variant={review.responded ? 'success' : 'warning'}>
                  {review.responded ? '✓ Responded' : '⏱ Pending'}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
