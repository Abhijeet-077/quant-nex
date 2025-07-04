"use client"

import type React from "react"

import { useState } from "react"
import {
  ActivityIcon,
  Book,
  BrainCircuitIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FileQuestion,
  HelpCircle,
  Loader2,
  MessageSquare,
  Search,
  Send,
  ShieldIcon,
  SyringeIcon,
  UsersIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainLayout } from "../layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

export function SupportPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    // Simulate search
    setTimeout(() => {
      setIsSearching(false)
      toast({
        title: "Search completed",
        description: `Found 3 results for "${searchQuery}"`,
      })
    }, 1000)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    setIsSending(true)

    // Simulate sending message
    setTimeout(() => {
      setIsSending(false)
      setMessage("")
      toast({
        title: "Message sent",
        description: "Your message has been sent to support. We'll get back to you soon.",
      })
    }, 1000)
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Help & Support</h1>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <Card className="bg-black/10 backdrop-blur-sm border-white/10">
              <Tabs defaultValue="faq">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Support Center</CardTitle>
                    <TabsList>
                      <TabsTrigger value="faq">
                        <FileQuestion className="h-4 w-4 mr-2" />
                        FAQ
                      </TabsTrigger>
                      <TabsTrigger value="documentation">
                        <Book className="h-4 w-4 mr-2" />
                        Documentation
                      </TabsTrigger>
                      <TabsTrigger value="contact">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Us
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <CardDescription>Find answers to your questions or contact our support team.</CardDescription>
                </CardHeader>
                <CardContent>
                  <TabsContent value="faq" className="space-y-6">
                    <form onSubmit={handleSearch} className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search for answers..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8"
                        disabled={isSearching}
                      >
                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                      </Button>
                    </form>

                    <div className="space-y-4">
                      <FaqItem
                        question="How do I upload a new patient scan?"
                        answer="To upload a new patient scan, navigate to the Diagnosis page and click on the 'Upload Image' button. You can then select the scan file from your computer or drag and drop it into the designated area."
                      />
                      <FaqItem
                        question="How does the AI detection work?"
                        answer="Our AI detection system uses advanced neural networks trained on thousands of medical images to identify and classify cancer. The system analyzes the uploaded scans, identifies regions of interest, and provides diagnostic suggestions with confidence scores."
                      />
                      <FaqItem
                        question="What is quantum-enhanced treatment optimization?"
                        answer="Quantum-enhanced treatment optimization uses quantum computing algorithms to explore vast solution spaces that would be impossible with classical computing. This allows for more precise and personalized treatment plans that consider numerous variables simultaneously."
                      />
                      <FaqItem
                        question="How accurate are the survival predictions?"
                        answer="Our survival predictions are based on comprehensive statistical models that consider patient demographics, cancer type and stage, genetic markers, and treatment response. The predictions include confidence intervals to indicate the range of possible outcomes."
                      />
                      <FaqItem
                        question="Can I collaborate with other doctors on a case?"
                        answer="Yes, you can collaborate with other doctors by using the collaboration features on the Diagnosis page. You can share annotations, request second opinions, and participate in discussion threads for each case."
                      />
                      <FaqItem
                        question="How is patient data secured?"
                        answer="Patient data is secured using industry-standard encryption both in transit and at rest. We implement strict access controls, regular security audits, and comply with all relevant healthcare data protection regulations."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="documentation" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DocumentationCard
                        title="Getting Started Guide"
                        description="Learn the basics of using Quant-NEX for cancer diagnosis and treatment planning."
                        icon={<Book className="h-5 w-5" />}
                      />
                      <DocumentationCard
                        title="AI Detection System"
                        description="Detailed documentation on how our AI detection system works and how to interpret results."
                        icon={<BrainCircuitIcon className="h-5 w-5" />}
                      />
                      <DocumentationCard
                        title="Treatment Planning"
                        description="Guide to using the quantum-enhanced treatment planning tools for optimal results."
                        icon={<SyringeIcon className="h-5 w-5" />}
                      />
                      <DocumentationCard
                        title="Patient Monitoring"
                        description="How to use the monitoring tools to track patient progress and treatment response."
                        icon={<ActivityIcon className="h-5 w-5" />}
                      />
                      <DocumentationCard
                        title="Collaboration Features"
                        description="Learn how to collaborate with colleagues and request second opinions."
                        icon={<UsersIcon className="h-5 w-5" />}
                      />
                      <DocumentationCard
                        title="Data Security"
                        description="Information about our security measures and data protection policies."
                        icon={<ShieldIcon className="h-5 w-5" />}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-6">
                    <div className="space-y-4">
                      <p className="text-gray-300">
                        Can't find what you're looking for? Send us a message and our support team will get back to you
                        as soon as possible.
                      </p>

                      <form onSubmit={handleSendMessage} className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="subject" className="text-sm font-medium">
                            Subject
                          </label>
                          <select
                            id="subject"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select a subject</option>
                            <option value="technical">Technical Issue</option>
                            <option value="account">Account Question</option>
                            <option value="billing">Billing Inquiry</option>
                            <option value="feature">Feature Request</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="message" className="text-sm font-medium">
                            Message
                          </label>
                          <textarea
                            id="message"
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe your issue or question in detail..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button type="submit" disabled={isSending || !message.trim()}>
                            {isSending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Send Message
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          <div className="col-span-12 md:col-span-4 space-y-6">
            <Card className="bg-black/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle>Support Team</CardTitle>
                <CardDescription>Our team is here to help you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Support Agent" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-400">Technical Support</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Support Agent" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Jane Smith</p>
                    <p className="text-sm text-gray-400">Account Manager</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Support Agent" />
                    <AvatarFallback>RJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Robert Johnson</p>
                    <p className="text-sm text-gray-400">Medical Specialist</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Alternative ways to reach us.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-400">support@quant-nex.com</p>
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-gray-400">+1 (800) 123-4567</p>
                </div>
                <div>
                  <p className="font-medium">Hours</p>
                  <p className="text-sm text-gray-400">Monday - Friday: 9am - 5pm EST</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>Helpful resources for common tasks.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      User Manual
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      Video Tutorials
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      API Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      System Status
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      Release Notes
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        className="flex justify-between items-center w-full p-4 text-left bg-black/20 hover:bg-black/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium flex items-center">
          <HelpCircle className="h-4 w-4 mr-2 text-cyan-400" />
          {question}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        )}
      </button>
      {isOpen && <div className="p-4 bg-black/10">{answer}</div>}
    </div>
  )
}

function DocumentationCard({
  title,
  description,
  icon,
}: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <Card className="bg-black/20 border-white/10 hover:border-white/20 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-500">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-300">{description}</p>
        <div className="flex justify-end mt-4">
          <Button variant="outline" size="sm">
            Read More
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
