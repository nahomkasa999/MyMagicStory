'use client'

import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useSession } from '@/app/hooks/session';
import Link from 'next/link'

export default function Pricing() {

    const session = useSession()
     const handleSubscribeClick = async () => {
        try {
          const res = await fetch("http://localhost:3001/payment/checkout", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
               Authorization: `${session.session?.access_token}`
            },
            body: JSON.stringify({ type: "subscription" }),
          });
          const data = await res.json();
          console.log(data)
          if(res.ok){
    
          }
          if (data.url) window.location.href = data.url;
          else console.error("No checkout URL returned");
        } catch (err) {
          // console.error("Checkout failed", err);
        }
      };

    return (
        <div className="relative py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Unlock Your Creative Potential
                    </h2>
                </div>
                <div className="mt-8 md:mt-20">
                    <div className="bg-card relative rounded-3xl border shadow-2xl shadow-zinc-950/5">
                        <div className="grid items-center gap-12 divide-y p-12 md:grid-cols-2 md:divide-x md:divide-y-0">
                            <div className="pb-12 text-center md:pb-0 md:pr-12">
                                <h3 className="text-2xl font-semibold">Pro Plan</h3>
                                <p className="mt-2 text-lg">For individuals and small teams</p>
                                <span className="mb-6 mt-12 inline-block text-6xl font-bold">
                                    <span className="text-4xl">$</span>19
                                </span>

                                <div className="flex justify-center">
                                    <Button
                                        size="lg"
                                        onClick={handleSubscribeClick}
                                    >
                                        Get started
                                    </Button>
                                </div>

                                <p className="text-muted-foreground mt-12 text-sm">
                                    Includes: Unlimited projects, advanced analytics, and premium support.
                                </p>
                            </div>
                            <div className="relative">
                                <ul
                                    role="list"
                                    className="space-y-4"
                                >
                                    {[
                                        'Unlimited storybooks',
                                        'Advanced analytics',
                                        'Premium support',
                                        'Access to all templates',
                                    ].map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            <Check className="size-3" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-muted-foreground mt-6 text-sm">
                                    Join thousands of creators who use our platform to bring their stories to life.
                                </p>
                                <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
                                    <img
                                        className="h-5 w-fit dark:invert"
                                        src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                        alt="Nvidia Logo"
                                        height="20"
                                        width="auto"
                                    />
                                    <img
                                        className="h-4 w-fit dark:invert"
                                        src="https://html.tailus.io/blocks/customers/column.svg"
                                        alt="Column Logo"
                                        height="16"
                                        width="auto"
                                    />
                                    <img
                                        className="h-4 w-fit dark:invert"
                                        src="https://html.tailus.io/blocks/customers/github.svg"
                                        alt="GitHub Logo"
                                        height="16"
                                        width="auto"
                                    />
                                    <img
                                        className="h-5 w-fit dark:invert"
                                        src="https://html.tailus.io/blocks/customers/nike.svg"
                                        alt="Nike Logo"
                                        height="20"
                                        width="auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}