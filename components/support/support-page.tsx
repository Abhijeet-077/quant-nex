"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Search,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Book,
  Video,
  Download,
} from "lucide-react"

interface Ticket {
  id: string
  title: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  createdDate: string
  lastUpdate: string
  description: string
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
}

export function SupportPage() {
  const [activeTab, setActiveTab] = useState("help")
  const [searchTerm, setSearchTerm] = useState("")
  const [newTicket, setNewTicket] = useState({
    title: "",
    category: "",
    priority: "",
    description: "",
  })

  const [tickets] = useState<Ticket[]>([
    {
      id: "TKT-001",
      title: "Unable to access patient records",
      status: "in-progress",
      priority: "high",
      category: "Technical",
      createdDate: "2024-01-20",
      lastUpdate: "2024-01-21",
      description: "Cannot access patient records from the dashboard. Getting error 500.",
    },
    {
      id: "TKT-002",
      title: "Request for additional user training",
      status: "open",
      priority: "medium",
      category: "Training",
      createdDate: "2024-01-18",
      lastUpdate: "2024-01-18",
      description: "Need training on the new AI diagnosis features for our medical team.",
    },
    {
      id: "TKT-003",
      title: "Report generation is slow",
      status: "resolved",
      priority: "low",
      category: "Performance",
      createdDate: "2024-01-15",
      lastUpdate: "2024-01-19",
      description: "Report generation takes too long, especially for large datasets.",
    },
  ])

  const [faqs] = useState<FAQ[]>([
    {
      id: "1",
      question: "How do I reset my password?",
      answer:
        "You can reset your password by clicking on 'Forgot Password' on the login page. You'll receive an email with instructions to create a new password.",
      category: "Account",
      helpful: 45,
    },
    {
      id: "2",
      question: "How accurate is the AI diagnosis system?",
      answer:
        "Our AI diagnosis system has an accuracy rate of 92.7% based on clinical validation studies. However, it should always be used in conjunction with clinical judgment and not as a replacement for professional medical assessment.",
      category: "AI Features",
      helpful: 78,
    },
    {
      id: "3",
      question: "Can I export patient data?",
      answer:
        "Yes, you can export patient data in various formats (PDF, CSV, JSON) from the Reports section. Make sure you have the necessary permissions and follow your institution's data privacy policies.",
      category: "Data Management",
      helpful: 32,
    },
    {
      id: "4",
      question: "How do I schedule automated reports?",
      answer:
        "Go to Reports > Scheduled Reports and click 'Create Schedule'. You can set up daily, weekly, or monthly automated reports with custom parameters.",
      category: "Reports",
      helpful: 28,
    },
    {
      id: "5",
      question: "What browsers are supported?",
      answer:
        "Quant-NEX supports the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using Chrome or Firefox.",
      category: "Technical",
      helpful: 19,
    },
  ])

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500"
      case "in-progress":
        return "bg-yellow-500"
      case "resolved":
        return "bg-green-500"
      case "closed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return "default"
      case "in-progress":
        return "secondary"
      case "resolved":
        return "default"
      case "closed":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-400"
      case "high":
        return "text-orange-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4 text-blue-400" />
      case "in-progress":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "closed":
        return <CheckCircle className="h-4 w-4 text-gray-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const handleTicketSubmit = () => {
    // Submit new ticket logic
    console.log("Submitting ticket:", newTicket)
    // Reset form
    setNewTicket({ title: "", category: "", priority: "", description: "" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-teal-400 flex items-center gap-3">
              <HelpCircle className="h-8 w-8" />
              Help & Support
            </h1>
            <p className="text-gray-300 mt-2">Get help, submit tickets, and access documentation</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="glow-hover bg-transparent">
              <Phone className="h-4 w-4 mr-2" />
              Call Support
            </Button>
            <Button variant="outline" className="glow-hover bg-transparent">
              <Mail className="h-4 w-4 mr-2" />
              Email Support
            </Button>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-glow">
            <CardContent className="p-4 text-center">
              <Phone className="h-8 w-8 text-teal-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">Phone Support</h3>
              <p className="text-sm text-gray-400 mb-2">24/7 Emergency Support</p>
              <p className="text-teal-400 font-medium">+91 1800-QUANTNEX</p>
            </CardContent>
          </Card>
          <Card className="card-glow">
            <CardContent className="p-4 text-center">
              <Mail className="h-8 w-8 text-teal-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">Email Support</h3>
              <p className="text-sm text-gray-400 mb-2">Response within 4 hours</p>
              <p className="text-teal-400 font-medium">support@quantnex.com</p>
            </CardContent>
          </Card>
          <Card className="card-glow">
            <CardContent className="p-4 text-center">
              <MessageSquare className="h-8 w-8 text-teal-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">Live Chat</h3>
              <p className="text-sm text-gray-400 mb-2">Instant assistance</p>
              <Button size="sm" className="btn-glow-primary">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-teal-900/20">
            <TabsTrigger value="help" className="data-[state=active]:bg-teal-600">
              Help Center
            </TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:bg-teal-600">
              Support Tickets
            </TabsTrigger>
            <TabsTrigger value="documentation" className="data-[state=active]:bg-teal-600">
              Documentation
            </TabsTrigger>
            <TabsTrigger value="training" className="data-[state=active]:bg-teal-600">
              Training
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-teal-600">
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="help" className="space-y-6">
            {/* Search */}
            <Card className="card-glow">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search frequently asked questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-teal-900/20 border-teal-500/30"
                  />
                </div>
              </CardContent>
            </Card>

            {/* FAQs */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-teal-400">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white">{faq.question}</h3>
                        <Badge variant="outline" className="text-xs">
                          {faq.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">{faq.answer}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                            👍 Helpful
                          </Button>
                          <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                            👎 Not Helpful
                          </Button>
                        </div>
                        <span className="text-xs text-gray-400">{faq.helpful} people found this helpful</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Create New Ticket */}
              <div className="lg:col-span-1">
                <Card className="card-glow">
                  <CardHeader>
                    <CardTitle className="text-teal-400">Create New Ticket</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Brief description of the issue"
                        value={newTicket.title}
                        onChange={(e) => setNewTicket((prev) => ({ ...prev, title: e.target.value }))}
                        className="bg-teal-900/20 border-teal-500/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newTicket.category}
                        onValueChange={(value) => setNewTicket((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="bg-teal-900/20 border-teal-500/30">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="training">Training Request</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="account">Account Issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTicket.priority}
                        onValueChange={(value) => setNewTicket((prev) => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger className="bg-teal-900/20 border-teal-500/30">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Detailed description of the issue..."
                        value={newTicket.description}
                        onChange={(e) => setNewTicket((prev) => ({ ...prev, description: e.target.value }))}
                        className="bg-teal-900/20 border-teal-500/30 min-h-[100px]"
                      />
                    </div>

                    <Button onClick={handleTicketSubmit} className="w-full btn-glow-primary">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Ticket
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Existing Tickets */}
              <div className="lg:col-span-2">
                <Card className="card-glow">
                  <CardHeader>
                    <CardTitle className="text-teal-400">Your Support Tickets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tickets.map((ticket) => (
                        <div key={ticket.id} className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-white">{ticket.title}</h3>
                              <p className="text-sm text-gray-400">#{ticket.id}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(ticket.status)}
                              <Badge variant={getStatusBadge(ticket.status)}>{ticket.status}</Badge>
                              <Badge variant={getPriorityBadge(ticket.priority)}>{ticket.priority}</Badge>
                            </div>
                          </div>

                          <p className="text-sm text-gray-300 mb-3">{ticket.description}</p>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Category:</span>
                              <p className="text-white">{ticket.category}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Created:</span>
                              <p className="text-white">{new Date(ticket.createdDate).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-teal-500/30">
                            <span className="text-xs text-gray-400">
                              Last updated: {new Date(ticket.lastUpdate).toLocaleDateString()}
                            </span>
                            <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documentation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="card-glow">
                <CardContent className="p-6 text-center">
                  <Book className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-white mb-2">User Manual</h3>
                  <p className="text-sm text-gray-400 mb-4">Comprehensive guide to using all features of Quant-NEX</p>
                  <Button variant="outline" className="w-full glow-hover bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-white mb-2">API Documentation</h3>
                  <p className="text-sm text-gray-400 mb-4">Technical documentation for developers and integrations</p>
                  <Button variant="outline" className="w-full glow-hover bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    View Online
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardContent className="p-6 text-center">
                  <Video className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-white mb-2">Video Tutorials</h3>
                  <p className="text-sm text-gray-400 mb-4">Step-by-step video guides for common tasks</p>
                  <Button variant="outline" className="w-full glow-hover bg-transparent">
                    <Video className="h-4 w-4 mr-2" />
                    Watch Videos
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardContent className="p-6 text-center">
                  <HelpCircle className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-white mb-2">Quick Start Guide</h3>
                  <p className="text-sm text-gray-400 mb-4">Get started with Quant-NEX in 10 minutes</p>
                  <Button variant="outline" className="w-full glow-hover bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download Guide
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-white mb-2">Release Notes</h3>
                  <p className="text-sm text-gray-400 mb-4">Latest updates and feature releases</p>
                  <Button variant="outline" className="w-full glow-hover bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    View Changes
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardContent className="p-6 text-center">
                  <Book className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-white mb-2">Best Practices</h3>
                  <p className="text-sm text-gray-400 mb-4">Recommended workflows and optimization tips</p>
                  <Button variant="outline" className="w-full glow-hover bg-transparent">
                    <Book className="h-4 w-4 mr-2" />
                    Read Guide
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400">Available Training Programs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Basic User Training</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      2-hour session covering basic navigation and core features
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="default" className="bg-green-600">
                        Available
                      </Badge>
                      <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                        Schedule
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Advanced AI Features</h3>
                    <p className="text-sm text-gray-400 mb-3">4-hour deep dive into AI diagnosis and analysis tools</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="default" className="bg-green-600">
                        Available
                      </Badge>
                      <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                        Schedule
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Administrator Training</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Full-day training for system administrators and IT staff
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">On Request</Badge>
                      <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                        Request
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Custom Training</h3>
                    <p className="text-sm text-gray-400 mb-3">Tailored training sessions for specific workflows</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">On Request</Badge>
                      <Button variant="outline" size="sm" className="glow-hover bg-transparent">
                        Contact Us
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400">Training Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Interactive Tutorials</h3>
                    <p className="text-sm text-gray-400 mb-3">Self-paced interactive tutorials for all skill levels</p>
                    <Button variant="outline" className="w-full glow-hover bg-transparent">
                      Start Learning
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Webinar Recordings</h3>
                    <p className="text-sm text-gray-400 mb-3">Access to recorded training webinars and Q&A sessions</p>
                    <Button variant="outline" className="w-full glow-hover bg-transparent">
                      View Library
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Certification Program</h3>
                    <p className="text-sm text-gray-400 mb-3">Become a certified Quant-NEX power user</p>
                    <Button variant="outline" className="w-full glow-hover bg-transparent">
                      Learn More
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-teal-900/10 border border-teal-500/30">
                    <h3 className="font-semibold text-white mb-2">Training Calendar</h3>
                    <p className="text-sm text-gray-400 mb-3">View upcoming training sessions and events</p>
                    <Button variant="outline" className="w-full glow-hover bg-transparent">
                      View Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-teal-400" />
                      <div>
                        <h4 className="font-medium text-white">Phone Support</h4>
                        <p className="text-sm text-gray-400">+91 1800-QUANTNEX (24/7)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-teal-400" />
                      <div>
                        <h4 className="font-medium text-white">Email Support</h4>
                        <p className="text-sm text-gray-400">support@quantnex.com</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-teal-400" />
                      <div>
                        <h4 className="font-medium text-white">Live Chat</h4>
                        <p className="text-sm text-gray-400">Available 9 AM - 6 PM IST</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-teal-500/30">
                    <h4 className="font-medium text-white mb-3">Office Hours</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monday - Friday:</span>
                        <span className="text-white">9:00 AM - 6:00 PM IST</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Saturday:</span>
                        <span className="text-white">10:00 AM - 4:00 PM IST</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sunday:</span>
                        <span className="text-white">Emergency only</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-teal-400">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Name</Label>
                    <Input
                      id="contact-name"
                      placeholder="Your full name"
                      className="bg-teal-900/20 border-teal-500/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="bg-teal-900/20 border-teal-500/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-subject">Subject</Label>
                    <Input
                      id="contact-subject"
                      placeholder="Brief subject line"
                      className="bg-teal-900/20 border-teal-500/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Your message..."
                      className="bg-teal-900/20 border-teal-500/30 min-h-[120px]"
                    />
                  </div>

                  <Button className="w-full btn-glow-primary">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
