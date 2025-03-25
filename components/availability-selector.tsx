"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export function AvailabilitySelector() {
  const [date, setDate] = useState(new Date())
  const [availability, setAvailability] = useState<number[]>(Array(16).fill(0))

  // Time slots from 8 AM to 8 PM in 30-minute increments
  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8
    const minute = (i % 2) * 30
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  })

  const handleAvailabilityChange = (index: number, value: number[]) => {
    const newAvailability = [...availability]
    newAvailability[index] = value[0]
    setAvailability(newAvailability)
  }

  const getPreferenceLabel = (value: number) => {
    if (value === 0) return "Unavailable"
    if (value === 1) return "Low"
    if (value === 2) return "Medium-Low"
    if (value === 3) return "Medium"
    if (value === 4) return "Medium-High"
    return "High"
  }

  const getPreferenceColor = (value: number) => {
    if (value === 0) return "bg-gray-200 dark:bg-gray-700"
    if (value === 1) return "bg-red-200 dark:bg-red-900"
    if (value === 2) return "bg-orange-200 dark:bg-orange-900"
    if (value === 3) return "bg-yellow-200 dark:bg-yellow-900"
    if (value === 4) return "bg-green-200 dark:bg-green-900"
    return "bg-emerald-200 dark:bg-emerald-900"
  }

  const handleSubmit = () => {
    // Convert to one-hot vector for privacy-preserving computation
    const oneHotVector = availability.map((value) => (value > 0 ? 1 : 0))

    console.log("Availability Vector:", oneHotVector)
    console.log("Preference Vector:", availability)

    // Here we would call the ICP canister to submit the availability
    alert("Availability submitted successfully!")
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Date</Label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setDate(new Date())}
            className={cn(format(date) === format(new Date()) && "border-primary text-primary")}
          >
            Today
          </Button>
          <Button
            variant="outline"
            onClick={() => setDate(addDays(new Date(), 1))}
            className={cn(format(date) === format(addDays(new Date(), 1)) && "border-primary text-primary")}
          >
            Tomorrow
          </Button>
          <Button
            variant="outline"
            onClick={() => setDate(addDays(new Date(), 2))}
            className={cn(format(date) === format(addDays(new Date(), 2)) && "border-primary text-primary")}
          >
            {format(addDays(new Date(), 2), "EEE, MMM d")}
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Time Slot</span>
          <span>Preference (0-5)</span>
        </div>

        <div className="space-y-4 mt-2">
          {timeSlots.map((time, index) => (
            <div key={index} className="grid grid-cols-[1fr_2fr] gap-4 items-center">
              <div className="text-sm font-medium">{time}</div>
              <div className="flex items-center gap-4">
                <Slider
                  value={[availability[index]]}
                  min={0}
                  max={5}
                  step={1}
                  onValueChange={(value) => handleAvailabilityChange(index, value)}
                  className="flex-1"
                />
                <div
                  className={cn("w-24 text-center text-xs py-1 px-2 rounded", getPreferenceColor(availability[index]))}
                >
                  {getPreferenceLabel(availability[index])}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Submit Availability
      </Button>
    </div>
  )
}

// Helper functions
function format(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

