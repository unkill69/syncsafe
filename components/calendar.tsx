"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()

  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const monthName = currentMonth.toLocaleString("default", { month: "long" })
  const year = currentMonth.getFullYear()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Sample meeting data
  const meetings = [
    { day: 10, title: "Team Sync", time: "10:00 AM" },
    { day: 15, title: "Product Review", time: "2:00 PM" },
    { day: 22, title: "Client Meeting", time: "11:30 AM" },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>
          {monthName} {year}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {weekdays.map((day) => (
            <div key={day} className="text-center text-sm font-medium py-2">
              {day}
            </div>
          ))}

          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="h-24 p-1 border rounded-md bg-muted/20"></div>
          ))}

          {days.map((day) => {
            const dayMeetings = meetings.filter((m) => m.day === day)
            return (
              <div
                key={day}
                className={cn(
                  "h-24 p-1 border rounded-md hover:bg-muted/50 transition-colors",
                  dayMeetings.length > 0 ? "border-primary/30" : "",
                )}
              >
                <div className="text-sm font-medium">{day}</div>
                <div className="mt-1 space-y-1">
                  {dayMeetings.map((meeting, idx) => (
                    <div key={idx} className="text-xs bg-primary/10 text-primary p-1 rounded truncate">
                      {meeting.time} - {meeting.title}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

