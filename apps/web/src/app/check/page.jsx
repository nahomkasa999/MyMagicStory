"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  const [bgColor, setBgColor] = useState("background")

  const colors = [
    "background",
    "foreground",
    "card",
    "card-foreground",
    "primary",
    "primary-foreground",
    "secondary",
    "secondary-foreground",
    "accent",
    "accent-foreground",
    "destructive",
    "destructive-foreground",
    "muted",
    "muted-foreground",
    "border",
    "input",
    "ring",
  ]

  return (
    <div
      className={`min-h-screen w-screen text-foreground p-6 font-sans space-y-8 transition-colors duration-500 bg-${bgColor}`}
    >
      {/* Typography */}
      <section>
        <h1 className="text-4xl font-bold">Heading 1</h1>
        <h2 className="text-3xl font-semibold">Heading 2</h2>
        <h3 className="text-2xl font-medium">Heading 3</h3>
        <p className="text-base">This is normal body text.</p>
        <p className="text-sm text-muted-foreground">
          This is muted foreground text.
        </p>
      </section>

      {/* Color Palette */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {colors.map((color) => (
          <div
            key={color}
            onClick={() => setBgColor(color)}
            className={`space-y-2 cursor-pointer transform hover:scale-105 transition-all duration-300`}
          >
            <div
              className={`h-16 w-full rounded-lg bg-${color} border border-border`}
            ></div>
            <p className="text-xs">{color}</p>
          </div>
        ))}
      </section>

      {/* Card Test */}
      <Card className="bg-card text-card-foreground rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>
            Card description using card-foreground color
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Some card content to test spacing, colors, and typography.</p>
        </CardContent>
      </Card>

      {/* Buttons & States */}
      <section className="flex flex-wrap gap-4">
        {["primary", "secondary", "accent", "destructive"].map((btn) => (
          <button
            key={btn}
            onClick={() => setBgColor(btn)}
            className={`bg-${btn} text-${btn}-foreground px-4 py-2 rounded-lg shadow transition-all duration-300 hover:scale-105`}
          >
            {btn.charAt(0).toUpperCase() + btn.slice(1)}
          </button>
        ))}
      </section>
    </div>
  )
}
