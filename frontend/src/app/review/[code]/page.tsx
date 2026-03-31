"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function ReviewPage() {
  const params = useParams();
  const code = params.code as string;

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
  const res = await fetch(`/api/review/${code}`, {
  method: "POST",
  body: JSON.stringify({
    code,
    rating,
    feedback,
  }),
});

const data = await res.json();

if (data.redirectUrl) {
  window.location.href = data.redirectUrl;
} else {
  alert("Feedback submitted ✅");
}
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Give Your Feedback</h2>

      <p>QR Code: {code}</p>

      {/* ⭐ Rating */}
      <div>
        {[1, 2, 3, 4, 5].map((num) => (
          <button key={num} onClick={() => setRating(num)}>
            {num}⭐
          </button>
        ))}
      </div>

      {/* 📝 Feedback */}
      <textarea
        placeholder="Write feedback..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}