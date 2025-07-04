"use client"

import { useState } from "react"
import { MessageSquare, Video, Phone, Send, Paperclip, Mic, Camera, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MainLayout } from "../layout/main-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function ConsultationPage() {
  const [message, setMessage] = useState("")
  const [activeChat, setActiveChat] = useState("priya-sharma")

  // Mock consultation data
  const consultations = [
    {
      id: "priya-sharma",
      patient: "Priya Sharma",
      status: "online",
      lastMessage: "Thank you for the treatment plan, Doctor.",
      time: "2 min ago",
      unread: 2,
      avatar: "/placeholder-user.jpg"
    },
    {
      id: "arjun-patel",
      patient: "Arjun Patel",
      status: "offline",
      lastMessage: "When is my next appointment?",
      time: "1 hour ago",
      unread: 0,
      avatar: "/placeholder-user.jpg"
    },
    {
      id: "sneha-gupta",
      patient: "Sneha Gupta",
      status: "online",
      lastMessage: "I have some questions about the medication.",
      time: "3 hours ago",
      unread: 1,
      avatar: "/placeholder-user.jpg"
    }
  ]

  const messages = [
    {
      id: 1,
      sender: "patient",
      content: "Hello Doctor, I wanted to discuss my recent test results.",
      time: "10:30 AM",
      type: "text"
    },
    {
      id: 2,
      sender: "doctor",
      content: "Hello Priya! I've reviewed your results. Overall, they look very promising. Your tumor markers have decreased significantly.",
      time: "10:32 AM",
      type: "text"
    },
    {
      id: 3,
      sender: "patient",
      content: "That's wonderful news! What does this mean for my treatment plan?",
      time: "10:33 AM",
      type: "text"
    },
    {
      id: 4,
      sender: "doctor",
      content: "We can proceed with the next phase of treatment. I'll send you the updated treatment plan shortly.",
      time: "10:35 AM",
      type: "text"
    },
    {
      id: 5,
      sender: "patient",
      content: "Thank you for the treatment plan, Doctor.",
      time: "10:40 AM",
      type: "text"
    }
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would implement the actual message sending logic
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  const getStatusColor = (status: string) => {
    return status === "online" ? "bg-green-500" : "bg-gray-500"
  }

  return (
    <MainLayout>
      <div className="p-6 bg-black min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white glow-text">Patient Consultations</h1>
          <p className="text-gray-300 mt-2 text-sm sm:text-base">Communicate with your patients through secure messaging and video calls</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 h-[calc(100vh-200px)]">
          {/* Consultation List */}
          <div className="lg:col-span-4 lg:h-full">
            <div className="lg:hidden mb-4">
              <select className="w-full bg-black/50 border-blue-500/30 text-white rounded-lg p-2">
                <option>Priya Sharma</option>
                <option>Arjun Patel</option>
                <option>Sneha Gupta</option>
              </select>
            </div>
            <Card className="card-glow h-full hidden lg:block">
              <CardHeader>
                <CardTitle className="text-white flex items-center glow-text">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-400 neon-glow" />
                  Active Consultations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2">
                  {consultations.map((consultation) => (
                    <div
                      key={consultation.id}
                      className={`p-4 cursor-pointer transition-all duration-200 ${
                        activeChat === consultation.id
                          ? "bg-blue-500/20 border-l-4 border-blue-500"
                          : "hover:bg-black/30"
                      }`}
                      onClick={() => setActiveChat(consultation.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={consultation.avatar} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                              {consultation.patient.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${getStatusColor(consultation.status)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white truncate">{consultation.patient}</h3>
                            <span className="text-xs text-gray-400">{consultation.time}</span>
                          </div>
                          <p className="text-sm text-gray-300 truncate">{consultation.lastMessage}</p>
                        </div>
                        {consultation.unread > 0 && (
                          <Badge className="bg-blue-500 text-white">{consultation.unread}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-8">
            <Card className="card-glow h-full flex flex-col">
              <CardHeader className="border-b border-blue-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                        PS
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-white">Priya Sharma</h3>
                      <p className="text-sm text-green-400">Online</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="bg-black/50 border-blue-500/30 text-white hover:bg-black/70">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="bg-black/50 border-blue-500/30 text-white hover:bg-black/70">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="bg-black/50 border-blue-500/30 text-white hover:bg-black/70">
                      <Users className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'doctor'
                          ? 'bg-blue-500 text-white'
                          : 'bg-black/30 text-white border border-blue-500/30'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'doctor' ? 'text-blue-100' : 'text-gray-400'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t border-blue-500/30">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" className="bg-black/50 border-blue-500/30 text-white hover:bg-black/70">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="bg-black/50 border-blue-500/30 text-white hover:bg-black/70">
                    <Camera className="h-4 w-4" />
                  </Button>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-black/50 border-blue-500/30 text-white placeholder:text-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button size="sm" variant="outline" className="bg-black/50 border-blue-500/30 text-white hover:bg-black/70">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 button-glow"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
