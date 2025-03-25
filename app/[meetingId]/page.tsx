"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AvailabilitySelector } from "@/components/availability-selector"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"

export default function SharedMeetingPage({ params }: { params: { meetingId: string } }) {
  const router = useRouter()
  const { meetingId } = params
  const [meeting, setMeeting] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  // In a real app, we would fetch the meeting details from the ICP canister
  useEffect(() => {
    // Simulate fetching meeting data
    setTimeout(() => {
      setMeeting({
        id: meetingId,
        title: "Team Planning Session",
        description: "Quarterly planning session to align on goals and priorities",
        date: new Date(2025, 2, 15),
        duration: 60,
        organizer: {
          name: "Alex Johnson",
          principal: "2vxsx-fae",
        },
      })
      setLoading(false)
    }, 1000)
  }, [meetingId])

  const handleSubmit = () => {
    // In a real app, we would submit the availability to the ICP canister
    console.log("Submitting availability for:", name, email)

    // Simulate submission
    setTimeout(() => {
      setSubmitted(true)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">SyncSafe</h1>
            <p className="text-gray-500 dark:text-gray-400">Loading meeting details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Thank You!</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Your availability has been submitted. The organizer will finalize the meeting time soon.
            </p>
            <Button className="mt-4" onClick={() => router.push("/")}>
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
              <span className="text-primary-foreground font-semibold text-sm">S</span>
            </div>
            <span className="font-bold">SyncSafe</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{meeting.title}</CardTitle>
            <CardDescription>{meeting.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{format(meeting.date, "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{meeting.duration} minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Organized by {meeting.organizer.name}</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Select Your Availability</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred time slots. Your full calendar remains private.
                </p>
                <AvailabilitySelector />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} className="w-full" disabled={!name || !email}>
              Submit Availability
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Powered by SyncSafe - Privacy-preserving scheduling on the Internet Computer</p>
        </div>
      </div>
    </div>
  )
}

