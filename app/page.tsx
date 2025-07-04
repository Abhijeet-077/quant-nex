import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Quant-NEX Medical
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Advanced medical application for healthcare professionals with 3D visualizations,
            patient management, and comprehensive medical records.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-3 text-lg">
                Login to Dashboard
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-3 text-lg">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-blue-400">Patient Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Comprehensive patient records, medical history, and treatment tracking
                with HIPAA-compliant security.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-green-400">3D Medical Models</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Interactive 3D visualizations of human anatomy, brain structures,
                and medical conditions for enhanced diagnosis.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-purple-400">Appointment System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Advanced scheduling system with calendar integration,
                automated reminders, and treatment planning.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-400">
            Built for healthcare professionals with modern technology and security standards.
          </p>
        </div>
      </div>
    </div>
  )
}
