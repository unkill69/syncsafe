"use client"

import { useState } from "react"
import { Calendar } from "@/components/calendar"
import { MeetingForm } from "@/components/meeting-form"
import { AvailabilitySelector } from "@/components/availability-selector"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { MeetingCard } from "@/components/meeting-card"

export default function Home() {
  const { isAuthenticated, login, logout, user } = useAuth()
  const [activeTab, setActiveTab] = useState("calendar")

  // Sample meeting data
  const meetings = [
    {
      id: "meeting-1",
      title: "Team Sync 1",
      description: "Weekly team sync to discuss progress",
      date: new Date(2025, 2, 21),
      duration: 30,
      participants: 3,
    },
    {
      id: "meeting-2",
      title: "Product Review",
      description: "Review the latest product features",
      date: new Date(2025, 2, 22),
      duration: 60,
      participants: 5,
    },
    {
      id: "meeting-3",
      title: "Client Meeting",
      description: "Discuss project requirements with the client",
      date: new Date(2025, 2, 23),
      duration: 45,
      participants: 4,
    },
  ]

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">SyncSafe</h1>
            <p className="text-gray-500 dark:text-gray-400">
              A decentralized, privacy-preserving calendar matching system
            </p>
          </div>
          <Button size="lg" onClick={login} className="w-full">
            Login with Internet Identity
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} onLogout={logout} />
      <main className="flex-1 p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <TabsList>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
              <TabsTrigger value="create">Create Meeting</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calendar" className="space-y-4">
            <Calendar />
          </TabsContent>

          <TabsContent value="meetings" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {meetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Meeting</CardTitle>
                <CardDescription>Set up a new privacy-preserving meeting</CardDescription>
              </CardHeader>
              <CardContent>
                <MeetingForm onSubmit={() => setActiveTab("meetings")} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Set Your Availability</CardTitle>
                <CardDescription>Select your available time slots and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <AvailabilitySelector />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

