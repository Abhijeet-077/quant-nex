"use client"

import { useState } from "react"
import { Calendar, Clock, Plus, User, MapPin, Phone, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "../layout/main-layout"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function SchedulePage() {
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      patient: "Priya Sharma",
      time: "09:00 AM",
      type: "Consultation",
      status: "confirmed",
      location: "Room 201",
      phone: "+91 98765 43210"
    },
    {
      id: 2,
      patient: "Arjun Patel",
      time: "10:30 AM",
      type: "Follow-up",
      status: "pending",
      location: "Room 203",
      phone: "+91 87654 32109"
    },
    {
      id: 3,
      patient: "Sneha Gupta",
      time: "02:00 PM",
      type: "Treatment Planning",
      status: "confirmed",
      location: "Room 205",
      phone: "+91 76543 21098"
    },
    {
      id: 4,
      patient: "Rajesh Kumar",
      time: "03:30 PM",
      type: "Telemedicine",
      status: "confirmed",
      location: "Virtual",
      phone: "+91 65432 10987"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsViewModalOpen(true)
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-black min-h-screen">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white glow-text">Schedule & Appointments</h1>
            <p className="text-gray-300 mt-2 text-sm sm:text-base">Manage your patient appointments and consultations</p>
          </div>
          <Dialog open={isAddAppointmentOpen} onOpenChange={setIsAddAppointmentOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 button-glow">
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-black/90 border-blue-500/30">
              <DialogHeader>
                <DialogTitle className="text-white">Schedule New Appointment</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Create a new appointment for a patient consultation or treatment.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="patient" className="text-right text-white">
                    Patient
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3 bg-black/50 border-blue-500/30 text-white">
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-blue-500/30">
                      <SelectItem value="priya">Priya Sharma</SelectItem>
                      <SelectItem value="arjun">Arjun Patel</SelectItem>
                      <SelectItem value="sneha">Sneha Gupta</SelectItem>
                      <SelectItem value="rajesh">Rajesh Kumar</SelectItem>
                      <SelectItem value="kavya">Kavya Singh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right text-white">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    className="col-span-3 bg-black/50 border-blue-500/30 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right text-white">
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    className="col-span-3 bg-black/50 border-blue-500/30 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right text-white">
                    Type
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3 bg-black/50 border-blue-500/30 text-white">
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-blue-500/30">
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="treatment">Treatment Planning</SelectItem>
                      <SelectItem value="telemedicine">Telemedicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right text-white">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes..."
                    className="col-span-3 bg-black/50 border-blue-500/30 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 button-glow"
                  onClick={() => setIsAddAppointmentOpen(false)}
                >
                  Schedule Appointment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Today's Schedule */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-white flex items-center glow-text">
              <Calendar className="h-5 w-5 mr-2 text-blue-400 neon-glow" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-black/30 rounded-lg glow-border-subtle space-y-3 sm:space-y-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-blue-400 mb-1" />
                      <span className="text-sm font-medium text-white">{appointment.time}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white">{appointment.patient}</h3>
                      <p className="text-sm text-gray-300">{appointment.type}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 space-y-1 sm:space-y-0">
                        <div className="flex items-center text-xs text-gray-400">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{appointment.location}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                          <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{appointment.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)} flex-shrink-0`}>
                      {appointment.status}
                    </span>
                    <div className="flex space-x-2">
                      {appointment.location === "Virtual" && (
                        <Button size="sm" variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30 text-xs sm:text-sm">
                          <Video className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">Join</span>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-black/50 border-blue-500/30 text-white hover:bg-black/70 text-xs sm:text-sm"
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Today's Appointments</p>
                  <p className="text-2xl font-bold text-white mt-2 glow-text">{appointments.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-400 neon-glow" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Confirmed</p>
                  <p className="text-2xl font-bold text-green-400 mt-2">{appointments.filter(a => a.status === 'confirmed').length}</p>
                </div>
                <Clock className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400 mt-2">{appointments.filter(a => a.status === 'pending').length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Virtual Consults</p>
                  <p className="text-2xl font-bold text-cyan-400 mt-2">{appointments.filter(a => a.location === 'Virtual').length}</p>
                </div>
                <Video className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Appointment Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[600px] bg-black/90 border-blue-500/30">
            <DialogHeader>
              <DialogTitle className="text-white">Appointment Details</DialogTitle>
              <DialogDescription className="text-gray-300">
                View detailed information about this appointment.
              </DialogDescription>
            </DialogHeader>
            {selectedAppointment && (
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white font-medium">Patient Name</Label>
                    <p className="text-gray-300 bg-black/30 p-3 rounded-lg border border-blue-500/20">
                      {selectedAppointment.patient}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white font-medium">Appointment Time</Label>
                    <p className="text-gray-300 bg-black/30 p-3 rounded-lg border border-blue-500/20">
                      {selectedAppointment.time}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white font-medium">Type</Label>
                    <p className="text-gray-300 bg-black/30 p-3 rounded-lg border border-blue-500/20">
                      {selectedAppointment.type}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white font-medium">Status</Label>
                    <div className="bg-black/30 p-3 rounded-lg border border-blue-500/20">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedAppointment.status)}`}>
                        {selectedAppointment.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white font-medium">Location</Label>
                    <p className="text-gray-300 bg-black/30 p-3 rounded-lg border border-blue-500/20">
                      {selectedAppointment.location}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white font-medium">Phone</Label>
                    <p className="text-gray-300 bg-black/30 p-3 rounded-lg border border-blue-500/20">
                      {selectedAppointment.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewModalOpen(false)}
                className="bg-black/50 border-blue-500/30 text-white hover:bg-black/70"
              >
                Close
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-500 to-cyan-500 button-glow"
                onClick={() => {
                  console.log("Editing appointment:", selectedAppointment)
                  setIsViewModalOpen(false)
                }}
              >
                Edit Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
