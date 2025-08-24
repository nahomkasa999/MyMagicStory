import React from "react";


// Dummy data for demonstration
const userSubscription = {
    plan: "Premium",
    quotaLeft: 3,
    totalPurchased: 7,
};

const purchasedBooks = [
    {
        id: "1",
        title: "The Magic Forest",
        purchasedAt: new Date("2024-06-01T10:00:00"),
    },
    {
        id: "2",
        title: "Adventures in Space",
        purchasedAt: new Date("2024-06-05T14:30:00"),
    },
    {
        id: "3",
        title: "The Lost Treasure",
        purchasedAt: new Date("2024-06-10T09:15:00"),
    },
];

function formatDate(date: Date) {
    return date.toLocaleString();
}

export default function PaymentPage() {
    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Payment & Subscription</h1>
            <div className="mb-6 p-4 border rounded bg-gray-50">
                <div className="mb-2">
                    <span className="font-semibold">Subscription Plan:</span>{" "}
                    {userSubscription.plan}
                </div>
                <div className="mb-2">
                    <span className="font-semibold">Quota Left:</span>{" "}
                    {userSubscription.quotaLeft}
                </div>
                <div>
                    <span className="font-semibold">Books Purchased:</span>{" "}
                    {userSubscription.totalPurchased}
                </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Purchased Storybooks</h2>
            <div className="border rounded bg-white">
                <ul>
                    {purchasedBooks.map((book) => (
                        <li
                            key={book.id}
                            className="flex justify-between items-center border-b last:border-b-0 px-4 py-3"
                        >
                            <span>{book.title}</span>
                            <span className="text-sm text-gray-500">
                                {formatDate(book.purchasedAt)}
                            </span>
                        </li>
                    ))}
                </ul>
                {purchasedBooks.length === 0 && (
                    <div className="p-4 text-gray-500">No books purchased yet.</div>
                )}
            </div>
        </div>
    );
}