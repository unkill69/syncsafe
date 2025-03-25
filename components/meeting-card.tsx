"use client"

import { useState } from "react"
import { CalendarIcon, Clock, Copy, Share2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"

interface MeetingCardProps {
  meeting: {
    id: string
    title: string
    description: string
    date: Date
    duration: number
    participants: number
  }
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  const [showShareDialog, setShowShareDialog] = useState(false)

  // Generate a shareable link for the meeting
  const shareableLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/${meeting.id}`
      : `https://syncsafe.example.com/${meeting.id}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink)
    toast({
      title: "Link copied!",
      description: "The meeting link has been copied to your clipboard.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{meeting.title}</CardTitle>
        <CardDescription>{format(meeting.date, "MMMM d, yyyy")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
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
          <span>{meeting.participants} participants</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm">
          View Details
        </Button>

        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Meeting</DialogTitle>
              <DialogDescription>
                Share this link with participants to let them select their availability without revealing their full
                calendar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="share-link">Shareable Link</Label>
                <div className="flex items-center gap-2">
                  <Input id="share-link" value={shareableLink} readOnly />
                  <Button variant="outline" size="icon" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowShareDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="destructive" size="sm">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  )
}

