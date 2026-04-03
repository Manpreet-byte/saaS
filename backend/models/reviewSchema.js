export const reviewSchema = {
  table: "reviews",
  columns: {
    id: "uuid",
    rating: "smallint",
    comment: "text",
    created_at: "timestamptz",
  },
  indexes: [
    "create index if not exists idx_reviews_created_at on public.reviews (created_at desc);",
    "create index if not exists idx_reviews_rating on public.reviews (rating);",
  ],
};
